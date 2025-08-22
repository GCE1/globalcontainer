import { users, containers, contracts, invoices, emails } from '../shared/schema';
import { db } from './db';
import { eq, and } from 'drizzle-orm';
import type { 
  User, InsertUser, 
  Container, InsertContainer,
  Contract, InsertContract,
  Invoice, InsertInvoice,
  Email, InsertEmail
} from '../shared/schema';

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Container operations
  getContainer(id: number): Promise<Container | undefined>;
  getContainers(filters?: Partial<Container>): Promise<Container[]>;
  createContainer(container: InsertContainer): Promise<Container>;
  updateContainer(id: number, container: Partial<Container>): Promise<Container | undefined>;
  
  // Contract operations
  getContract(id: number): Promise<Contract | undefined>;
  getContractsByUser(userId: number): Promise<Contract[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: number, contract: Partial<Contract>): Promise<Contract | undefined>;
  
  // Invoice operations
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoicesByUser(userId: number): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<Invoice>): Promise<Invoice | undefined>;
  
  // Email operations
  getEmail(id: number): Promise<Email | undefined>;
  getEmailsByUser(userId: number, folder: string): Promise<Email[]>;
  createEmail(email: InsertEmail): Promise<Email>;
  updateEmail(id: number, email: Partial<Email>): Promise<Email | undefined>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Container methods
  async getContainer(id: number): Promise<Container | undefined> {
    const [container] = await db.select().from(containers).where(eq(containers.id, id));
    return container || undefined;
  }

  async getContainers(filters?: Partial<Container>): Promise<Container[]> {
    if (!filters) {
      return db.select().from(containers);
    }
    
    // Handle each filter case separately to avoid type issues
    if (filters.containerType && filters.containerSize && filters.containerStatus && filters.ownerId) {
      return db.select().from(containers).where(
        and(
          eq(containers.containerType, filters.containerType),
          eq(containers.containerSize, filters.containerSize),
          eq(containers.containerStatus, filters.containerStatus),
          eq(containers.ownerId, filters.ownerId)
        )
      );
    } else if (filters.containerType && filters.containerSize && filters.containerStatus) {
      return db.select().from(containers).where(
        and(
          eq(containers.containerType, filters.containerType),
          eq(containers.containerSize, filters.containerSize),
          eq(containers.containerStatus, filters.containerStatus)
        )
      );
    } else if (filters.containerType && filters.containerSize) {
      return db.select().from(containers).where(
        and(
          eq(containers.containerType, filters.containerType),
          eq(containers.containerSize, filters.containerSize)
        )
      );
    } else if (filters.containerType && filters.containerStatus) {
      return db.select().from(containers).where(
        and(
          eq(containers.containerType, filters.containerType),
          eq(containers.containerStatus, filters.containerStatus)
        )
      );
    } else if (filters.containerSize && filters.containerStatus) {
      return db.select().from(containers).where(
        and(
          eq(containers.containerSize, filters.containerSize),
          eq(containers.containerStatus, filters.containerStatus)
        )
      );
    } else if (filters.containerType) {
      return db.select().from(containers).where(eq(containers.containerType, filters.containerType));
    } else if (filters.containerSize) {
      return db.select().from(containers).where(eq(containers.containerSize, filters.containerSize));
    } else if (filters.containerStatus) {
      return db.select().from(containers).where(eq(containers.containerStatus, filters.containerStatus));
    } else if (filters.ownerId) {
      return db.select().from(containers).where(eq(containers.ownerId, filters.ownerId));
    }
    
    return db.select().from(containers);
  }

  async createContainer(insertContainer: InsertContainer): Promise<Container> {
    const [container] = await db.insert(containers).values(insertContainer).returning();
    return container;
  }

  async updateContainer(id: number, updateData: Partial<Container>): Promise<Container | undefined> {
    const [container] = await db
      .update(containers)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(containers.id, id))
      .returning();
    return container || undefined;
  }

  // Contract methods
  async getContract(id: number): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    return contract || undefined;
  }

  async getContractsByUser(userId: number): Promise<Contract[]> {
    return db.select().from(contracts).where(eq(contracts.userId, userId));
  }

  async createContract(insertContract: InsertContract): Promise<Contract> {
    const [contract] = await db.insert(contracts).values(insertContract).returning();
    return contract;
  }

  async updateContract(id: number, updateData: Partial<Contract>): Promise<Contract | undefined> {
    const [contract] = await db
      .update(contracts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(contracts.id, id))
      .returning();
    return contract || undefined;
  }

  // Invoice methods
  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice || undefined;
  }

  async getInvoicesByUser(userId: number): Promise<Invoice[]> {
    return db.select().from(invoices).where(eq(invoices.userId, userId));
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(insertInvoice).returning();
    return invoice;
  }

  async updateInvoice(id: number, updateData: Partial<Invoice>): Promise<Invoice | undefined> {
    const [invoice] = await db
      .update(invoices)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(invoices.id, id))
      .returning();
    return invoice || undefined;
  }

  // Email methods
  async getEmail(id: number): Promise<Email | undefined> {
    const [email] = await db.select().from(emails).where(eq(emails.id, id));
    return email || undefined;
  }

  async getEmailsByUser(userId: number, folder: string): Promise<Email[]> {
    // Cast folder to the proper enum type
    return db
      .select()
      .from(emails)
      .where(
        and(
          eq(emails.userId, userId),
          eq(emails.folder, folder as any) // Type cast to avoid TypeScript issues
        )
      );
  }

  async createEmail(insertEmail: InsertEmail): Promise<Email> {
    const [email] = await db.insert(emails).values(insertEmail).returning();
    return email;
  }

  async updateEmail(id: number, updateData: Partial<Email>): Promise<Email | undefined> {
    const [email] = await db
      .update(emails)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(emails.id, id))
      .returning();
    return email || undefined;
  }
}

// Export storage instance
export const storage = new DatabaseStorage();