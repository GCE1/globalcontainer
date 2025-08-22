import { eq, and, or, gte, lte, inArray, ilike, asc, desc, sql, count } from "drizzle-orm";
import { containers, type Container } from "../EcommSearchKit/shared/schema";
import { 
  contactMessages, 
  type ContactMessage, 
  type InsertContactMessage,
  users,
  type User,
  type UpsertUser,
  cartItems,
  type CartItem,
  type InsertCartItem,
  leasingOrders,
  type LeasingOrder,
  type InsertLeasingOrder,
  leasingOrderItems,
  type LeasingOrderItem,
  type InsertLeasingOrderItem,
  leasingContracts,
  type LeasingContract,
  type InsertLeasingContract,
  contractContainers,
  type ContractContainer,
  type InsertContractContainer,
  paymentMethods,
  type PaymentMethod,
  type InsertPaymentMethod,
  perDiemInvoices,
  type PerDiemInvoice,
  type InsertPerDiemInvoice,
  perDiemInvoiceItems,
  type PerDiemInvoiceItem,
  type InsertPerDiemInvoiceItem,
  billingSchedule,
  type BillingSchedule,
  type InsertBillingSchedule,
  paymentAttempts,
  type PaymentAttempt,
  type InsertPaymentAttempt,
  dunningCampaigns,
  type DunningCampaign,
  type InsertDunningCampaign,
  userContainers,
  type UserContainer,
  type InsertUserContainer,
  wholesaleInvoices,
  type WholesaleInvoice,
  type InsertWholesaleInvoice,
  wholesaleInvoiceItems,
  type WholesaleInvoiceItem,
  containerReleases,
  type ContainerRelease,
  type InsertContainerRelease,
  type InsertWholesaleInvoiceItem,
  newsletterSubscriptions,
  type NewsletterSubscription,
  type InsertNewsletterSubscription
} from "@shared/schema";
import { db } from "./db";
import { getCoordinatesFromAddress, calculateDistance } from "./googleGeocoding.js";

export interface SearchParams {
  page?: number;
  sortBy?: string;
  query?: string;
  types?: string;
  conditions?: string;
  city?: string;
  postalCode?: string;
  priceMin?: string;
  priceMax?: string;
  radius?: boolean;
  radiusMiles?: string;
  latitude?: number;
  longitude?: number;
}

export interface SearchResult {
  containers: Container[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
  nearestDepotSearch: boolean;
  depotInfo?: {
    name: string;
    distance: number;
    searchedZip: string;
    searchedLocation?: string;
  };
}

export interface IStorage {
  getContainers(params: SearchParams): Promise<SearchResult>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  // User operations for authentication and subscription management
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  // Cart operations for leasing
  addToCart(item: InsertCartItem): Promise<CartItem>;
  getCartItems(userId: string): Promise<CartItem[]>;
  removeFromCart(userId: string, itemId: number): Promise<void>;
  clearCart(userId: string): Promise<void>;
  // Leasing order operations
  createLeasingOrder(order: InsertLeasingOrder): Promise<LeasingOrder>;
  createLeasingOrderItems(items: InsertLeasingOrderItem[]): Promise<LeasingOrderItem[]>;
  getLeasingOrder(id: number): Promise<LeasingOrder | undefined>;
  updateLeasingOrderStatus(id: number, status: string): Promise<void>;
  updateUserSubscription(userId: string, subscriptionData: {
    subscriptionTier?: string;
    subscriptionStatus?: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStartDate?: Date;
    subscriptionEndDate?: Date;
  }): Promise<User>;
  // Container tracking operations
  createContractContainer(container: InsertContractContainer): Promise<ContractContainer>;
  getContractContainers(contractId: number): Promise<ContractContainer[]>;
  updateContractContainer(id: number, updates: Partial<ContractContainer>): Promise<ContractContainer>;
  
  // Payment methods and billing operations
  createPaymentMethod(paymentMethod: InsertPaymentMethod): Promise<PaymentMethod>;
  getPaymentMethods(userId: string): Promise<PaymentMethod[]>;
  updatePaymentMethod(id: number, updates: Partial<PaymentMethod>): Promise<PaymentMethod>;
  deletePaymentMethod(id: number): Promise<void>;
  
  // Per diem invoicing operations
  createPerDiemInvoice(invoice: InsertPerDiemInvoice): Promise<PerDiemInvoice>;
  getPerDiemInvoices(userId: string): Promise<PerDiemInvoice[]>;
  getPerDiemInvoice(id: number): Promise<PerDiemInvoice | undefined>;
  updatePerDiemInvoice(id: number, updates: Partial<PerDiemInvoice>): Promise<PerDiemInvoice>;
  
  // Billing schedule operations
  createBillingSchedule(schedule: InsertBillingSchedule): Promise<BillingSchedule>;
  getBillingSchedules(userId: string): Promise<BillingSchedule[]>;
  updateBillingSchedule(id: number, updates: Partial<BillingSchedule>): Promise<BillingSchedule>;
  
  // Payment attempts and dunning
  createPaymentAttempt(attempt: InsertPaymentAttempt): Promise<PaymentAttempt>;
  getPaymentAttempts(invoiceId: number): Promise<PaymentAttempt[]>;
  createDunningCampaign(campaign: InsertDunningCampaign): Promise<DunningCampaign>;
  getDunningCampaigns(userId: string): Promise<DunningCampaign[]>;
  
  // User container operations
  createUserContainer(container: InsertUserContainer): Promise<UserContainer>;
  getUserContainers(userId: string): Promise<UserContainer[]>;
  getUserContainer(id: number): Promise<UserContainer | undefined>;
  updateUserContainer(id: number, updates: Partial<UserContainer>): Promise<UserContainer>;
  deleteUserContainer(id: number): Promise<void>;
  
  // Wholesale invoice operations
  createWholesaleInvoice(invoice: InsertWholesaleInvoice): Promise<WholesaleInvoice>;
  getWholesaleInvoices(userId: string): Promise<WholesaleInvoice[]>;
  getWholesaleInvoice(id: number): Promise<WholesaleInvoice | undefined>;
  updateWholesaleInvoice(id: number, updates: Partial<WholesaleInvoice>): Promise<WholesaleInvoice>;
  deleteWholesaleInvoice(id: number): Promise<void>;
  
  // Wholesale invoice item operations
  createWholesaleInvoiceItems(items: InsertWholesaleInvoiceItem[]): Promise<WholesaleInvoiceItem[]>;
  getWholesaleInvoiceItems(invoiceId: number): Promise<WholesaleInvoiceItem[]>;
  updateWholesaleInvoiceItem(id: number, updates: Partial<WholesaleInvoiceItem>): Promise<WholesaleInvoiceItem>;
  deleteWholesaleInvoiceItem(id: number): Promise<void>;
  
  // Container release operations for GCE members and staff
  createContainerRelease(release: InsertContainerRelease): Promise<ContainerRelease>;
  getContainerReleases(userId: string): Promise<ContainerRelease[]>;
  getContainerRelease(id: number): Promise<ContainerRelease | undefined>;
  getContainerReleaseByNumber(releaseNumber: string): Promise<ContainerRelease | undefined>;
  updateContainerRelease(id: number, updates: Partial<ContainerRelease>): Promise<ContainerRelease>;
  deleteContainerRelease(id: number): Promise<void>;

  // Employee management operations
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, updates: Partial<Employee>): Promise<Employee>;
  deleteEmployee(id: number): Promise<void>;
  
  // Employee permissions operations
  getEmployeePermissions(employeeId: number): Promise<EmployeePermissions | undefined>;
  createEmployeePermissions(permissions: InsertEmployeePermissions): Promise<EmployeePermissions>;
  updateEmployeePermissions(employeeId: number, updates: Partial<EmployeePermissions>): Promise<EmployeePermissions>;

  // Admin dashboard operations
  getTotalUsers(): Promise<number>;
  getTotalOrders(): Promise<number>;
  getTotalContainers(): Promise<number>;
  getAllOrders(): Promise<any[]>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: number, role: string): Promise<void>;
}

export class MemStorage implements IStorage {
  constructor(private database: typeof db) {}

  async getContainers(params: SearchParams = {}): Promise<SearchResult> {
    try {
      console.log('Container search parameters:', params);

      const page = params.page || 1;
      const limit = 2500; // Show all containers to display full inventory (2000+ expected)
      const offset = (page - 1) * limit;

      const whereConditions = [];
      let proximityInfo: { name: string; distance: number; searchedZip: string } | undefined;
      
      if (params.query) {
        whereConditions.push(
          or(
            ilike(containers.type, `%${params.query}%`),
            ilike(containers.condition, `%${params.query}%`),
            ilike(containers.depot_name, `%${params.query}%`)
          )
        );
      }
      
      if (params.types) {
        const typeArray = params.types.split(',');
        whereConditions.push(inArray(containers.type, typeArray));
      }
      
      if (params.conditions) {
        const conditionArray = params.conditions.split(',');
        whereConditions.push(inArray(containers.condition, conditionArray));
      }
      
      if (params.city) {
        whereConditions.push(ilike(containers.city, `%${params.city}%`));
      }
      
      // Handle postal code search with proximity fallback
      if (params.postalCode) {
        // First try exact postal code match
        const exactMatch = await this.database
          .select({ count: count() })
          .from(containers)
          .where(eq(containers.postal_code, params.postalCode));
        
        if (exactMatch[0]?.count === 0) {
          // No exact match, search by actual distance to all containers using Google Geocoding
          console.log(`No containers found for postal code ${params.postalCode}, searching by distance using Google Geocoding`);
          
          const coords = await getCoordinatesFromAddress(params.postalCode);
          if (coords) {
            console.log(`Google Geocoding resolved ${params.postalCode} to ${coords.location} (${coords.lat}, ${coords.lng})`);
            
            // Don't filter by postal code, let all containers be returned
            // Distance calculation will be added to the query
            proximityInfo = {
              name: 'Nearest Available Containers',
              distance: 0, // Will be calculated per container
              searchedZip: params.postalCode,
              searchedLocation: coords.location
            };
            
            // Set search coordinates for distance calculation
            params.latitude = coords.lat;
            params.longitude = coords.lng;
          } else {
            console.log(`Google Geocoding failed for ${params.postalCode}`);
          }
        } else {
          // Exact postal code match found
          whereConditions.push(eq(containers.postal_code, params.postalCode));
        }
      }
      
      if (params.priceMin) {
        whereConditions.push(gte(containers.price, params.priceMin));
      }
      
      if (params.priceMax) {
        whereConditions.push(lte(containers.price, params.priceMax));
      }

      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Count total results
      const totalCountResult = await this.database
        .select({ count: count() })
        .from(containers)
        .where(whereClause);
      
      const totalCount = totalCountResult[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      // Build the main query with distance calculation when coordinates are provided
      let baseQuery;
      if (params.latitude !== undefined && params.longitude !== undefined) {
        baseQuery = this.database
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
            distance: sql<number>`3959 * acos(cos(radians(${params.latitude})) * cos(radians(${containers.latitude})) * cos(radians(${containers.longitude}) - radians(${params.longitude})) + sin(radians(${params.latitude})) * sin(radians(${containers.latitude})))`
          })
          .from(containers);
      } else {
        baseQuery = this.database
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
          })
          .from(containers);
      }

      let queryBuilder = baseQuery.where(whereClause);

      // Determine sorting
      let orderBy;
      if (params.latitude !== undefined && params.longitude !== undefined) {
        orderBy = asc(sql`distance`);
      } else if (params.sortBy) {
        switch (params.sortBy) {
          case 'price_asc':
            orderBy = asc(containers.price);
            break;
          case 'price_desc':
            orderBy = desc(containers.price);
            break;
          case 'newest':
            orderBy = desc(containers.createdAt);
            break;
          default:
            orderBy = asc(containers.type);
        }
      } else {
        orderBy = asc(containers.type);
      }
      
      const containerResults = await queryBuilder
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);
      
      console.log('Proximity Info:', proximityInfo);
      console.log('Nearest Depot Search Flag:', !!proximityInfo);
      
      return {
        containers: containerResults as Container[],
        totalResults: totalCount,
        totalPages: totalPages,
        currentPage: page,
        nearestDepotSearch: !!proximityInfo,
        ...(proximityInfo && { depotInfo: proximityInfo })
      };
      
    } catch (error) {
      console.error('Database error in container search:', error);
      return {
        containers: [],
        totalResults: 0,
        totalPages: 0,
        currentPage: 1,
        nearestDepotSearch: false
      };
    }
  }

  async createContactMessage(contactData: InsertContactMessage): Promise<ContactMessage> {
    try {
      const [message] = await this.database
        .insert(contactMessages)
        .values(contactData)
        .returning();
      return message;
    } catch (error) {
      console.error('Error creating contact message:', error);
      throw new Error('Failed to create contact message');
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await this.database.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      const [user] = await this.database
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();
      return user;
    } catch (error) {
      console.error('Error upserting user:', error);
      throw new Error('Failed to upsert user');
    }
  }

  async updateUserSubscription(userId: string, subscriptionData: {
    subscriptionTier?: string;
    subscriptionStatus?: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStartDate?: Date;
    subscriptionEndDate?: Date;
  }): Promise<User> {
    try {
      const [user] = await this.database
        .update(users)
        .set({
          ...subscriptionData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();
      return user;
    } catch (error) {
      console.error('Error updating user subscription:', error);
      throw new Error('Failed to update user subscription');
    }
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      return await this.database.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      throw new Error('Failed to fetch contact messages');
    }
  }

  // Cart operations for leasing
  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const [cartItem] = await this.database
      .insert(cartItems)
      .values(item)
      .returning();
    return cartItem;
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    return await this.database
      .select()
      .from(cartItems)
      .where(eq(cartItems.userId, userId));
  }

  async removeFromCart(userId: string, itemId: number): Promise<void> {
    await this.database
      .delete(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.id, itemId)));
  }

  async clearCart(userId: string): Promise<void> {
    await this.database
      .delete(cartItems)
      .where(eq(cartItems.userId, userId));
  }

  // Leasing order operations
  async createLeasingOrder(order: InsertLeasingOrder): Promise<LeasingOrder> {
    const [leasingOrder] = await this.database
      .insert(leasingOrders)
      .values(order)
      .returning();
    return leasingOrder;
  }

  async createLeasingOrderItems(items: InsertLeasingOrderItem[]): Promise<LeasingOrderItem[]> {
    return await this.database
      .insert(leasingOrderItems)
      .values(items)
      .returning();
  }

  async getLeasingOrder(id: number): Promise<LeasingOrder | undefined> {
    const [order] = await this.database
      .select()
      .from(leasingOrders)
      .where(eq(leasingOrders.id, id));
    return order;
  }

  async updateLeasingOrderPayment(id: number, paymentId: string): Promise<void> {
    await this.database
      .update(leasingOrders)
      .set({ 
        paymentId,
        updatedAt: new Date()
      })
      .where(eq(leasingOrders.id, id));
  }

  async updateLeasingOrderStatus(id: number, status: string): Promise<void> {
    await this.database
      .update(leasingOrders)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(leasingOrders.id, id));
  }

  async getLeasingOrderItems(orderId: number): Promise<LeasingOrderItem[]> {
    return await this.database
      .select()
      .from(leasingOrderItems)
      .where(eq(leasingOrderItems.orderId, orderId));
  }

  // Contract Management System Methods

  async createLeasingContract(contract: InsertLeasingContract): Promise<LeasingContract> {
    const [created] = await this.database
      .insert(leasingContracts)
      .values(contract)
      .returning();
    return created;
  }

  async getLeasingContract(id: number): Promise<LeasingContract | undefined> {
    const [contract] = await this.database
      .select()
      .from(leasingContracts)
      .where(eq(leasingContracts.id, id));
    return contract;
  }

  async getUserContracts(userId: string): Promise<LeasingContract[]> {
    return await this.database
      .select()
      .from(leasingContracts)
      .where(eq(leasingContracts.userId, userId))
      .orderBy(desc(leasingContracts.createdAt));
  }

  async updateLeasingContract(id: number, updates: Partial<InsertLeasingContract>): Promise<void> {
    await this.database
      .update(leasingContracts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leasingContracts.id, id));
  }

  // Container tracking operations
  async createContractContainer(container: InsertContractContainer): Promise<ContractContainer> {
    const [created] = await this.database
      .insert(contractContainers)
      .values(container)
      .returning();
    return created;
  }

  async getContractContainers(contractId: number): Promise<ContractContainer[]> {
    return await this.database
      .select()
      .from(contractContainers)
      .where(eq(contractContainers.contractId, contractId))
      .orderBy(desc(contractContainers.createdAt));
  }

  async updateContractContainer(id: number, updates: Partial<ContractContainer>): Promise<ContractContainer> {
    const [updated] = await this.database
      .update(contractContainers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(contractContainers.id, id))
      .returning();
    return updated;
  }

  // Payment methods operations
  async createPaymentMethod(paymentMethod: InsertPaymentMethod): Promise<PaymentMethod> {
    const [created] = await this.database
      .insert(paymentMethods)
      .values(paymentMethod)
      .returning();
    return created;
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return await this.database
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.userId, userId))
      .orderBy(desc(paymentMethods.createdAt));
  }

  async updatePaymentMethod(id: number, updates: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const [updated] = await this.database
      .update(paymentMethods)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(paymentMethods.id, id))
      .returning();
    return updated;
  }

  async deletePaymentMethod(id: number): Promise<void> {
    await this.database
      .delete(paymentMethods)
      .where(eq(paymentMethods.id, id));
  }

  // Per diem invoicing operations
  async createPerDiemInvoice(invoice: InsertPerDiemInvoice): Promise<PerDiemInvoice> {
    const [created] = await this.database
      .insert(perDiemInvoices)
      .values(invoice)
      .returning();
    return created;
  }

  async getPerDiemInvoices(userId: string): Promise<PerDiemInvoice[]> {
    return await this.database
      .select()
      .from(perDiemInvoices)
      .where(eq(perDiemInvoices.userId, userId))
      .orderBy(desc(perDiemInvoices.createdAt));
  }

  async getPerDiemInvoice(id: number): Promise<PerDiemInvoice | undefined> {
    const [invoice] = await this.database
      .select()
      .from(perDiemInvoices)
      .where(eq(perDiemInvoices.id, id))
      .limit(1);
    return invoice;
  }

  async updatePerDiemInvoice(id: number, updates: Partial<PerDiemInvoice>): Promise<PerDiemInvoice> {
    const [updated] = await this.database
      .update(perDiemInvoices)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(perDiemInvoices.id, id))
      .returning();
    return updated;
  }

  // Billing schedule operations
  async createBillingSchedule(schedule: InsertBillingSchedule): Promise<BillingSchedule> {
    const [created] = await this.database
      .insert(billingSchedule)
      .values(schedule)
      .returning();
    return created;
  }

  async getBillingSchedules(userId: string): Promise<BillingSchedule[]> {
    return await this.database
      .select()
      .from(billingSchedule)
      .where(eq(billingSchedule.userId, userId))
      .orderBy(desc(billingSchedule.createdAt));
  }

  async updateBillingSchedule(id: number, updates: Partial<BillingSchedule>): Promise<BillingSchedule> {
    const [updated] = await this.database
      .update(billingSchedule)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(billingSchedule.id, id))
      .returning();
    return updated;
  }

  // Payment attempts and dunning operations
  async createPaymentAttempt(attempt: InsertPaymentAttempt): Promise<PaymentAttempt> {
    const [created] = await this.database
      .insert(paymentAttempts)
      .values(attempt)
      .returning();
    return created;
  }

  async getPaymentAttempts(invoiceId: number): Promise<PaymentAttempt[]> {
    return await this.database
      .select()
      .from(paymentAttempts)
      .where(eq(paymentAttempts.invoiceId, invoiceId))
      .orderBy(desc(paymentAttempts.createdAt));
  }

  async createDunningCampaign(campaign: InsertDunningCampaign): Promise<DunningCampaign> {
    const [created] = await this.database
      .insert(dunningCampaigns)
      .values(campaign)
      .returning();
    return created;
  }

  async getDunningCampaigns(userId: string): Promise<DunningCampaign[]> {
    return await this.database
      .select()
      .from(dunningCampaigns)
      .where(eq(dunningCampaigns.userId, userId))
      .orderBy(desc(dunningCampaigns.createdAt));
  }

  // User container operations
  async createUserContainer(container: InsertUserContainer): Promise<UserContainer> {
    const [created] = await this.database
      .insert(userContainers)
      .values(container)
      .returning();
    return created;
  }

  async getUserContainers(userId: string): Promise<UserContainer[]> {
    return await this.database
      .select()
      .from(userContainers)
      .where(eq(userContainers.userId, userId))
      .orderBy(desc(userContainers.createdAt));
  }

  async getUserContainer(id: number): Promise<UserContainer | undefined> {
    const [container] = await this.database
      .select()
      .from(userContainers)
      .where(eq(userContainers.id, id));
    return container;
  }

  async updateUserContainer(id: number, updates: Partial<UserContainer>): Promise<UserContainer> {
    const [updated] = await this.database
      .update(userContainers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userContainers.id, id))
      .returning();
    return updated;
  }

  async deleteUserContainer(id: number): Promise<void> {
    await this.database
      .delete(userContainers)
      .where(eq(userContainers.id, id));
  }

  // Wholesale invoice operations
  async createWholesaleInvoice(invoice: InsertWholesaleInvoice): Promise<WholesaleInvoice> {
    const [created] = await this.database
      .insert(wholesaleInvoices)
      .values(invoice)
      .returning();
    return created;
  }

  async getWholesaleInvoices(userId: string): Promise<WholesaleInvoice[]> {
    return await this.database
      .select()
      .from(wholesaleInvoices)
      .where(eq(wholesaleInvoices.userId, userId))
      .orderBy(desc(wholesaleInvoices.createdAt));
  }

  async getWholesaleInvoice(id: number): Promise<WholesaleInvoice | undefined> {
    const [invoice] = await this.database
      .select()
      .from(wholesaleInvoices)
      .where(eq(wholesaleInvoices.id, id));
    return invoice;
  }

  async updateWholesaleInvoice(id: number, updates: Partial<WholesaleInvoice>): Promise<WholesaleInvoice> {
    const [updated] = await this.database
      .update(wholesaleInvoices)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(wholesaleInvoices.id, id))
      .returning();
    return updated;
  }

  async deleteWholesaleInvoice(id: number): Promise<void> {
    await this.database
      .delete(wholesaleInvoices)
      .where(eq(wholesaleInvoices.id, id));
  }

  // Wholesale invoice item operations
  async createWholesaleInvoiceItems(items: InsertWholesaleInvoiceItem[]): Promise<WholesaleInvoiceItem[]> {
    return await this.database
      .insert(wholesaleInvoiceItems)
      .values(items)
      .returning();
  }

  async getWholesaleInvoiceItems(invoiceId: number): Promise<WholesaleInvoiceItem[]> {
    return await this.database
      .select()
      .from(wholesaleInvoiceItems)
      .where(eq(wholesaleInvoiceItems.invoiceId, invoiceId))
      .orderBy(asc(wholesaleInvoiceItems.id));
  }

  async updateWholesaleInvoiceItem(id: number, updates: Partial<WholesaleInvoiceItem>): Promise<WholesaleInvoiceItem> {
    const [updated] = await this.database
      .update(wholesaleInvoiceItems)
      .set(updates)
      .where(eq(wholesaleInvoiceItems.id, id))
      .returning();
    return updated;
  }

  async deleteWholesaleInvoiceItem(id: number): Promise<void> {
    await this.database
      .delete(wholesaleInvoiceItems)
      .where(eq(wholesaleInvoiceItems.id, id));
  }

  // Optimized batch fetch for all invoice items for a user
  async getAllWholesaleInvoiceItems(userId: string): Promise<WholesaleInvoiceItem[]> {
    const userInvoices = await this.database
      .select({ id: wholesaleInvoices.id })
      .from(wholesaleInvoices)
      .where(eq(wholesaleInvoices.userId, userId));
    
    const invoiceIds = userInvoices.map(inv => inv.id);
    
    if (invoiceIds.length === 0) return [];
    
    return await this.database
      .select()
      .from(wholesaleInvoiceItems)
      .where(inArray(wholesaleInvoiceItems.invoiceId, invoiceIds))
      .orderBy(asc(wholesaleInvoiceItems.invoiceId));
  }

  // Container release operations for GCE members and staff
  async createContainerRelease(release: InsertContainerRelease): Promise<ContainerRelease> {
    const [created] = await this.database
      .insert(containerReleases)
      .values(release)
      .returning();
    return created;
  }

  async getContainerReleases(userId: string): Promise<ContainerRelease[]> {
    return await this.database
      .select()
      .from(containerReleases)
      .where(eq(containerReleases.userId, userId))
      .orderBy(desc(containerReleases.createdAt));
  }

  async getContainerRelease(id: number): Promise<ContainerRelease | undefined> {
    const [release] = await this.database
      .select()
      .from(containerReleases)
      .where(eq(containerReleases.id, id));
    return release;
  }

  async getContainerReleaseByNumber(releaseNumber: string): Promise<ContainerRelease | undefined> {
    const [release] = await this.database
      .select()
      .from(containerReleases)
      .where(eq(containerReleases.releaseNumber, releaseNumber));
    return release;
  }

  async updateContainerRelease(id: number, updates: Partial<ContainerRelease>): Promise<ContainerRelease> {
    const [updated] = await this.database
      .update(containerReleases)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(containerReleases.id, id))
      .returning();
    return updated;
  }

  async deleteContainerRelease(id: number): Promise<void> {
    await this.database
      .delete(containerReleases)
      .where(eq(containerReleases.id, id));
  }

  // Employee management operations
  async getEmployees(): Promise<Employee[]> {
    return await this.database
      .select()
      .from(employees)
      .orderBy(desc(employees.createdAt));
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await this.database
      .select()
      .from(employees)
      .where(eq(employees.id, id));
    return employee;
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const [created] = await this.database
      .insert(employees)
      .values(employee)
      .returning();
    return created;
  }

  async updateEmployee(id: number, updates: Partial<Employee>): Promise<Employee> {
    const [updated] = await this.database
      .update(employees)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();
    return updated;
  }

  async deleteEmployee(id: number): Promise<void> {
    await this.database
      .delete(employees)
      .where(eq(employees.id, id));
  }

  // Employee permissions operations
  async getEmployeePermissions(employeeId: number): Promise<EmployeePermissions | undefined> {
    const [permissions] = await this.database
      .select()
      .from(employeePermissions)
      .where(eq(employeePermissions.employeeId, employeeId));
    return permissions;
  }

  async createEmployeePermissions(permissions: InsertEmployeePermissions): Promise<EmployeePermissions> {
    const [created] = await this.database
      .insert(employeePermissions)
      .values(permissions)
      .returning();
    return created;
  }

  async updateEmployeePermissions(employeeId: number, updates: Partial<EmployeePermissions>): Promise<EmployeePermissions> {
    const [updated] = await this.database
      .update(employeePermissions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(employeePermissions.employeeId, employeeId))
      .returning();
    return updated;
  }

  // Admin dashboard operations
  async getTotalUsers(): Promise<number> {
    const [result] = await this.database
      .select({ count: count() })
      .from(users);
    return result.count;
  }

  async getTotalOrders(): Promise<number> {
    const [result] = await this.database
      .select({ count: count() })
      .from(leasingOrders);
    return result.count;
  }

  async getTotalContainers(): Promise<number> {
    const [result] = await this.database
      .select({ count: count() })
      .from(containers);
    return result.count;
  }

  async getAllOrders(): Promise<any[]> {
    return await this.database
      .select()
      .from(leasingOrders)
      .orderBy(desc(leasingOrders.createdAt));
  }

  async getAllUsers(): Promise<User[]> {
    return await this.database
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  async updateUserRole(userId: number, role: string): Promise<void> {
    await this.database
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId.toString()));
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.database
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async updateUserLastLogin(userId: string): Promise<void> {
    await this.database
      .update(users)
      .set({ lastLogin: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  // Newsletter subscription methods
  async createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const [newSubscription] = await this.database
      .insert(newsletterSubscriptions)
      .values(subscription)
      .returning();
    return newSubscription;
  }

  async getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined> {
    const [subscription] = await this.database
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, email));
    return subscription;
  }

  async getAllActiveNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return await this.database
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.status, "active"))
      .orderBy(desc(newsletterSubscriptions.subscribedAt));
  }

  async unsubscribeNewsletter(email: string): Promise<void> {
    await this.database
      .update(newsletterSubscriptions)
      .set({ 
        status: "unsubscribed", 
        unsubscribedAt: new Date() 
      })
      .where(eq(newsletterSubscriptions.email, email));
  }

  async getTotalNewsletterSubscriptions(): Promise<number> {
    const [result] = await this.database
      .select({ count: count() })
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.status, "active"));
    return result.count;
  }
}

export const storage = new MemStorage(db);