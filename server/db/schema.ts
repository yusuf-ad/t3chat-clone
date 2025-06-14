import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
} from "drizzle-orm/pg-core";

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  title: text("title").notNull(),
  // the userId column will be used to store the Clerk user ID
  userId: text("userId").notNull(),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id, { onDelete: "cascade" }),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  annotations: json("annotations").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type DBMessage = InferSelectModel<typeof message>;
