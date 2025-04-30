import { integer, serial, timestamp, varchar, pgTable, primaryKey,  } from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm"

const timestamps = {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).defaultNow().notNull().$onUpdate(() => new Date())
}

export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    ...timestamps
})

export const categoriesTable = pgTable("categories", {
    user_id: integer("user_id").notNull().references(() => usersTable.id),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    ...timestamps
})

export const coisaTable = pgTable("coisas", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => usersTable.id),
    category_id: integer("category_id").notNull().references(() => categoriesTable.id),
    name: varchar("name", { length: 255 }).notNull(),
    value: 
})