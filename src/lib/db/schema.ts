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
} from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  ...timestamps,
});

export const categoriesTable = pgTable(
  'categories',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => usersTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    name: varchar('name', { length: 255 }).notNull(),
    ...timestamps,
  },
  (table) => [unique().on(table.userId, table.name), index().on(table.userId)]
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
    isRecurring: boolean('is_recurring').default(false).notNull(),
    date: date('date', { mode: 'date' }).notNull(), // Usar também como início da recorrência
    recurringEndDate: date('recurring_end_date', { mode: 'date' }),
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
