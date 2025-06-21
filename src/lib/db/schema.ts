import {
  integer,
  serial,
  timestamp,
  varchar,
  pgTable,
  numeric,
  boolean,
  date,
  unique,
  index,
<<<<<<< Updated upstream
  text,
} from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
=======
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 })
>>>>>>> Stashed changes
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

<<<<<<< Updated upstream
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('passwordHash', { length: 255 }).notNull(),
=======
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
>>>>>>> Stashed changes
  ...timestamps,
});

export const categoriesTable = pgTable(
<<<<<<< Updated upstream
  'categories',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => usersTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    name: varchar('name', { length: 255 }).notNull(),
=======
  "categories",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    name: varchar("name", { length: 255 }).notNull(),
>>>>>>> Stashed changes
    ...timestamps,
  },
  (table) => [unique().on(table.userId, table.name), index().on(table.userId)]
);

export const entriesTable = pgTable(
<<<<<<< Updated upstream
  'entries',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => usersTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categoriesTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    name: varchar('name', { length: 255 }).notNull(),
    value: numeric('value', { precision: 10, scale: 2 }).notNull(), // Até 10 dígitos, [-99999999.99, 99999999,99]
    isRecurring: boolean('is_recurring').default(false).notNull(),
    date: date('date', { mode: 'date' }).notNull(), // Usar também como início da recorrência
    recurringEndDate: date('recurring_end_date', { mode: 'date' }),
=======
  "entries",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categoriesTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    name: varchar("name", { length: 255 }).notNull(),
    value: numeric("value", { precision: 10, scale: 2 }).notNull(), // Até 10 dígitos, [-99999999.99, 99999999,99]
    isRecurring: boolean("is_recurring").default(false).notNull(),
    date: date("date", { mode: "date" }).notNull(), // Usar também como início da recorrência
    recurringEndDate: date("recurring_end_date", { mode: "date" }),
>>>>>>> Stashed changes
    ...timestamps,
  },
  (table) => [index().on(table.userId)]
);

export type INewUser = typeof usersTable.$inferInsert;
export type IUser = typeof usersTable.$inferSelect;

export type INewCategory = typeof categoriesTable.$inferInsert;
export type ICategory = typeof categoriesTable.$inferSelect;

export type INewEntry = typeof entriesTable.$inferInsert;
export type Entry = typeof entriesTable.$inferSelect;
