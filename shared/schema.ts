import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (kept from original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Photo schema
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("imageUrl").notNull(),
  date: text("date").notNull(),
  category: text("category").notNull(),
  caption: text("caption"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  createdAt: true,
});

// Message schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  sender: text("sender").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Milestone schema
export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
  createdAt: true,
});

// Bucket list item schema
export const bucketItems = pgTable("bucketItems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  targetDate: text("targetDate"),
  notes: text("notes"),
  completed: boolean("completed").default(false).notNull(),
  completedDate: text("completedDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const insertBucketItemSchema = createInsertSchema(bucketItems).omit({
  id: true,
  createdAt: true,
});

// Relationship data schema
export const relationship = pgTable("relationship", {
  id: serial("id").primaryKey(),
  startDate: text("startDate").notNull(),
  partner1: text("partner1").notNull(),
  partner2: text("partner2").notNull(),
});

export const insertRelationshipSchema = createInsertSchema(relationship).omit({
  id: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type Milestone = typeof milestones.$inferSelect;

export type InsertBucketItem = z.infer<typeof insertBucketItemSchema>;
export type BucketItem = typeof bucketItems.$inferSelect;

export type InsertRelationship = z.infer<typeof insertRelationshipSchema>;
export type Relationship = typeof relationship.$inferSelect;
