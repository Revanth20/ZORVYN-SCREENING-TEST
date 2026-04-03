// using zod for runtime validation of all inputs and also convert the zod schema to types so we use that for compile time validation
import { z } from 'zod';

// user related validations
export const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(1),
  role: z.enum(['admin', 'viewer', 'analyst']),
  status: z.enum(['active', 'inactive']).default('active'),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
});

export const createUserSchema = userSchema.pick({ username: true, role: true, status: true });

export const updateUserSchema = createUserSchema.partial();

// record related validations

export const financeRecordSchema = z.object({
  amount: z.coerce.number().positive(),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1),
  description: z.string().nullish(),
  date: z.date(),
});




// dashboard related validations
export const dashboardSchema = z.object({
  totalIncome: z.number().positive(),
  totalExpense: z.number().positive(),
  netBalance: z.number(),
});

export const categoryTotalSchema = z.object({
  category: z.string(),
  income: z.number(),
  expense: z.number(),
});

export const trendSchema = z.object({
  period: z.string(),
  income: z.number(),
  expense: z.number(),
});

export const financeRecordReturnSchema = financeRecordSchema.extend({
  id: z.number().int().positive(),
});

export const recordFilterSchema = z.object({
  search: z.string().optional(),
  pagination: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  type: z.enum(['income', 'expense']).optional(),
});

export const userFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  role: z.enum(['admin', 'viewer', 'analyst']).optional(),
  pagination: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});

// shared validations
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const payloadSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(1),
  role: z.enum(['admin', 'viewer', 'analyst']),
});

export const filterInputSchema = z.object({
  pagination: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  trend: z.string().regex(/^\d+[dwmy]$/).default('1w'),
});

// converting to types so we can use for compile time type validation
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type returnUser = Pick<User, 'id' | 'username' | 'role' | 'status'>;

export type Payload = z.infer<typeof payloadSchema>;

export type FinanceRecord = z.infer<typeof financeRecordSchema>;

export type dashboard = z.infer<typeof dashboardSchema>;
export type CategoryTotal = z.infer<typeof categoryTotalSchema>;
export type Trend = z.infer<typeof trendSchema>;
export type FinanceRecordReturn = z.infer<typeof financeRecordReturnSchema>;
export type filterInput = z.infer<typeof filterInputSchema>;
export type RecordFilter = z.infer<typeof recordFilterSchema>;
export type UserFilter = z.infer<typeof userFilterSchema>;