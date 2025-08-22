import { users, type User, type InsertUser, containerConfigs, type ContainerConfig, type InsertContainerConfig } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Container config operations
  getContainerConfig(id: number): Promise<ContainerConfig | undefined>;
  getContainerConfigsByUserId(userId: number): Promise<ContainerConfig[]>;
  createContainerConfig(config: InsertContainerConfig): Promise<ContainerConfig>;
  updateContainerConfig(id: number, config: Partial<InsertContainerConfig>): Promise<ContainerConfig | undefined>;
  deleteContainerConfig(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Container config implementations
  async getContainerConfig(id: number): Promise<ContainerConfig | undefined> {
    const [config] = await db
      .select()
      .from(containerConfigs)
      .where(eq(containerConfigs.id, id));
    return config || undefined;
  }

  async getContainerConfigsByUserId(userId: number): Promise<ContainerConfig[]> {
    return await db
      .select()
      .from(containerConfigs)
      .where(eq(containerConfigs.userId, userId));
  }

  async createContainerConfig(config: InsertContainerConfig): Promise<ContainerConfig> {
    const [newConfig] = await db
      .insert(containerConfigs)
      .values({
        ...config,
        createdAt: new Date().toISOString(),
      })
      .returning();
    return newConfig;
  }

  async updateContainerConfig(
    id: number, 
    config: Partial<InsertContainerConfig>
  ): Promise<ContainerConfig | undefined> {
    const [updatedConfig] = await db
      .update(containerConfigs)
      .set(config)
      .where(eq(containerConfigs.id, id))
      .returning();
    return updatedConfig || undefined;
  }

  async deleteContainerConfig(id: number): Promise<boolean> {
    const result = await db
      .delete(containerConfigs)
      .where(eq(containerConfigs.id, id))
      .returning({ id: containerConfigs.id });
    
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();