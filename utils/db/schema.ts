import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  address: varchar("address", { length: 42 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

export const Tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => Users.id),
  balance: integer("balance").notNull().default(0),
  stakedAmount: integer("staked_amount").notNull().default(0),
  rewardsEarned: integer("rewards_earned").notNull().default(0),
});

export const Webpages = pgTable("webpages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => Users.id),
  name: text("name"),
  domain: varchar("domain", { length: 255 }).notNull(),
  cid: varchar("cid", { length: 255 }).notNull(),
});

export const Deployments = pgTable("deployments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => Users.id),
  webpageId: integer("webpage_id").references(() => Webpages.id),
  transactionHash: varchar("transaction_hash", { length: 66 }).notNull(),
  deployedAt: timestamp("deployed_at").defaultNow(),
  deploymentUrl: varchar("deployment_url", { length: 255 }).notNull(),
  filecoinInfo: text("filecoin_info"), // New field to store Filecoin information
});

export type Deployment = {
  // ... other fields ...
  ipfsUrl: string;
};
