import { db } from "./db";
import { 
  leasingContracts, 
  contractContainers, 
  perDiemInvoices, 
  perDiemInvoiceItems,
  billingSchedule,
  paymentMethods,
  paymentAttempts,
  dunningCampaigns
} from "@shared/schema";
import { eq, and, lt, isNull, gte, desc } from "drizzle-orm";

export class PerDiemBillingService {
  private readonly DEFAULT_PER_DIEM_RATE = 5.00; // $5 per day per container
  private readonly INVOICE_DUE_DAYS = 1; // Due next day
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly RETRY_INTERVAL_HOURS = 24;

  /**
   * Main automation function - processes all contracts needing per diem billing
   */
  async processAutomatedBilling(): Promise<void> {
    console.log('[PerDiemBilling] Starting automated billing process...');
    
    try {
      // Get all active contracts with expired free days
      const contractsNeedingBilling = await this.getContractsNeedingBilling();
      
      for (const contract of contractsNeedingBilling) {
        await this.processContractBilling(contract);
      }
      
      // Process retry attempts for failed payments
      await this.processPaymentRetries();
      
      console.log(`[PerDiemBilling] Completed billing for ${contractsNeedingBilling.length} contracts`);
    } catch (error) {
      console.error('[PerDiemBilling] Error in automated billing:', error);
      throw error;
    }
  }

  /**
   * Get contracts that need per diem billing (past free days with unreturned containers)
   */
  private async getContractsNeedingBilling() {
    const today = new Date();
    
    return await db
      .select({
        contract: leasingContracts,
        containers: contractContainers
      })
      .from(leasingContracts)
      .leftJoin(contractContainers, eq(leasingContracts.id, contractContainers.contractId))
      .where(
        and(
          eq(leasingContracts.status, 'active'),
          lt(leasingContracts.endDate, today), // Past free days
          eq(contractContainers.status, 'picked_up'), // Container not returned
          isNull(contractContainers.returnDate)
        )
      );
  }

  /**
   * Process billing for a specific contract
   */
  private async processContractBilling(contractData: any): Promise<void> {
    const { contract } = contractData;
    
    try {
      // Get unreturned containers for this contract
      const unreturnedContainers = await db
        .select()
        .from(contractContainers)
        .where(
          and(
            eq(contractContainers.contractId, contract.id),
            eq(contractContainers.status, 'picked_up'),
            isNull(contractContainers.returnDate)
          )
        );

      if (unreturnedContainers.length === 0) return;

      // Calculate days overdue
      const today = new Date();
      const endDate = new Date(contract.endDate);
      const daysOverdue = Math.ceil((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysOverdue <= 0) return;

      // Check if we already billed for today
      const existingInvoice = await this.getTodaysInvoice(contract.id);
      if (existingInvoice) return;

      // Create per diem invoice
      await this.createPerDiemInvoice(contract, unreturnedContainers, daysOverdue);
      
    } catch (error) {
      console.error(`[PerDiemBilling] Error processing contract ${contract.contractNumber}:`, error);
    }
  }

  /**
   * Check if we already created an invoice for today
   */
  private async getTodaysInvoice(contractId: number) {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const [invoice] = await db
      .select()
      .from(perDiemInvoices)
      .where(
        and(
          eq(perDiemInvoices.contractId, contractId),
          gte(perDiemInvoices.billingDate, startOfDay),
          lt(perDiemInvoices.billingDate, endOfDay)
        )
      )
      .limit(1);

    return invoice;
  }

  /**
   * Create per diem invoice and attempt payment
   */
  private async createPerDiemInvoice(contract: any, containers: any[], daysOverdue: number): Promise<void> {
    const today = new Date();
    const dueDate = new Date(today.getTime() + this.INVOICE_DUE_DAYS * 24 * 60 * 60 * 1000);
    
    // Calculate invoice amounts
    const perDiemRate = parseFloat(contract.perDiemRate) || this.DEFAULT_PER_DIEM_RATE;
    const totalAmount = containers.length * perDiemRate * 1; // Daily billing (1 day)
    
    // Generate invoice number
    const invoiceNumber = `PD-${contract.contractNumber}-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    
    // Get user's default payment method
    const defaultPaymentMethods = await db
      .select()
      .from(paymentMethods)
      .where(
        and(
          eq(paymentMethods.userId, contract.userId),
          eq(paymentMethods.isDefault, true),
          eq(paymentMethods.isActive, true)
        )
      )
      .limit(1);
    
    const defaultPaymentMethod = defaultPaymentMethods[0] || null;

    // Create invoice
    const [invoice] = await db
      .insert(perDiemInvoices)
      .values({
        userId: contract.userId,
        contractId: contract.id,
        invoiceNumber,
        billingDate: today,
        dueDate,
        totalAmount: totalAmount.toString(),
        perDiemRate: perDiemRate.toString(),
        daysOverdue: 1, // Daily billing
        containerCount: containers.length,
        status: 'pending',
        paymentMethodId: defaultPaymentMethod?.id || null,
        retryCount: 0
      })
      .returning();

    // Create invoice line items
    const lineItems = containers.map(container => ({
      invoiceId: invoice.id,
      containerNumber: container.containerNumber,
      containerType: container.containerType,
      daysOverdue: 1,
      perDiemRate: perDiemRate.toString(),
      lineAmount: perDiemRate.toString()
    }));

    await db.insert(perDiemInvoiceItems).values(lineItems);

    // Attempt automatic payment if payment method exists
    if (defaultPaymentMethod) {
      await this.attemptAutomaticPayment(invoice, defaultPaymentMethod);
    } else {
      // Start dunning campaign for manual payment
      await this.initiateDunningCampaign(invoice, 'reminder');
    }

    console.log(`[PerDiemBilling] Created invoice ${invoiceNumber} for $${totalAmount} (${containers.length} containers)`);
  }

  /**
   */
  private async attemptAutomaticPayment(invoice: any, paymentMethod: any): Promise<void> {
    try {
      // Record payment attempt
      const [attempt] = await db
        .insert(paymentAttempts)
        .values({
          invoiceId: invoice.id,
          paymentMethodId: paymentMethod.id,
          attemptNumber: invoice.retryCount + 1,
          amount: invoice.totalAmount,
          status: 'pending',
          attemptedAt: new Date()
        })
        .returning();

      // Payment processing removed
      const paymentData = {
        intent: 'CAPTURE',
        amount: parseFloat(invoice.totalAmount),
        currency: 'USD'
      };

      // Note: In production, you would use stored payment method tokens
      // For demo purposes, we'll mark as failed to trigger dunning
      const paymentSuccess = false; // Simulate payment failure for demo

      if (paymentSuccess) {
        // Update invoice as paid
        await db
          .update(perDiemInvoices)
          .set({
            status: 'paid',
            paidAt: new Date()
          })
          .where(eq(perDiemInvoices.id, invoice.id));

        // Update payment attempt
        await db
          .update(paymentAttempts)
          .set({
            status: 'success',
            completedAt: new Date()
          })
          .where(eq(paymentAttempts.id, attempt.id));

        console.log(`[PerDiemBilling] Payment successful for invoice ${invoice.invoiceNumber}`);
      } else {
        // Payment failed - schedule retry
        await this.handlePaymentFailure(invoice, attempt, 'Payment method declined');
      }

    } catch (error) {
      console.error(`[PerDiemBilling] Payment error for invoice ${invoice.invoiceNumber}:`, error);
      
      const [attempt] = await db
        .select()
        .from(paymentAttempts)
        .where(eq(paymentAttempts.invoiceId, invoice.id))
        .orderBy(desc(paymentAttempts.attemptedAt))
        .limit(1);

      if (attempt) {
        await this.handlePaymentFailure(invoice, attempt, error.message);
      }
    }
  }

  /**
   * Handle payment failure and schedule retries
   */
  private async handlePaymentFailure(invoice: any, attempt: any, reason: string): Promise<void> {
    const nextRetryAt = new Date(Date.now() + this.RETRY_INTERVAL_HOURS * 60 * 60 * 1000);
    
    // Update payment attempt
    await db
      .update(paymentAttempts)
      .set({
        status: 'failed',
        failureReason: reason,
        completedAt: new Date()
      })
      .where(eq(paymentAttempts.id, attempt.id));

    // Update invoice
    const newRetryCount = invoice.retryCount + 1;
    const shouldRetry = newRetryCount < this.MAX_RETRY_ATTEMPTS;

    await db
      .update(perDiemInvoices)
      .set({
        status: shouldRetry ? 'pending' : 'failed',
        retryCount: newRetryCount,
        nextRetryAt: shouldRetry ? nextRetryAt : null,
        lastFailureReason: reason
      })
      .where(eq(perDiemInvoices.id, invoice.id));

    if (shouldRetry) {
      console.log(`[PerDiemBilling] Payment failed for ${invoice.invoiceNumber}, retry scheduled for ${nextRetryAt}`);
    } else {
      console.log(`[PerDiemBilling] Payment failed permanently for ${invoice.invoiceNumber}, starting dunning campaign`);
      await this.initiateDunningCampaign(invoice, 'warning');
    }
  }

  /**
   * Process payment retries for failed invoices
   */
  private async processPaymentRetries(): Promise<void> {
    const now = new Date();
    
    // Get invoices ready for retry
    const invoicesForRetry = await db
      .select()
      .from(perDiemInvoices)
      .where(
        and(
          eq(perDiemInvoices.status, 'pending'),
          lt(perDiemInvoices.nextRetryAt, now),
          lt(perDiemInvoices.retryCount, this.MAX_RETRY_ATTEMPTS)
        )
      );

    for (const invoice of invoicesForRetry) {
      // Get payment method
      const [paymentMethod] = await db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.id, invoice.paymentMethodId))
        .limit(1);

      if (paymentMethod) {
        await this.attemptAutomaticPayment(invoice, paymentMethod);
      }
    }
  }

  /**
   * Initiate dunning campaign for failed payments
   */
  private async initiateDunningCampaign(invoice: any, campaignType: string): Promise<void> {
    const startDate = new Date();
    const nextActionDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Next day

    await db
      .insert(dunningCampaigns)
      .values({
        userId: invoice.userId,
        invoiceId: invoice.id,
        campaignType,
        status: 'active',
        startDate,
        nextActionDate,
        emailsSent: 0,
        callsMade: 0,
        noticesSent: 0
      });

    console.log(`[PerDiemBilling] Started ${campaignType} dunning campaign for invoice ${invoice.invoiceNumber}`);
  }

  /**
   * Get billing statistics for dashboard
   */
  async getBillingStats(userId: string) {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const stats = await db
      .select({
        totalInvoices: perDiemInvoices.id,
        totalAmount: perDiemInvoices.totalAmount,
        status: perDiemInvoices.status
      })
      .from(perDiemInvoices)
      .where(
        and(
          eq(perDiemInvoices.userId, userId),
          gte(perDiemInvoices.billingDate, startOfMonth)
        )
      );

    return {
      totalInvoicesThisMonth: stats.length,
      totalAmountThisMonth: stats.reduce((sum, s) => sum + parseFloat(s.totalAmount), 0),
      paidInvoices: stats.filter(s => s.status === 'paid').length,
      pendingInvoices: stats.filter(s => s.status === 'pending').length,
      failedInvoices: stats.filter(s => s.status === 'failed').length
    };
  }
}

// Export singleton instance
export const perDiemBillingService = new PerDiemBillingService();