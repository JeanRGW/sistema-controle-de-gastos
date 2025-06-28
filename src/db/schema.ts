import { relations } from 'drizzle-orm';
import { uniqueIndex } from 'drizzle-orm/pg-core';
import {
  integer,
  serial,
  timestamp,
  varchar,
  pgTable,
  numeric,
  date,
  index,
} from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

export const usersTable = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex('users_email_unique_index').on(table.email)]
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  categories: many(categoriesTable),
  entries: many(entriesTable),
}));

export const categoriesTable = pgTable(
  'categories',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => usersTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    ...timestamps,
  },
  (table) => [index().on(table.userId)]
);

export const categoriesRelations = relations(
  categoriesTable,
  ({ one, many }) => ({
    owner: one(usersTable, {
      fields: [categoriesTable.userId],
      references: [usersTable.id],
    }),
    entries: many(entriesTable),
  })
);

export const entriesTable = pgTable(
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
    date: date('date', { mode: 'date' }).notNull(), // Usar também como início da recorrência
    ...timestamps,
  },
  (table) => [index().on(table.userId), index().on(table.categoryId)]
);

export const entriesRelations = relations(entriesTable, ({ one }) => ({
  category: one(categoriesTable, {
    fields: [entriesTable.categoryId],
    references: [categoriesTable.id],
  }),
  owner: one(usersTable, {
    fields: [entriesTable.userId],
    references: [usersTable.id],
  }),
}));

export type INewUser = typeof usersTable.$inferInsert;
export type IUser = typeof usersTable.$inferSelect;

export type INewCategory = typeof categoriesTable.$inferInsert;
export type ICategory = typeof categoriesTable.$inferSelect;

export type INewEntry = typeof entriesTable.$inferInsert;
export type IEntry = typeof entriesTable.$inferSelect;
