import { pgTable, text, serial, integer, boolean, timestamp, decimal, doublePrecision, json, varchar, index, unique } from "drizzle-orm/pg-core";
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

// Users table with basic information
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  password: varchar("password"),
  passwordHash: varchar("password_hash"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  jobTitle: varchar("job_title"),
  department: varchar("department"),
  companyName: varchar("company_name"),
  address: varchar("address"),
  city: varchar("city"),
  state: varchar("state"),
  zipCode: varchar("zip_code"),
  country: varchar("country"),
  // Legacy fields (kept for backward compatibility)
  subscriptionTier: text("subscription_tier"), // 'insights', 'expert', 'pro'
  subscriptionStatus: text("subscription_status").default("inactive"), // 'active', 'inactive', 'cancelled'
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  paymentProcessorId: varchar("payment_processor_id"), // PayPal payment/subscription ID
  // Admin role fields
  role: text("role").default("user"), // 'user', 'admin', 'super_admin'
  adminPermissions: json("admin_permissions"), // JSON object with detailed permissions
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: varchar("two_factor_secret"),
  lastLogin: timestamp("last_login"),
  loginAttempts: integer("login_attempts").default(0),
  lockedUntil: timestamp("locked_until"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User roles table - allows multiple membership types per user
export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  roleType: text("role_type").notNull(), // 'insights', 'expert', 'pro', 'admin', 'affiliates'
  subscriptionStatus: text("subscription_status").default("inactive"), // 'active', 'inactive', 'cancelled', 'expired'
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  paymentProcessorId: varchar("payment_processor_id"), // PayPal payment/subscription ID
  paymentTransactionId: varchar("payment_transaction_id"), // Individual payment transaction ID
  autoRenew: boolean("auto_renew").default(true),
  features: json("features"), // JSON object with role-specific features
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  // Add unique constraint for userId and roleType combination
  userRoleUnique: unique("user_role_unique").on(table.userId, table.roleType),
}));

// Newsletter subscriptions table
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  status: text("status").default("active"), // 'active', 'unsubscribed'
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  source: varchar("source").default("blog"), // where they subscribed from
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

// Company employees table
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  ownerId: varchar("owner_id").references(() => users.id).notNull(), // The company owner
  employeeId: varchar("employee_id").references(() => users.id).notNull(), // The employee user
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  position: text("position"),
  department: text("department"),
  status: text("status").default("active"), // 'active', 'inactive', 'pending'
  inviteToken: varchar("invite_token").unique(),
  inviteExpiresAt: timestamp("invite_expires_at"),
  joinedAt: timestamp("joined_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Employee permissions table
export const employeePermissions = pgTable("employee_permissions", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  // Email & Communication permissions
  canAccessEmails: boolean("can_access_emails").default(false),
  canSendEmails: boolean("can_send_emails").default(false),
  canDeleteEmails: boolean("can_delete_emails").default(false),
  canAccessInternalMessages: boolean("can_access_internal_messages").default(false),
  canSendInternalMessages: boolean("can_send_internal_messages").default(false),
  // Contract & Order permissions
  canViewContracts: boolean("can_view_contracts").default(false),
  canEditContracts: boolean("can_edit_contracts").default(false),
  canDeleteContracts: boolean("can_delete_contracts").default(false),
  canViewInvoices: boolean("can_view_invoices").default(false),
  canEditInvoices: boolean("can_edit_invoices").default(false),
  canDeleteInvoices: boolean("can_delete_invoices").default(false),
  // Calendar & Event permissions
  canViewCalendar: boolean("can_view_calendar").default(false),
  canEditCalendar: boolean("can_edit_calendar").default(false),
  canCreateEvents: boolean("can_create_events").default(false),
  canDeleteEvents: boolean("can_delete_events").default(false),
  // Container & Tracking permissions
  canViewContainers: boolean("can_view_containers").default(false),
  canEditContainers: boolean("can_edit_containers").default(false),
  canTrackContainers: boolean("can_track_containers").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Internal messages table for company communication
export const internalMessages = pgTable("internal_messages", {
  id: serial("id").primaryKey(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  recipientId: varchar("recipient_id").references(() => users.id).notNull(),
  companyOwnerId: varchar("company_owner_id").references(() => users.id).notNull(), // For scoping messages to company
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  isRead: boolean("is_read").default(false),
  priority: text("priority").default("medium"), // 'high', 'medium', 'low'
  messageType: text("message_type").default("direct"), // 'direct', 'announcement', 'alert'
  attachments: json("attachments"), // Array of attachment metadata
  replyToId: integer("reply_to_id").references(() => internalMessages.id),
  isDeleted: boolean("is_deleted").default(false),
  deletedAt: timestamp("deleted_at"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// External email access permissions
export const emailAccess = pgTable("email_access", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  companyOwnerId: varchar("company_owner_id").references(() => users.id).notNull(),
  emailAccount: text("email_account").notNull(), // External email account
  accessLevel: text("access_level").default("read"), // 'read', 'write', 'admin'
  canAccessArchive: boolean("can_access_archive").default(false),
  canAccessSent: boolean("can_access_sent").default(false),
  canAccessDrafts: boolean("can_access_drafts").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

// Depot Locations Table - Global Coverage Map Data (definition moved to after paypal tables)

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

// Container tracking for pickup and return management
export const contractContainers = pgTable("contract_containers", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  contractId: integer("contract_id").references(() => leasingContracts.id),
  containerNumber: text("container_number").notNull().unique(),
  containerType: text("container_type").notNull(),
  pickupLocation: text("pickup_location").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("picked_up").notNull(), // picked_up, in_transit, returned
  pickupDate: timestamp("pickup_date").defaultNow(),
  returnDate: timestamp("return_date"),
  notes: text("notes"),
});

// Payment methods for customers
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'paypal', 'credit_card', 'bank_transfer'
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  
  // PayPal specific fields
  paypalEmail: text("paypal_email"),
  paypalCustomerId: text("paypal_customer_id"),
  paypalSubscriptionId: text("paypal_subscription_id"),
  
  // Credit card fields (encrypted/tokenized)
  cardLast4: text("card_last4"),
  cardBrand: text("card_brand"),
  cardExpiryMonth: integer("card_expiry_month"),
  cardExpiryYear: integer("card_expiry_year"),
  cardToken: text("card_token"), // Tokenized card data
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Per diem invoices for automated billing
export const perDiemInvoices = pgTable("per_diem_invoices", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  contractId: integer("contract_id").references(() => leasingContracts.id).notNull(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  billingDate: timestamp("billing_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  
  // Invoice details
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  perDiemRate: decimal("per_diem_rate", { precision: 10, scale: 2 }).notNull(),
  daysOverdue: integer("days_overdue").notNull(),
  containerCount: integer("container_count").notNull(),
  
  // Payment status
  status: text("status").default("pending").notNull(), // pending, paid, failed, cancelled
  paymentMethodId: integer("payment_method_id").references(() => paymentMethods.id),
  paypalOrderId: text("paypal_order_id"),
  paypalPaymentId: text("paypal_payment_id"),
  paidAt: timestamp("paid_at"),
  
  // Retry and dunning
  retryCount: integer("retry_count").default(0),
  nextRetryAt: timestamp("next_retry_at"),
  lastFailureReason: text("last_failure_reason"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Per diem invoice line items
export const perDiemInvoiceItems = pgTable("per_diem_invoice_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").references(() => perDiemInvoices.id).notNull(),
  containerNumber: text("container_number").notNull(),
  containerType: text("container_type").notNull(),
  daysOverdue: integer("days_overdue").notNull(),
  perDiemRate: decimal("per_diem_rate", { precision: 10, scale: 2 }).notNull(),
  lineAmount: decimal("line_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Billing automation schedule
export const billingSchedule = pgTable("billing_schedule", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").references(() => leasingContracts.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  
  // Schedule configuration
  isActive: boolean("is_active").default(true),
  billingFrequency: text("billing_frequency").default("daily").notNull(), // daily, weekly, monthly
  nextBillingDate: timestamp("next_billing_date").notNull(),
  lastBillingDate: timestamp("last_billing_date"),
  
  // Automation settings
  autoCharge: boolean("auto_charge").default(true),
  paymentMethodId: integer("payment_method_id").references(() => paymentMethods.id),
  maxRetries: integer("max_retries").default(3),
  retryIntervalHours: integer("retry_interval_hours").default(24),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment attempts and retry management
export const paymentAttempts = pgTable("payment_attempts", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").references(() => perDiemInvoices.id).notNull(),
  paymentMethodId: integer("payment_method_id").references(() => paymentMethods.id).notNull(),
  
  // Attempt details
  attemptNumber: integer("attempt_number").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(), // success, failed, pending, cancelled
  
  // Payment gateway response
  gatewayResponse: json("gateway_response"),
  gatewayTransactionId: text("gateway_transaction_id"),
  failureReason: text("failure_reason"),
  
  // Timing
  attemptedAt: timestamp("attempted_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Dunning management for failed payments
export const dunningCampaigns = pgTable("dunning_campaigns", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  invoiceId: integer("invoice_id").references(() => perDiemInvoices.id).notNull(),
  
  // Campaign details
  campaignType: text("campaign_type").notNull(), // reminder, warning, final_notice, collection
  status: text("status").default("active").notNull(), // active, paused, completed, cancelled
  
  // Schedule
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  nextActionDate: timestamp("next_action_date"),
  
  // Actions taken
  emailsSent: integer("emails_sent").default(0),
  callsMade: integer("calls_made").default(0),
  noticesSent: integer("notices_sent").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User-owned container inventory for paid members
export const userContainers = pgTable("user_containers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  
  // Container details
  containerNumber: varchar("container_number").notNull().unique(),
  containerType: text("container_type").notNull(), // 20GP, 40HC, etc.
  condition: text("condition").notNull(), // New, CW, WWT, IICL, etc.
  
  // Location and status
  currentLocation: text("current_location").notNull(),
  depot: text("depot"),
  status: text("status").default("available").notNull(), // available, leased, maintenance, transit
  
  // Financial details
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }),
  purchaseDate: timestamp("purchase_date"),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  
  // Operational details
  lastInspectionDate: timestamp("last_inspection_date"),
  nextInspectionDue: timestamp("next_inspection_due"),
  certificationExpiry: timestamp("certification_expiry"),
  
  // Notes and metadata
  notes: text("notes"),
  imageUrls: json("image_urls"), // Array of image URLs
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Container releases tracking for GCE members and staff
export const containerReleases = pgTable("container_releases", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  
  // Container and release information
  containerNumber: varchar("container_number").notNull(),
  releaseNumber: varchar("release_number").notNull().unique(),
  
  // Customer information
  customerName: text("customer_name").notNull(),
  customerLocation: text("customer_location").notNull(),
  
  // Container details
  containerType: text("container_type").notNull(),
  containerCondition: text("container_condition").notNull(),
  
  // Financial information
  contractAmount: decimal("contract_amount", { precision: 10, scale: 2 }),
  freeDaysRemaining: integer("free_days_remaining"),
  
  // Release details
  releaseDate: timestamp("release_date").defaultNow().notNull(),
  releaseLocation: text("release_location"),
  releaseNotes: text("release_notes"),
  
  // Status and tracking
  status: text("status").default("released").notNull(), // released, completed, disputed
  verifiedBy: varchar("verified_by"), // Staff member who verified
  verificationDate: timestamp("verification_date"),
  
  // Metadata
  invoiceId: varchar("invoice_id"), // Link to related invoice
  eventType: text("event_type").notNull(), // purchased, delivered, in_transit, released
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wholesale invoices for container transactions
export const wholesaleInvoices = pgTable("wholesale_invoices", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  
  // Invoice identification
  invoiceNumber: varchar("invoice_number").notNull().unique(),
  
  // Customer information
  customerName: text("customer_name").notNull(),
  customerEmail: varchar("customer_email").notNull(),
  customerAddress: text("customer_address"),
  
  // Invoice dates
  issueDate: timestamp("issue_date").defaultNow().notNull(),
  dueDate: timestamp("due_date").notNull(),
  
  // Financial information
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).default("0.00"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  
  // Status and payment
  status: text("status").default("draft").notNull(), // draft, sent, paid, overdue, cancelled
  paymentStatus: text("payment_status").default("unpaid").notNull(), // unpaid, partial, paid, refunded
  paymentMethod: text("payment_method"), // paypal, bank_transfer, check
  paymentDate: timestamp("payment_date"),
  
  // PayPal integration
  paypalOrderId: varchar("paypal_order_id"),
  paypalPaymentId: varchar("paypal_payment_id"),
  
  // Notes and terms
  notes: text("notes"),
  terms: text("terms"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Invoice line items for wholesale transactions
export const wholesaleInvoiceItems = pgTable("wholesale_invoice_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").references(() => wholesaleInvoices.id).notNull(),
  
  // Item details
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
  
  // Container reference (if applicable)
  containerType: text("container_type"),
  containerCondition: text("container_condition"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Track-Trace Connect Integration Tables

// Container tracking subscriptions
export const trackingSubscriptions = pgTable("tracking_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  containerNumber: varchar("container_number").notNull(),
  trackingServiceId: varchar("tracking_service_id"), // External tracking service ID
  
  // Alert preferences
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  webhookUrl: varchar("webhook_url"),
  alertTypes: json("alert_types"), // ['delay', 'deviation', 'milestone', 'security', 'temperature']
  updateFrequency: text("update_frequency").default("realtime"), // 'realtime', 'hourly', 'daily'
  
  // Subscription status
  isActive: boolean("is_active").default(true),
  lastUpdate: timestamp("last_update"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Real-time container tracking data
export const containerTracking = pgTable("container_tracking", {
  id: serial("id").primaryKey(),
  containerNumber: varchar("container_number").notNull(),
  
  // Current status and location
  status: varchar("status").notNull(), // 'loaded', 'in_transit', 'at_port', 'delivered', etc.
  currentLatitude: doublePrecision("current_latitude"),
  currentLongitude: doublePrecision("current_longitude"),
  currentAddress: text("current_address"),
  currentPort: varchar("current_port"),
  currentTerminal: varchar("current_terminal"),
  
  // Destination information
  destinationAddress: text("destination_address"),
  destinationPort: varchar("destination_port"),
  estimatedArrival: timestamp("estimated_arrival"),
  
  // Vessel information
  vesselName: varchar("vessel_name"),
  vesselImo: varchar("vessel_imo"),
  vesselFlag: varchar("vessel_flag"),
  
  // Route progress
  routeProgress: integer("route_progress").default(0), // Percentage 0-100
  
  // Sensor data (for reefer containers, etc.)
  temperature: doublePrecision("temperature"),
  humidity: doublePrecision("humidity"),
  shockDetected: boolean("shock_detected").default(false),
  doorStatus: text("door_status"), // 'open', 'closed'
  
  // Timestamps
  lastUpdate: timestamp("last_update").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tracking route history and waypoints
export const trackingWaypoints = pgTable("tracking_waypoints", {
  id: serial("id").primaryKey(),
  containerNumber: varchar("container_number").notNull(),
  
  // Location data
  location: text("location").notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  
  // Event information
  status: varchar("status").notNull(),
  eventType: varchar("event_type"), // 'departure', 'arrival', 'customs', 'loading', etc.
  description: text("description"),
  
  // Transport information
  transportMode: varchar("transport_mode"), // 'vessel', 'truck', 'rail', 'terminal'
  transportReference: varchar("transport_reference"), // Vessel name, truck ID, etc.
  
  // Timing
  eventTimestamp: timestamp("event_timestamp").notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Tracking alerts and notifications
export const trackingAlerts = pgTable("tracking_alerts", {
  id: serial("id").primaryKey(),
  containerNumber: varchar("container_number").notNull(),
  userId: integer("user_id").references(() => users.id),
  
  // Alert details
  alertType: varchar("alert_type").notNull(), // 'delay', 'deviation', 'milestone', 'security', 'temperature'
  message: text("message").notNull(),
  priority: varchar("priority").default("medium"), // 'low', 'medium', 'high', 'critical'
  
  // Alert status
  status: varchar("status").default("active"), // 'active', 'acknowledged', 'resolved'
  acknowledgedBy: integer("acknowledged_by").references(() => users.id),
  acknowledgedAt: timestamp("acknowledged_at"),
  
  // Notification tracking
  emailSent: boolean("email_sent").default(false),
  smsSent: boolean("sms_sent").default(false),
  webhookSent: boolean("webhook_sent").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
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

// Depot location schema moved to after table definition

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  firstName: true,
  lastName: true,
  email: true,
  company: true,
  subject: true,
  message: true,
});

export const insertUserContainerSchema = createInsertSchema(userContainers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Admin roles and permissions table
export const adminRoles = pgTable("admin_roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // 'super_admin', 'pricing_manager', 'content_manager', 'user_manager', 'sales_manager', 'analytics_manager'
  displayName: text("display_name").notNull(),
  description: text("description"),
  permissions: json("permissions").notNull(), // JSON array of permission strings
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin activity logs table
export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: serial("id").primaryKey(),
  adminId: varchar("admin_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // 'create', 'update', 'delete', 'login', 'logout'
  resource: text("resource").notNull(), // 'user', 'order', 'pricing', 'content', etc.
  resourceId: text("resource_id"), // ID of the affected resource
  details: json("details"), // Additional details about the action
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin two-factor authentication backup codes
export const adminBackupCodes = pgTable("admin_backup_codes", {
  id: serial("id").primaryKey(),
  adminId: varchar("admin_id").references(() => users.id).notNull(),
  code: varchar("code").notNull(),
  used: boolean("used").default(false),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin notifications table
export const adminNotifications = pgTable("admin_notifications", {
  id: serial("id").primaryKey(),
  adminId: varchar("admin_id").references(() => users.id),
  type: text("type").notNull(), // 'alert', 'warning', 'info', 'success'
  title: text("title").notNull(),
  message: text("message").notNull(),
  priority: text("priority").default("medium"), // 'high', 'medium', 'low'
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// System settings table
export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: json("value").notNull(),
  category: text("category").notNull(), // 'pricing', 'features', 'email', 'security', etc.
  description: text("description"),
  isPublic: boolean("is_public").default(false), // Whether setting can be accessed by frontend
  lastModifiedBy: varchar("last_modified_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin dashboard widgets table
export const adminDashboardWidgets = pgTable("admin_dashboard_widgets", {
  id: serial("id").primaryKey(),
  adminId: varchar("admin_id").references(() => users.id).notNull(),
  widgetType: text("widget_type").notNull(), // 'sales_chart', 'user_stats', 'recent_orders', etc.
  position: integer("position").notNull(),
  size: text("size").default("medium"), // 'small', 'medium', 'large'
  isVisible: boolean("is_visible").default(true),
  configuration: json("configuration"), // Widget-specific configuration
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment transactions table for tracking all payments
export const paymentTransactions = pgTable("payment_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  paymentProcessor: text("payment_processor").notNull(), // 'paypal', 'stripe'
  processorTransactionId: varchar("processor_transaction_id").notNull().unique(), // PayPal Order ID or Stripe Payment Intent ID
  processorPaymentId: varchar("processor_payment_id"), // PayPal Payment ID after capture
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  status: text("status").notNull(), // 'pending', 'completed', 'failed', 'cancelled', 'refunded'
  paymentType: text("payment_type").notNull(), // 'membership', 'product', 'container'
  membershipPlanId: varchar("membership_plan_id"), // For membership payments
  productId: integer("product_id"), // For product purchases
  orderId: integer("order_id"), // For container orders
  metadata: json("metadata"), // Additional payment data
  failureReason: text("failure_reason"), // If payment failed
  refundedAt: timestamp("refunded_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Membership subscriptions table for tracking subscription lifecycle
export const membershipSubscriptions = pgTable("membership_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  planId: varchar("plan_id").notNull(), // 'insights', 'expert', 'pro'
  status: text("status").notNull(), // 'active', 'cancelled', 'expired', 'suspended'
  paymentProcessor: text("payment_processor").notNull(), // 'paypal', 'stripe'
  processorSubscriptionId: varchar("processor_subscription_id").unique(), // PayPal Subscription ID
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelledAt: timestamp("cancelled_at"),
  cancelReason: text("cancel_reason"),
  lastPaymentDate: timestamp("last_payment_date"),
  nextPaymentDate: timestamp("next_payment_date"),
  trialEndsAt: timestamp("trial_ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// PayPal webhook events table for payment reconciliation
export const paypalWebhookEvents = pgTable("paypal_webhook_events", {
  id: serial("id").primaryKey(),
  eventId: varchar("event_id").notNull().unique(), // PayPal event ID
  eventType: text("event_type").notNull(), // PAYMENT.CAPTURE.COMPLETED, etc.
  resourceType: text("resource_type"), // 'payment', 'subscription'
  resourceId: varchar("resource_id"), // PayPal resource ID
  processed: boolean("processed").default(false),
  processingError: text("processing_error"),
  eventData: json("event_data").notNull(), // Full PayPal webhook payload
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Depot locations for global coverage map
export const depotLocations = pgTable("depot_locations", {
  id: serial("id").primaryKey(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  code: text("code").notNull().unique(),
  depot_name: text("depot_name").notNull(),
  address: text("address"),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  services_offered: json("services_offered"),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// Insert schema for depot locations
export const insertDepotLocationSchema = createInsertSchema(depotLocations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserRoleSchema = createInsertSchema(userRoles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdminRoleSchema = createInsertSchema(adminRoles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdminActivityLogSchema = createInsertSchema(adminActivityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertSystemSettingSchema = createInsertSchema(systemSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Insert schemas for payment tables
export const insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMembershipSubscriptionSchema = createInsertSchema(membershipSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaypalWebhookEventSchema = createInsertSchema(paypalWebhookEvents).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

// Type definitions for admin system
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;

export type AdminRole = typeof adminRoles.$inferSelect;
export type InsertAdminRole = z.infer<typeof insertAdminRoleSchema>;

export type AdminActivityLog = typeof adminActivityLogs.$inferSelect;
export type InsertAdminActivityLog = z.infer<typeof insertAdminActivityLogSchema>;

export type AdminBackupCode = typeof adminBackupCodes.$inferSelect;
export type AdminNotification = typeof adminNotifications.$inferSelect;
export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;
export type AdminDashboardWidget = typeof adminDashboardWidgets.$inferSelect;

// Type definitions for payment system
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = z.infer<typeof insertPaymentTransactionSchema>;
export type MembershipSubscription = typeof membershipSubscriptions.$inferSelect;
export type InsertMembershipSubscription = z.infer<typeof insertMembershipSubscriptionSchema>;
export type PaypalWebhookEvent = typeof paypalWebhookEvents.$inferSelect;
export type InsertPaypalWebhookEvent = z.infer<typeof insertPaypalWebhookEventSchema>;

export type Container = typeof containers.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type LeasingOrder = typeof leasingOrders.$inferSelect;
export type LeasingContract = typeof leasingContracts.$inferSelect;

// Email accounts table for inbox management
export const emailAccounts = pgTable("email_accounts", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  name: varchar("name").notNull(),
  department: varchar("department"),
  role: varchar("role"),
  isActive: boolean("is_active").default(true),
  imapHost: varchar("imap_host").notNull(),
  imapPort: integer("imap_port").notNull(),
  smtpHost: varchar("smtp_host").notNull(),
  smtpPort: integer("smtp_port").notNull(),
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Emails table for storing inbox messages
export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").references(() => emailAccounts.id).notNull(),
  messageId: varchar("message_id").unique().notNull(),
  subject: text("subject"),
  fromEmail: varchar("from_email").notNull(),
  fromName: varchar("from_name"),
  toEmail: varchar("to_email").notNull(),
  replyTo: varchar("reply_to"),
  body: text("body"),
  htmlBody: text("html_body"),
  isRead: boolean("is_read").default(false),
  isImportant: boolean("is_important").default(false),
  isSent: boolean("is_sent").default(false),
  receivedAt: timestamp("received_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  messageIdIndex: index("email_message_id_idx").on(table.messageId),
  accountIdIndex: index("email_account_id_idx").on(table.accountId),
  receivedAtIndex: index("email_received_at_idx").on(table.receivedAt),
}));

// Email replies table for tracking sent responses
export const emailReplies = pgTable("email_replies", {
  id: serial("id").primaryKey(),
  originalEmailId: integer("original_email_id").references(() => emails.id).notNull(),
  fromAccountId: integer("from_account_id").references(() => emailAccounts.id).notNull(),
  toEmail: varchar("to_email").notNull(),
  subject: text("subject"),
  body: text("body"),
  htmlBody: text("html_body"),
  sentAt: timestamp("sent_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations for email management
export const emailAccountsRelations = relations(emailAccounts, ({ many }) => ({
  emails: many(emails),
  sentReplies: many(emailReplies),
}));

export const emailsRelations = relations(emails, ({ one, many }) => ({
  account: one(emailAccounts, {
    fields: [emails.accountId],
    references: [emailAccounts.id],
  }),
  replies: many(emailReplies),
}));

export const emailRepliesRelations = relations(emailReplies, ({ one }) => ({
  originalEmail: one(emails, {
    fields: [emailReplies.originalEmailId],
    references: [emails.id],
  }),
  fromAccount: one(emailAccounts, {
    fields: [emailReplies.fromAccountId],
    references: [emailAccounts.id],
  }),
}));

// Export types for email management
export type EmailAccount = typeof emailAccounts.$inferSelect;
export type InsertEmailAccount = typeof emailAccounts.$inferInsert;
export type Email = typeof emails.$inferSelect;
export type InsertEmail = typeof emails.$inferInsert;
export type EmailReply = typeof emailReplies.$inferSelect;
export type InsertEmailReply = typeof emailReplies.$inferInsert;

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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

export const insertLeasingContractSchema = createInsertSchema(leasingContracts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContractContainerSchema = createInsertSchema(contractContainers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Payment and billing schemas
export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPerDiemInvoiceSchema = createInsertSchema(perDiemInvoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPerDiemInvoiceItemSchema = createInsertSchema(perDiemInvoiceItems).omit({
  id: true,
  createdAt: true,
});

export const insertBillingScheduleSchema = createInsertSchema(billingSchedule).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentAttemptSchema = createInsertSchema(paymentAttempts).omit({
  id: true,
  createdAt: true,
});

export const insertDunningCampaignSchema = createInsertSchema(dunningCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWholesaleInvoiceSchema = createInsertSchema(wholesaleInvoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWholesaleInvoiceItemSchema = createInsertSchema(wholesaleInvoiceItems).omit({
  id: true,
  createdAt: true,
});

// Validation schemas
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

// Type exports
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
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type LeasingOrder = typeof leasingOrders.$inferSelect;
export type InsertLeasingOrder = z.infer<typeof insertLeasingOrderSchema>;
export type LeasingOrderItem = typeof leasingOrderItems.$inferSelect;
export type InsertLeasingOrderItem = z.infer<typeof insertLeasingOrderItemSchema>;
export type LeasingContract = typeof leasingContracts.$inferSelect;
export type InsertLeasingContract = z.infer<typeof insertLeasingContractSchema>;
export type ContractContainer = typeof contractContainers.$inferSelect;
export type InsertContractContainer = z.infer<typeof insertContractContainerSchema>;
export type UserContainer = typeof userContainers.$inferSelect;
export type InsertUserContainer = z.infer<typeof insertUserContainerSchema>;

// Wholesale invoice types
export type WholesaleInvoice = typeof wholesaleInvoices.$inferSelect;
export type InsertWholesaleInvoice = typeof wholesaleInvoices.$inferInsert;
export type WholesaleInvoiceItem = typeof wholesaleInvoiceItems.$inferSelect;
export type InsertWholesaleInvoiceItem = typeof wholesaleInvoiceItems.$inferInsert;

// Payment and billing types
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type PerDiemInvoice = typeof perDiemInvoices.$inferSelect;
export type InsertPerDiemInvoice = z.infer<typeof insertPerDiemInvoiceSchema>;
export type PerDiemInvoiceItem = typeof perDiemInvoiceItems.$inferSelect;
export type InsertPerDiemInvoiceItem = z.infer<typeof insertPerDiemInvoiceItemSchema>;
export type BillingSchedule = typeof billingSchedule.$inferSelect;
export type InsertBillingSchedule = z.infer<typeof insertBillingScheduleSchema>;
export type PaymentAttempt = typeof paymentAttempts.$inferSelect;
export type InsertPaymentAttempt = z.infer<typeof insertPaymentAttemptSchema>;
export type DunningCampaign = typeof dunningCampaigns.$inferSelect;
export type InsertDunningCampaign = z.infer<typeof insertDunningCampaignSchema>;



export const employeeEmailSettings = pgTable("employee_email_settings", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => employees.id),
  imapHost: varchar("imap_host"),
  imapPort: integer("imap_port"),
  imapUsername: varchar("imap_username"),
  imapPassword: varchar("imap_password"),
  smtpHost: varchar("smtp_host"),
  smtpPort: integer("smtp_port"),
  smtpUsername: varchar("smtp_username"),
  smtpPassword: varchar("smtp_password"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Container releases schema exports
export const insertContainerReleaseSchema = createInsertSchema(containerReleases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ContainerRelease = typeof containerReleases.$inferSelect;
export type InsertContainerRelease = z.infer<typeof insertContainerReleaseSchema>;

// Employee schema exports
export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmployeePermissionsSchema = createInsertSchema(employeePermissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmployeeEmailSettingsSchema = createInsertSchema(employeeEmailSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInternalMessageSchema = createInsertSchema(internalMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmailAccessSchema = createInsertSchema(emailAccess).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type EmployeePermissions = typeof employeePermissions.$inferSelect;
export type InsertEmployeePermissions = z.infer<typeof insertEmployeePermissionsSchema>;
export type EmployeeEmailSettings = typeof employeeEmailSettings.$inferSelect;
export type InsertEmployeeEmailSettings = z.infer<typeof insertEmployeeEmailSettingsSchema>;
export type InternalMessage = typeof internalMessages.$inferSelect;
export type InsertInternalMessage = z.infer<typeof insertInternalMessageSchema>;
export type EmailAccess = typeof emailAccess.$inferSelect;
export type InsertEmailAccess = z.infer<typeof insertEmailAccessSchema>;

// Container Management table for inventory management
export const managedContainers = pgTable("managed_containers", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  containerId: text("container_id").notNull().unique(),
  containerType: text("container_type").notNull(),
  location: text("location").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("available").notNull(), // 'available', 'leased', 'maintenance'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Container Management schemas
export const insertManagedContainerSchema = createInsertSchema(managedContainers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateManagedContainerSchema = insertManagedContainerSchema.partial();

// Container Management types
export type ManagedContainer = typeof managedContainers.$inferSelect;
export type InsertManagedContainer = z.infer<typeof insertManagedContainerSchema>;
export type UpdateManagedContainer = z.infer<typeof updateManagedContainerSchema>;

// Email Campaign Management Tables

// Email campaigns table
export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  type: text("type").notNull(), // 'broadcast', 'automation', 'recurring', 'drip'
  status: text("status").default("draft").notNull(), // 'draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled'
  
  // Audience targeting
  audience: text("audience").notNull(), // 'all_users', 'active_customers', 'new_customers', 'subscribers', 'abandoned_carts', 'price_watchers'
  recipientCount: integer("recipient_count").default(0),
  
  // Campaign content
  templateId: integer("template_id").references(() => emailTemplates.id),
  htmlContent: text("html_content"),
  plainTextContent: text("plain_text_content"),
  
  // Scheduling
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  
  // Analytics
  emailsSent: integer("emails_sent").default(0),
  emailsOpened: integer("emails_opened").default(0),
  emailsClicked: integer("emails_clicked").default(0),
  emailsBounced: integer("emails_bounced").default(0),
  emailsUnsubscribed: integer("emails_unsubscribed").default(0),
  
  // Configuration
  fromEmail: text("from_email").notNull(),
  fromName: text("from_name").notNull(),
  replyToEmail: text("reply_to_email"),
  
  // Metadata
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email templates table
export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'welcome', 'promotion', 'newsletter', 'transactional'
  subject: text("subject").notNull(),
  htmlContent: text("html_content").notNull(),
  plainTextContent: text("plain_text_content"),
  isActive: boolean("is_active").default(true),
  
  // Template variables
  variables: json("variables"), // Array of available template variables
  
  // Design settings
  designTheme: text("design_theme").default("professional"), // 'professional', 'modern', 'minimal'
  brandingSettings: json("branding_settings"), // Colors, fonts, logos, etc.
  
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Campaign recipients tracking
export const campaignRecipients = pgTable("campaign_recipients", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => emailCampaigns.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  email: text("email").notNull(),
  
  // Delivery tracking
  status: text("status").default("pending").notNull(), // 'pending', 'sent', 'delivered', 'bounced', 'failed'
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  unsubscribedAt: timestamp("unsubscribed_at"),
  
  // Error tracking
  failureReason: text("failure_reason"),
  bounceType: text("bounce_type"), // 'hard', 'soft'
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Email analytics and logs
export const emailAnalytics = pgTable("email_analytics", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => emailCampaigns.id).notNull(),
  recipientId: integer("recipient_id").references(() => campaignRecipients.id).notNull(),
  
  // Event tracking
  eventType: text("event_type").notNull(), // 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed'
  eventData: json("event_data"), // Additional event-specific data
  
  // Location and device info
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  deviceType: text("device_type"), // 'desktop', 'mobile', 'tablet'
  location: text("location"), // City, Country
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Email subscribers and list management
export const emailSubscribers = pgTable("email_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  
  // Subscription status
  status: text("status").default("active").notNull(), // 'active', 'unsubscribed', 'bounced', 'complained'
  source: text("source"), // 'website', 'manual', 'import', 'api'
  
  // Preferences
  subscriptionTags: json("subscription_tags"), // Array of interest tags
  frequency: text("frequency").default("all"), // 'all', 'weekly', 'monthly'
  
  // Tracking
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  unsubscribeReason: text("unsubscribe_reason"),
  
  // Double opt-in
  confirmationToken: varchar("confirmation_token"),
  confirmedAt: timestamp("confirmed_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email Campaign schemas
export const insertEmailCampaignSchema = createInsertSchema(emailCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCampaignRecipientSchema = createInsertSchema(campaignRecipients).omit({
  id: true,
  createdAt: true,
});

export const insertEmailSubscriberSchema = createInsertSchema(emailSubscribers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Email Campaign types
export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type InsertEmailCampaign = z.infer<typeof insertEmailCampaignSchema>;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type CampaignRecipient = typeof campaignRecipients.$inferSelect;
export type InsertCampaignRecipient = z.infer<typeof insertCampaignRecipientSchema>;
export type EmailAnalytic = typeof emailAnalytics.$inferSelect;
export type EmailSubscriber = typeof emailSubscribers.$inferSelect;
export type InsertEmailSubscriber = z.infer<typeof insertEmailSubscriberSchema>;
// Newsletter subscription schemas and types
export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  subscribedAt: true,
});

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
