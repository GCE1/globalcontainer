import {
  type User,
  type InsertUser,
  type Container,
  type InsertContainer,
  type Lease,
  type InsertLease,
  type Favorite,
  type InsertFavorite,
  type Membership,
  type InsertMembership
} from "@shared/schema";
import { DatabaseStorage } from "./storage.db";

// Storage interface with CRUD operations for all models
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // Container operations
  getContainer(id: number): Promise<Container | undefined>;
  getContainers(params: {
    page?: number;
    limit?: number;
    type?: string[];
    condition?: string[];
    region?: string;
    city?: string;
    postalCode?: string;
    priceMin?: number;
    priceMax?: number;
    query?: string;
    sortBy?: string;
  }): Promise<{ containers: Container[]; totalResults: number; totalPages: number }>;
  createContainer(container: InsertContainer): Promise<Container>;
  updateContainer(id: number, containerData: Partial<InsertContainer>): Promise<Container | undefined>;
  deleteContainer(id: number): Promise<boolean>;
  
  // Lease operations
  getLease(id: number): Promise<Lease | undefined>;
  getLeasesByUser(userId: number): Promise<Lease[]>;
  createLease(lease: InsertLease): Promise<Lease>;
  updateLease(id: number, leaseData: Partial<InsertLease>): Promise<Lease | undefined>;
  deleteLease(id: number): Promise<boolean>;
  getLeaseReportData(): Promise<any[]>; // Returns leases with user and container data for reporting
  
  // Favorite operations
  getFavorite(id: number): Promise<Favorite | undefined>;
  getFavoritesByUser(userId: number): Promise<Favorite[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(id: number): Promise<boolean>;
  
  // Membership operations
  getMembership(id: number): Promise<Membership | undefined>;
  getMembershipByName(name: string): Promise<Membership | undefined>;
  getAllMemberships(): Promise<Membership[]>;
  createMembership(membership: InsertMembership): Promise<Membership>;
  updateMembership(id: number, membershipData: Partial<InsertMembership>): Promise<Membership | undefined>;
  deleteMembership(id: number): Promise<boolean>;
}

// Create and export an instance of DatabaseStorage
const storage = new DatabaseStorage();

// Initialize the database with seed data
storage.seedData().catch(err => {
  console.error("Error seeding database:", err);
});

export { storage };
