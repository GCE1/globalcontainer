import { integer, pgTable, serial, text, timestamp, varchar, decimal, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const containerTypeEnum = pgEnum('container_type', ['dry', 'refrigerated', 'open-top', 'flat-rack', 'tank']);
export const containerSizeEnum = pgEnum('container_size', ['20ft', '40ft', '45ft']);
export const containerStatusEnum = pgEnum('container_status', ['available', 'leased', 'maintenance']);
export const contractStatusEnum = pgEnum('contract_status', ['pending', 'active', 'completed', 'cancelled']);
export const invoiceStatusEnum = pgEnum('invoice_status', ['pending', 'paid', 'overdue', 'cancelled']);
export const emailFolderEnum = pgEnum('email_folder', ['inbox', 'sent', 'drafts', 'archived']);
export const userRoleEnum = pgEnum('user_role', ['admin', 'manager', 'staff', 'customer']);

// Organizations table (for company accounts)
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  address: text('address'),
  billingAddress: text('billing_address'),
  taxId: varchar('tax_id', { length: 50 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Organization relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  containers: many(containers)
}));

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  organizationId: integer('organization_id').references(() => organizations.id),
  role: userRoleEnum('role').default('customer').notNull(),
  isAdmin: boolean('is_admin').default(false),
  position: varchar('position', { length: 100 }),
  phoneNumber: varchar('phone_number', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// User relations
export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id]
  }),
  containers: many(containers),
  contracts: many(contracts),
  invoices: many(invoices),
  sentEmails: many(emails, { relationName: 'sender' }),
  receivedEmails: many(emails, { relationName: 'recipient' })
}));

// Containers table
export const containers = pgTable('containers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  containerType: containerTypeEnum('container_type').notNull(),
  containerSize: containerSizeEnum('container_size').notNull(),
  containerStatus: containerStatusEnum('container_status').default('available').notNull(),
  origin: varchar('origin', { length: 255 }),
  destination: varchar('destination', { length: 255 }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  freeDays: integer('free_days').default(0),
  perDiemRate: decimal('per_diem_rate', { precision: 10, scale: 2 }).default('0'),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 255 }),
  ownerId: integer('owner_id').references(() => users.id),
  currentLessee: integer('current_lessee').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Container relations
export const containersRelations = relations(containers, ({ one, many }) => ({
  owner: one(users, {
    fields: [containers.ownerId],
    references: [users.id]
  }),
  lessee: one(users, {
    fields: [containers.currentLessee],
    references: [users.id]
  }),
  contracts: many(contracts)
}));

// Contracts table
export const contracts = pgTable('contracts', {
  id: serial('id').primaryKey(),
  containerId: integer('container_id').references(() => containers.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  freeDays: integer('free_days').default(0),
  perDiemRate: decimal('per_diem_rate', { precision: 10, scale: 2 }).default('0'),
  pickupCharge: decimal('pickup_charge', { precision: 10, scale: 2 }).notNull(),
  status: contractStatusEnum('status').default('pending').notNull(),
  paypalOrderId: varchar('paypal_order_id', { length: 255 }),
  paypalSubscriptionId: varchar('paypal_subscription_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Contract relations
export const contractsRelations = relations(contracts, ({ one, many }) => ({
  container: one(containers, {
    fields: [contracts.containerId],
    references: [containers.id]
  }),
  user: one(users, {
    fields: [contracts.userId],
    references: [users.id]
  }),
  invoices: many(invoices)
}));

// Invoices table
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull().unique(),
  contractId: integer('contract_id').references(() => contracts.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: invoiceStatusEnum('status').default('pending').notNull(),
  dueDate: timestamp('due_date'),
  paidDate: timestamp('paid_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Invoice relations
export const invoicesRelations = relations(invoices, ({ one }) => ({
  contract: one(contracts, {
    fields: [invoices.contractId],
    references: [contracts.id]
  }),
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id]
  })
}));

// Emails table
export const emails = pgTable('emails', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  subject: varchar('subject', { length: 255 }),
  content: text('content'),
  sender: varchar('sender', { length: 255 }),
  recipient: varchar('recipient', { length: 255 }),
  folder: emailFolderEnum('folder').default('inbox').notNull(),
  isRead: boolean('is_read').default(false),
  sentDate: timestamp('sent_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Email relations
export const emailsRelations = relations(emails, ({ one }) => ({
  user: one(users, {
    fields: [emails.userId],
    references: [users.id]
  })
}));

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Container = typeof containers.$inferSelect;
export type InsertContainer = typeof containers.$inferInsert;

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

export type Email = typeof emails.$inferSelect;
export type InsertEmail = typeof emails.$inferInsert;