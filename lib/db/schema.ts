import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core"

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("admin").notNull(), // 'admin' | 'nominee'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── KYC Records ─────────────────────────────────────────────────────────────
export const kycRecords = pgTable("kyc_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  verified: boolean("verified").default(false).notNull(),
  aadhaarName: text("aadhaar_name"),
  maskedAadhaar: text("masked_aadhaar"),
  dob: text("dob"),
  address: text("address"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Sessions ─────────────────────────────────────────────────────────────────
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Nominees ─────────────────────────────────────────────────────────────────
export const nominees = pgTable("nominees", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  relation: text("relation").notNull(),
  phone: text("phone"),
  status: text("status").default("pending").notNull(), // 'pending' | 'verified'
  access: text("access").array().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Activities ──────────────────────────────────────────────────────────────
export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'login' | 'kyc_init' | 'kyc_success' | 'nominee_add' | 'vault_add'
  description: text("description").notNull(),
  metadata: text("metadata"), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Vault Items ─────────────────────────────────────────────────────────────
export const vaultItems = pgTable("vault_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(), // 'credentials' | 'banking' | 'documents' | 'bookings'
  type: text("type").notNull(), // 'credential' | 'note' | 'file'
  title: text("title").notNull(),
  content: text("content").notNull(), 
  username: text("username"),
  url: text("url"),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Triggers ────────────────────────────────────────────────────────────────
export const triggers = pgTable("triggers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  daysThreshold: text("days_threshold").notNull(), 
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Type exports for use in API routes
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type KycRecord = typeof kycRecords.$inferSelect
export type Session = typeof sessions.$inferSelect
export type Nominee = typeof nominees.$inferSelect
export type Activity = typeof activities.$inferSelect
export type VaultItem = typeof vaultItems.$inferSelect
export type Trigger = typeof triggers.$inferSelect
