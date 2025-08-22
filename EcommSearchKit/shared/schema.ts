import { pgTable, text, serial, integer, boolean, timestamp, decimal, foreignKey, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  membershipLevel: text("membership_level").default("free"),
  memberSince: timestamp("member_since").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  membershipLevel: true,
});

export const usersRelations = relations(users, ({ many }) => ({
  leases: many(leases),
  favorites: many(favorites),
}));

// Containers Table
export const containers = pgTable("containers", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  type: text("type").notNull(),
  condition: text("condition").notNull(),
  quantity: integer("quantity").default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  depot_name: text("depot_name").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postal_code: text("postal_code").notNull(),
  country: text("country").default("USA"),
  depotId: integer("depot_id").references(() => depotLocations.id),
  name: text("name"),
  location: text("location"),
  region: text("region"),
  postalCode: text("postal_code_alt"),
  image: text("image"),
  wooProductId: integer("woo_product_id"),
  shipping: boolean("shipping").default(true),
  availableImmediately: boolean("available_immediately").default(true),
  leaseAvailable: boolean("lease_available").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertContainerSchema = createInsertSchema(containers).pick({
  name: true,
  type: true,
  condition: true,
  depotId: true,
  location: true,
  region: true,
  city: true,
  postalCode: true,
  price: true,
  image: true,
  sku: true,
  wooProductId: true,
  shipping: true,
  availableImmediately: true,
  leaseAvailable: true,
});

// WooCommerce Products Table
export const wooProducts = pgTable("woo_products", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  wooProductId: integer("woo_product_id").notNull(),
  containerType: text("container_type").notNull(),
  containerCondition: text("container_condition").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  inStock: boolean("in_stock").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWooProductSchema = createInsertSchema(wooProducts).pick({
  sku: true,
  wooProductId: true,
  containerType: true,
  containerCondition: true,
  price: true,
  inStock: true,
});

export const containersRelations = relations(containers, ({ many, one }) => ({
  leases: many(leases),
  favorites: many(favorites),
  depot: one(depotLocations, {
    fields: [containers.depotId],
    references: [depotLocations.id],
  }),
}));

// Leases Table
export const leases = pgTable("leases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  containerId: integer("container_id").notNull().references(() => containers.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  monthlyRate: decimal("monthly_rate", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeaseSchema = createInsertSchema(leases).pick({
  userId: true,
  containerId: true,
  startDate: true,
  endDate: true,
  monthlyRate: true,
  status: true,
});

export const leasesRelations = relations(leases, ({ one }) => ({
  user: one(users, {
    fields: [leases.userId],
    references: [users.id],
  }),
  container: one(containers, {
    fields: [leases.containerId],
    references: [containers.id],
  }),
}));

// Favorites/Watchlist Table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  containerId: integer("container_id").notNull().references(() => containers.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  userId: true,
  containerId: true,
});

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  container: one(containers, {
    fields: [favorites.containerId],
    references: [containers.id],
  }),
}));

// Memberships Table
export const memberships = pgTable("memberships", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).notNull(),
  description: text("description").notNull(),
});

export const insertMembershipSchema = createInsertSchema(memberships).pick({
  name: true,
  price: true,
  discountPercentage: true,
  description: true,
});

// Depot Locations Table
export const depotLocations = pgTable("depot_locations", {
  id: serial("id").primaryKey(),
  depotName: text("depot_name").notNull().unique(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDepotLocationSchema = createInsertSchema(depotLocations).pick({
  depotName: true,
  latitude: true,
  longitude: true,
  address: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
});

export const depotLocationsRelations = relations(depotLocations, ({ many }) => ({
  containers: many(containers),
}));

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Container = typeof containers.$inferSelect;
export type InsertContainer = z.infer<typeof insertContainerSchema>;

export type Lease = typeof leases.$inferSelect;
export type InsertLease = z.infer<typeof insertLeaseSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

export type Membership = typeof memberships.$inferSelect;
export type InsertMembership = z.infer<typeof insertMembershipSchema>;

export type DepotLocation = typeof depotLocations.$inferSelect;
export type InsertDepotLocation = z.infer<typeof insertDepotLocationSchema>;

export type WooProduct = typeof wooProducts.$inferSelect;
export type InsertWooProduct = z.infer<typeof insertWooProductSchema>;
