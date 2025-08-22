import { pgTable, text, serial, integer, boolean, timestamp, decimal, doublePrecision, json, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table with subscription information
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  subscriptionTier: text("subscription_tier"), // 'insights', 'professional', 'expert'
  subscriptionStatus: text("subscription_status").default("inactive"), // 'active', 'inactive', 'cancelled'
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull(),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customers table for subscription management
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  
  // Personal Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  
  // Business Information
  companyName: text("company_name"),
  companyType: text("company_type"), // 'individual', 'small_business', 'corporation', 'llc'
  industry: text("industry"),
  companySize: text("company_size"),
  website: text("website"),
  
  // Address Information
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull().default("United States"),
  
  // Business Details
  businessDescription: text("business_description"),
  expectedUsage: text("expected_usage"),
  
  // Subscription Information
  subscriptionTier: text("subscription_tier").notNull(), // 'insights', 'professional', 'expert'
  subscriptionStatus: text("subscription_status").default("pending"), // 'pending', 'active', 'cancelled'
  monthlyPrice: decimal("monthly_price", { precision: 10, scale: 2 }),
  
  // Payment Information
  paymentMethod: text("payment_method"), // 'credit_card', 'paypal', 'bank_transfer'
  paymentProcessorId: text("payment_processor_id"), // External payment system ID
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer Profiles Table (Legacy)
export const customerProfiles = pgTable("customer_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  company: text("company"),
  phone: text("phone"),
  billingAddress: text("billing_address").notNull(),
  billingCity: text("billing_city").notNull(),
  billingState: text("billing_state").notNull(),
  billingZip: text("billing_zip").notNull(),
  shippingAddress: text("shipping_address"),
  shippingCity: text("shipping_city"),
  shippingState: text("shipping_state"),
  shippingZip: text("shipping_zip"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customerProfiles.id).notNull(),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).notNull(),
  expeditedFee: decimal("expedited_fee", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  paymentMethod: text("payment_method"), // credit_card, paypal, etc.
  paymentId: text("payment_id"), // External payment processor ID
  shippingMethod: text("shipping_method").notNull(),
  doorDirection: text("door_direction").notNull(),
  expeditedDelivery: boolean("expedited_delivery").default(false),
  payOnDelivery: boolean("pay_on_delivery").default(false),
  distanceMiles: decimal("distance_miles", { precision: 8, scale: 2 }),
  referralCode: text("referral_code"),
  orderNote: text("order_note"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order Items Table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  containerId: integer("container_id").references(() => containers.id).notNull(),
  sku: text("sku").notNull(),
  containerType: text("container_type").notNull(),
  containerCondition: text("container_condition").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  depotName: text("depot_name").notNull(),
  depotLocation: text("depot_location").notNull(),
});

// Invoices Table
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull().unique(),
  customerId: integer("customer_id").references(() => customerProfiles.id).notNull(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  invoiceDate: timestamp("invoice_date").defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).notNull(),
  expeditedFee: decimal("expedited_fee", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, paid, overdue, cancelled
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerProfileSchema = createInsertSchema(customerProfiles).pick({
  userId: true,
  email: true,
  firstName: true,
  lastName: true,
  company: true,
  phone: true,
  billingAddress: true,
  billingCity: true,
  billingState: true,
  billingZip: true,
  shippingAddress: true,
  shippingCity: true,
  shippingState: true,
  shippingZip: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  customerId: true,
  orderNumber: true,
  status: true,
  subtotal: true,
  shippingCost: true,
  expeditedFee: true,
  totalAmount: true,
  paymentStatus: true,
  paymentMethod: true,
  paymentId: true,
  shippingMethod: true,
  doorDirection: true,
  expeditedDelivery: true,
  payOnDelivery: true,
  distanceMiles: true,
  referralCode: true,
  orderNote: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  containerId: true,
  sku: true,
  containerType: true,
  containerCondition: true,
  unitPrice: true,
  quantity: true,
  totalPrice: true,
  depotName: true,
  depotLocation: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).pick({
  orderId: true,
  customerId: true,
  invoiceNumber: true,
  invoiceDate: true,
  dueDate: true,
  subtotal: true,
  shippingCost: true,
  expeditedFee: true,
  totalAmount: true,
  status: true,
  paidAt: true,
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertContainerSchema = createInsertSchema(containers).pick({
  sku: true,
  type: true,
  condition: true,
  quantity: true,
  price: true,
  depot_name: true,
  latitude: true,
  longitude: true,
  address: true,
  city: true,
  state: true,
  postal_code: true,
  country: true,
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

// Remove relations for now to fix the database connection
// export const containersRelations = relations(containers, ({ one }) => ({
//   depot: one(depotLocations, {
//     fields: [containers.depotId],
//     references: [depotLocations.id],
//   }),
// }));

// export const depotLocationsRelations = relations(depotLocations, ({ many }) => ({
//   containers: many(containers),
// }));

export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type Container = typeof containers.$inferSelect;
export type InsertContainer = z.infer<typeof insertContainerSchema>;
export type DepotLocation = typeof depotLocations.$inferSelect;
export type InsertDepotLocation = z.infer<typeof insertDepotLocationSchema>;

export type CustomerProfile = typeof customerProfiles.$inferSelect;
export type InsertCustomerProfile = z.infer<typeof insertCustomerProfileSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

// Contact Messages Table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  firstName: true,
  lastName: true,
  email: true,
  company: true,
  subject: true,
  message: true,
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

// User schema types
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const passwordResetSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

// Customer schema types
export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

// Cart items table for leasing
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  leasingRecordId: text("leasing_record_id").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  containerSize: text("container_size").notNull(),
  price: text("price").notNull(),
  freeDays: text("free_days").notNull(),
  perDiem: text("per_diem").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Leasing orders table
export const leasingOrders = pgTable("leasing_orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  orderNumber: text("order_number").notNull().unique(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending").notNull(), // pending, paid, confirmed, cancelled
  paypalOrderId: text("paypal_order_id"),
  paypalPaymentId: text("paypal_payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leasing order items table
export const leasingOrderItems = pgTable("leasing_order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => leasingOrders.id).notNull(),
  leasingRecordId: text("leasing_record_id").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  containerSize: text("container_size").notNull(),
  price: text("price").notNull(),
  freeDays: text("free_days").notNull(),
  perDiem: text("per_diem").notNull(),
  quantity: integer("quantity").notNull(),
  lineTotal: decimal("line_total", { precision: 10, scale: 2 }).notNull(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export const insertLeasingOrderSchema = createInsertSchema(leasingOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeasingOrderItemSchema = createInsertSchema(leasingOrderItems).omit({
  id: true,
});

// Leasing contracts table for contract activation
export const leasingContracts = pgTable("leasing_contracts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  contractNumber: text("contract_number").notNull().unique(),
  containerSize: text("container_size").notNull(),
  quantity: integer("quantity").notNull(),
  freeDays: integer("free_days").notNull(),
  perDiemRate: decimal("per_diem_rate", { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(), // Calculated: startDate + freeDays
  status: text("status").default("active").notNull(), // active, expired, terminated
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  totalValue: decimal("total_value", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLeasingContractSchema = createInsertSchema(leasingContracts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type LeasingOrder = typeof leasingOrders.$inferSelect;
export type InsertLeasingOrder = z.infer<typeof insertLeasingOrderSchema>;
export type LeasingOrderItem = typeof leasingOrderItems.$inferSelect;
export type InsertLeasingOrderItem = z.infer<typeof insertLeasingOrderItemSchema>;
export type LeasingContract = typeof leasingContracts.$inferSelect;
export type InsertLeasingContract = z.infer<typeof insertLeasingContractSchema>;


