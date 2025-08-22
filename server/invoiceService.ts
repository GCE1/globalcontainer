import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  customerProfiles, 
  orders, 
  orderItems, 
  invoices,
  containers,
  type InsertCustomerProfile,
  type InsertOrder,
  type InsertOrderItem,
  type InsertInvoice 
} from "@shared/schema";

export interface CheckoutData {
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    company?: string;
    phone?: string;
    billingAddress: string;
    billingCity: string;
    billingState: string;
    billingZip: string;
    shippingAddress?: string;
    shippingCity?: string;
    shippingState?: string;
    shippingZip?: string;
  };
  cartItems: Array<{
    id: string;
    sku: string;
    type: string;
    condition: string;
    price: number;
    quantity: number;
    depot_name: string;
    location: string;
  }>;
  shippingOptions: {
    shippingMethod: string;
    doorDirection: string;
    expeditedDelivery: boolean;
    payOnDelivery: boolean;
    distanceMiles?: number;
  };
  paymentInfo: {
    paymentMethod: string;
    paymentId: string;
  };
  totals: {
    subtotal: number;
    shippingCost: number;
    expeditedFee: number;
    totalAmount: number;
  };
  referralCode?: string;
  orderNote?: string;
}

export class InvoiceService {
  // Generate unique order number
  private generateOrderNumber(): string {
    const prefix = 'GCE';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

  // Generate unique invoice number
  private generateInvoiceNumber(): string {
    const prefix = 'INV';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

  // Create or get existing customer profile
  async createOrGetCustomer(customerInfo: CheckoutData['customerInfo']): Promise<number> {
    try {
      // Check if customer already exists by email
      const [existingCustomer] = await db
        .select()
        .from(customerProfiles)
        .where(eq(customerProfiles.email, customerInfo.email));

      if (existingCustomer) {
        // Update existing customer profile
        const [updatedCustomer] = await db
          .update(customerProfiles)
          .set({
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            company: customerInfo.company,
            phone: customerInfo.phone,
            billingAddress: customerInfo.billingAddress,
            billingCity: customerInfo.billingCity,
            billingState: customerInfo.billingState,
            billingZip: customerInfo.billingZip,
            shippingAddress: customerInfo.shippingAddress,
            shippingCity: customerInfo.shippingCity,
            shippingState: customerInfo.shippingState,
            shippingZip: customerInfo.shippingZip,
            updatedAt: new Date(),
          })
          .where(eq(customerProfiles.id, existingCustomer.id))
          .returning();
        
        return updatedCustomer.id;
      } else {
        // Create new customer profile
        const newCustomerData: InsertCustomerProfile = {
          email: customerInfo.email,
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          company: customerInfo.company,
          phone: customerInfo.phone,
          billingAddress: customerInfo.billingAddress,
          billingCity: customerInfo.billingCity,
          billingState: customerInfo.billingState,
          billingZip: customerInfo.billingZip,
          shippingAddress: customerInfo.shippingAddress,
          shippingCity: customerInfo.shippingCity,
          shippingState: customerInfo.shippingState,
          shippingZip: customerInfo.shippingZip,
        };

        const [newCustomer] = await db
          .insert(customerProfiles)
          .values(newCustomerData)
          .returning();

        return newCustomer.id;
      }
    } catch (error) {
      console.error('Error creating/getting customer:', error);
      throw new Error('Failed to process customer information');
    }
  }

  // Create order and order items
  async createOrder(checkoutData: CheckoutData): Promise<number> {
    try {
      const customerId = await this.createOrGetCustomer(checkoutData.customerInfo);
      const orderNumber = this.generateOrderNumber();

      // Create order
      const orderData: InsertOrder = {
        customerId,
        orderNumber,
        status: 'processing',
        subtotal: checkoutData.totals.subtotal.toString(),
        shippingCost: checkoutData.totals.shippingCost.toString(),
        expeditedFee: checkoutData.totals.expeditedFee.toString(),
        totalAmount: checkoutData.totals.totalAmount.toString(),
        paymentStatus: 'paid',
        paymentMethod: checkoutData.paymentInfo.paymentMethod,
        paymentId: checkoutData.paymentInfo.paymentId,
        shippingMethod: checkoutData.shippingOptions.shippingMethod,
        doorDirection: checkoutData.shippingOptions.doorDirection,
        expeditedDelivery: checkoutData.shippingOptions.expeditedDelivery,
        payOnDelivery: checkoutData.shippingOptions.payOnDelivery,
        distanceMiles: checkoutData.shippingOptions.distanceMiles?.toString(),
        referralCode: checkoutData.referralCode,
        orderNote: checkoutData.orderNote,
      };

      const [newOrder] = await db
        .insert(orders)
        .values(orderData)
        .returning();

      // Create order items
      for (const item of checkoutData.cartItems) {
        // Get container details from database
        const [container] = await db
          .select()
          .from(containers)
          .where(eq(containers.id, parseInt(item.id)));

        if (!container) {
          throw new Error(`Container with ID ${item.id} not found`);
        }

        const orderItemData: InsertOrderItem = {
          orderId: newOrder.id,
          containerId: container.id,
          sku: item.sku,
          containerType: item.type,
          containerCondition: item.condition,
          unitPrice: item.price.toString(),
          quantity: item.quantity,
          totalPrice: (item.price * item.quantity).toString(),
          depotName: item.depot_name,
          depotLocation: item.location,
        };

        await db.insert(orderItems).values(orderItemData);
      }

      return newOrder.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  // Create invoice
  async createInvoice(orderId: number): Promise<string> {
    try {
      // Get order details
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId));

      if (!order) {
        throw new Error('Order not found');
      }

      const invoiceNumber = this.generateInvoiceNumber();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // 30 days from now

      const invoiceData: InsertInvoice = {
        orderId: order.id,
        customerId: order.customerId,
        invoiceNumber,
        dueDate,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        expeditedFee: order.expeditedFee,
        totalAmount: order.totalAmount,
        status: order.paymentStatus === 'paid' ? 'paid' : 'pending',
        paidAt: order.paymentStatus === 'paid' ? new Date() : undefined,
      };

      const [newInvoice] = await db
        .insert(invoices)
        .values(invoiceData)
        .returning();

      return newInvoice.invoiceNumber;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw new Error('Failed to create invoice');
    }
  }

  // Get invoice details for PDF generation
  async getInvoiceDetails(invoiceNumber: string) {
    try {
      const [invoice] = await db
        .select({
          invoice: invoices,
          order: orders,
          customer: customerProfiles,
        })
        .from(invoices)
        .innerJoin(orders, eq(invoices.orderId, orders.id))
        .innerJoin(customerProfiles, eq(invoices.customerId, customerProfiles.id))
        .where(eq(invoices.invoiceNumber, invoiceNumber));

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // Get order items
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, invoice.order.id));

      return {
        invoice: invoice.invoice,
        order: invoice.order,
        customer: invoice.customer,
        items,
      };
    } catch (error) {
      console.error('Error getting invoice details:', error);
      throw new Error('Failed to get invoice details');
    }
  }

  // Process complete checkout and generate invoice
  async processCheckout(checkoutData: CheckoutData): Promise<{ orderId: number; invoiceNumber: string }> {
    try {
      const orderId = await this.createOrder(checkoutData);
      const invoiceNumber = await this.createInvoice(orderId);

      return { orderId, invoiceNumber };
    } catch (error) {
      console.error('Error processing checkout:', error);
      throw new Error('Failed to process checkout');
    }
  }
}

export const invoiceService = new InvoiceService();