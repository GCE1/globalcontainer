import { db } from "./db";
import { 
  containers, 
  leasingContracts, 
  contractContainers, 
  perDiemInvoices,
  type LeasingContract,
  type ContractContainer,
  type Container 
} from "@shared/schema";
import { and, eq, gte, lte, desc, asc, count, sql } from "drizzle-orm";

// Scalability service for handling large datasets efficiently
export class ScalabilityService {
  
  // Batch processing for container operations
  async batchProcessContainers(containerIds: number[], operation: 'update' | 'delete', updates?: Partial<Container>) {
    const batchSize = 100;
    const results = [];
    
    for (let i = 0; i < containerIds.length; i += batchSize) {
      const batch = containerIds.slice(i, i + batchSize);
      
      if (operation === 'update' && updates) {
        const result = await db
          .update(containers)
          .set(updates)
          .where(sql`id = ANY(${batch})`)
          .returning();
        results.push(...result);
      } else if (operation === 'delete') {
        const result = await db
          .delete(containers)
          .where(sql`id = ANY(${batch})`)
          .returning();
        results.push(...result);
      }
    }
    
    return results;
  }

  // Optimized contract retrieval with pagination and filtering
  async getContractsPaginated(params: {
    userId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    page: number;
    limit: number;
    sortBy?: 'start_date' | 'end_date' | 'total_value' | 'created_at';
    sortOrder?: 'asc' | 'desc';
  }) {
    const { page, limit, sortBy = 'created_at', sortOrder = 'desc' } = params;
    const offset = (page - 1) * limit;
    
    const whereConditions = [];
    
    if (params.userId) {
      whereConditions.push(eq(leasingContracts.userId, params.userId));
    }
    
    if (params.status) {
      whereConditions.push(eq(leasingContracts.status, params.status));
    }
    
    if (params.startDate) {
      whereConditions.push(gte(leasingContracts.startDate, params.startDate));
    }
    
    if (params.endDate) {
      whereConditions.push(lte(leasingContracts.endDate, params.endDate));
    }
    
    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;
    
    // Get total count for pagination
    const totalResult = await db
      .select({ count: count() })
      .from(leasingContracts)
      .where(whereClause);
    
    const total = totalResult[0]?.count || 0;
    
    // Build order by clause
    let orderByClause;
    const direction = sortOrder === 'asc' ? asc : desc;
    
    switch (sortBy) {
      case 'start_date':
        orderByClause = direction(leasingContracts.startDate);
        break;
      case 'end_date':
        orderByClause = direction(leasingContracts.endDate);
        break;
      case 'total_value':
        orderByClause = direction(leasingContracts.totalValue);
        break;
      default:
        orderByClause = direction(leasingContracts.createdAt);
    }
    
    const contracts = await db
      .select()
      .from(leasingContracts)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);
    
    return {
      contracts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }

  // Bulk invoice processing for per diem billing
  async processBulkInvoices(contractIds: number[], billingDate: Date) {
    const results = [];
    const batchSize = 50;
    
    for (let i = 0; i < contractIds.length; i += batchSize) {
      const batch = contractIds.slice(i, i + batchSize);
      
      // Get contract details for batch
      const contracts = await db
        .select()
        .from(leasingContracts)
        .where(sql`id = ANY(${batch})`);
      
      // Process each contract in the batch
      for (const contract of contracts) {
        const invoiceData = await this.calculatePerDiemInvoice(contract, billingDate);
        if (invoiceData) {
          const [invoice] = await db
            .insert(perDiemInvoices)
            .values(invoiceData)
            .returning();
          results.push(invoice);
        }
      }
    }
    
    return results;
  }

  // Calculate per diem invoice for a contract
  private async calculatePerDiemInvoice(contract: LeasingContract, billingDate: Date) {
    const daysDiff = Math.ceil((billingDate.getTime() - contract.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysOverdue = Math.max(0, daysDiff - contract.freeDays);
    
    if (daysOverdue <= 0) {
      return null; // No invoice needed yet
    }
    
    const totalAmount = Number(contract.perDiemRate) * daysOverdue * contract.quantity;
    
    return {
      userId: contract.userId,
      contractId: contract.id,
      invoiceNumber: `INV-${contract.contractNumber}-${billingDate.toISOString().split('T')[0]}`,
      billingDate,
      dueDate: new Date(billingDate.getTime() + (30 * 24 * 60 * 60 * 1000)), // 30 days from billing
      totalAmount: totalAmount.toString(),
      perDiemRate: contract.perDiemRate,
      daysOverdue,
      containerCount: contract.quantity,
      status: 'pending' as const
    };
  }

  // Optimized container search with geographic clustering
  async searchContainersOptimized(params: {
    type?: string;
    condition?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    priceMin?: number;
    priceMax?: number;
    page: number;
    limit: number;
  }) {
    const { page, limit } = params;
    const offset = (page - 1) * limit;
    
    const whereConditions = [];
    
    if (params.type) {
      whereConditions.push(eq(containers.type, params.type));
    }
    
    if (params.condition) {
      whereConditions.push(eq(containers.condition, params.condition));
    }
    
    if (params.priceMin) {
      whereConditions.push(gte(containers.price, params.priceMin));
    }
    
    if (params.priceMax) {
      whereConditions.push(lte(containers.price, params.priceMax));
    }
    
    // Geographic filtering with radius
    if (params.latitude && params.longitude && params.radius) {
      const radiusInMiles = params.radius;
      whereConditions.push(
        sql`3959 * acos(cos(radians(${params.latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${params.longitude})) + sin(radians(${params.latitude})) * sin(radians(latitude))) <= ${radiusInMiles}`
      );
    }
    
    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;
    
    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(containers)
      .where(whereClause);
    
    const total = totalResult[0]?.count || 0;
    
    // Build query with distance calculation if coordinates provided
    let query;
    if (params.latitude && params.longitude) {
      query = db
        .select({
          id: containers.id,
          sku: containers.sku,
          type: containers.type,
          condition: containers.condition,
          quantity: containers.quantity,
          price: containers.price,
          depot_name: containers.depot_name,
          latitude: containers.latitude,
          longitude: containers.longitude,
          address: containers.address,
          city: containers.city,
          state: containers.state,
          postal_code: containers.postal_code,
          country: containers.country,
          createdAt: containers.createdAt,
          updatedAt: containers.updatedAt,
          distance: sql<number>`3959 * acos(cos(radians(${params.latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${params.longitude})) + sin(radians(${params.latitude})) * sin(radians(latitude)))`
        })
        .from(containers)
        .where(whereClause)
        .orderBy(asc(sql`distance`));
    } else {
      query = db
        .select()
        .from(containers)
        .where(whereClause)
        .orderBy(asc(containers.type));
    }
    
    const results = await query
      .limit(limit)
      .offset(offset);
    
    return {
      containers: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }

  // Analytics for large datasets with aggregation
  async getContainerAnalytics(userId?: string) {
    const whereCondition = userId ? eq(leasingContracts.userId, userId) : undefined;
    
    // Use Promise.all for parallel execution
    const [
      totalContractsResult,
      activeContractsResult,
      totalValueResult,
      containersByTypeResult,
      revenueByMonthResult
    ] = await Promise.all([
      db.select({ count: count() }).from(leasingContracts).where(whereCondition),
      db.select({ count: count() }).from(leasingContracts).where(
        whereCondition ? and(whereCondition, eq(leasingContracts.status, 'active')) : eq(leasingContracts.status, 'active')
      ),
      db.select({ 
        totalValue: sql<number>`COALESCE(SUM(CAST(total_value AS DECIMAL)), 0)` 
      }).from(leasingContracts).where(whereCondition),
      db.select({
        containerSize: leasingContracts.containerSize,
        count: count()
      }).from(leasingContracts).where(whereCondition).groupBy(leasingContracts.containerSize),
      db.select({
        month: sql<string>`TO_CHAR(start_date, 'YYYY-MM')`,
        revenue: sql<number>`COALESCE(SUM(CAST(total_value AS DECIMAL)), 0)`
      }).from(leasingContracts).where(whereCondition).groupBy(sql`TO_CHAR(start_date, 'YYYY-MM')`).orderBy(sql`TO_CHAR(start_date, 'YYYY-MM')`)
    ]);
    
    return {
      totalContracts: totalContractsResult[0]?.count || 0,
      activeContracts: activeContractsResult[0]?.count || 0,
      totalValue: totalValueResult[0]?.totalValue || 0,
      containersByType: containersByTypeResult,
      revenueByMonth: revenueByMonthResult
    };
  }

  // Background job processing for large operations
  async scheduleBackgroundJob(jobType: 'invoice_generation' | 'contract_expiry_check' | 'container_maintenance', data: any) {
    // This would integrate with a job queue system like Bull, Agenda, or similar
    // For now, we'll implement basic background processing
    
    setTimeout(async () => {
      try {
        switch (jobType) {
          case 'invoice_generation':
            await this.processBulkInvoices(data.contractIds, data.billingDate);
            break;
          case 'contract_expiry_check':
            await this.checkExpiringContracts(data.daysAhead);
            break;
          case 'container_maintenance':
            await this.scheduleContainerMaintenance(data.containerIds);
            break;
        }
      } catch (error) {
        console.error(`Background job ${jobType} failed:`, error);
      }
    }, 0);
  }

  // Check for expiring contracts
  private async checkExpiringContracts(daysAhead: number) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysAhead);
    
    const expiringContracts = await db
      .select()
      .from(leasingContracts)
      .where(
        and(
          lte(leasingContracts.endDate, expiryDate),
          eq(leasingContracts.status, 'active')
        )
      );
    
    // Process expiring contracts (send notifications, update status, etc.)
    return expiringContracts;
  }

  // Schedule container maintenance
  private async scheduleContainerMaintenance(containerIds: number[]) {
    // Implementation for container maintenance scheduling
    // This would typically involve updating container status, creating maintenance records, etc.
    return this.batchProcessContainers(containerIds, 'update', { 
      // Add maintenance status or other updates as needed
    });
  }
}

export const scalabilityService = new ScalabilityService();