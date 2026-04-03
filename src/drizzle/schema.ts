import { pgEnum, pgTable, serial, integer, text, numeric, timestamp, varchar } from 'drizzle-orm/pg-core';

export const userRole = pgEnum('user_role', ['admin', 'viewer', 'analyst']);
export const userStatus = pgEnum('user_status', ['active', 'inactive']);
export const incomeType = pgEnum('income_type', ['income', 'expense']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  role: userRole('role').notNull().default('viewer'),
  status: userStatus('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const userPassword = pgTable('user_password', {
  id: serial('id').primaryKey(),
  password: varchar('password', { length: 70 }).notNull(),
  userId: integer('user_id').notNull().references(() => users.id),
});


export const records = pgTable('records', {
  id: serial('id').primaryKey(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  type: incomeType('type').notNull(),
  date: timestamp('date', { withTimezone: true }).notNull().defaultNow(),
  description: text('description'),
  category: text('category').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
