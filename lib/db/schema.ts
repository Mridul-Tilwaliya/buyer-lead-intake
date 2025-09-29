// lib/db/schema.ts
import { pgTable, text, integer, timestamp, uuid, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums
export const cityEnum = pgEnum('city', ['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']);
export const propertyTypeEnum = pgEnum('property_type', ['Apartment', 'Villa', 'Plot', 'Office', 'Retail']);
export const bhkEnum = pgEnum('bhk', ['1', '2', '3', '4', 'Studio']);
export const purposeEnum = pgEnum('purpose', ['Buy', 'Rent']);
export const timelineEnum = pgEnum('timeline', ['0–3m', '3–6m', '>6m', 'Exploring']);
export const sourceEnum = pgEnum('source', ['Website', 'Referral', 'Walk-in', 'Call', 'Other']);
export const statusEnum = pgEnum('status', ['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']);

// Users table (from Supabase auth)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Buyers table
export const buyers = pgTable('buyers', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  city: cityEnum('city').notNull(),
  propertyType: propertyTypeEnum('property_type').notNull(),
  bhk: bhkEnum('bhk'),
  purpose: purposeEnum('purpose').notNull(),
  budgetMin: integer('budget_min'),
  budgetMax: integer('budget_max'),
  timeline: timelineEnum('timeline').notNull(),
  source: sourceEnum('source').notNull(),
  status: statusEnum('status').notNull().default('New'),
  notes: text('notes'),
  tags: text('tags').array(),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// History table
export const buyerHistory = pgTable('buyer_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  buyerId: uuid('buyer_id').references(() => buyers.id).notNull(),
  changedBy: uuid('changed_by').references(() => users.id).notNull(),
  changedAt: timestamp('changed_at').defaultNow().notNull(),
  diff: jsonb('diff').notNull(), // { field: { old, new } }
});

// Zod schemas for validation
export const insertBuyerSchema = createInsertSchema(buyers, {
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
  budgetMin: z.number().int().min(0).optional(),
  budgetMax: z.number().int().min(0).optional(),
  notes: z.string().max(1000).optional(),
}).refine((data) => {
  if (data.budgetMin && data.budgetMax) {
    return data.budgetMax >= data.budgetMin;
  }
  return true;
}, 'Budget max must be greater than or equal to budget min')
.refine((data) => {
  if (['Apartment', 'Villa'].includes(data.propertyType)) {
    return !!data.bhk;
  }
  return true;
}, 'BHK is required for Apartment and Villa property types');

export const updateBuyerSchema = insertBuyerSchema.partial().extend({
  id: z.string().uuid(),
  updatedAt: z.date(),
});

export type InsertBuyer = z.infer<typeof insertBuyerSchema>;
export type Buyer = typeof buyers.$inferSelect;
export type BuyerWithOwner = Buyer & { owner: { email: string; fullName: string | null } };