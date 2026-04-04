import { pgEnum, pgTable, serial, text, numeric, timestamp } from 'drizzle-orm/pg-core';

export const userRole = pgEnum('user_role', ['admin', 'viewer', 'analyst']);
export const userStatus = pgEnum('user_status', ['active', 'inactive']);
export const incomeType = pgEnum('income_type', ['income', 'expense']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  role: userRole('role').notNull().default('viewer'),
  status: userStatus('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const records = pgTable('records', {
  id: serial('id').primaryKey(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  type: incomeType('type').notNull(),
  date: timestamp('date', { withTimezone: true }).notNull().defaultNow(),
  description: text('description'),
  category: text('category').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
