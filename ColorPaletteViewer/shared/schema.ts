import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping as in original file)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Container configuration schema
export const containerConfigs = pgTable("container_configs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  ralCode: text("ral_code").notNull(),
  ralName: text("ral_name").notNull(),
  hexColor: text("hex_color").notNull(),
  doubleDoor: boolean("double_door").default(false),
  openTop: boolean("open_top").default(false),
  lockingBars: text("locking_bars").default("standard"),
  lockingBox: boolean("locking_box").default(false),
  openSideType: text("open_side_type").default("type1"),
  forkLiftPocket: boolean("fork_lift_pocket").default(false),
  createdAt: text("created_at").notNull(),
});

export const insertContainerConfigSchema = createInsertSchema(containerConfigs).omit({
  id: true,
  createdAt: true
});

export type InsertContainerConfig = z.infer<typeof insertContainerConfigSchema>;
export type ContainerConfig = typeof containerConfigs.$inferSelect;
