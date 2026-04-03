// using zod for runtime validation of all inputs and also convert the zod schema to types so we use that for compile time validation
import { z, type ZodIssue } from 'zod';

export function formatZodIssues(issues: ZodIssue[]): string {
  return issues.map(issue => issue.message).join(', ');
}

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
export const createUserSchema = userSchema.pick({ username: true, role: true, status: true }).extend({
  password: z.string().min(6),
});
export const updateUserSchema = createUserSchema.omit({ password: true }).partial();
export const signupSchema = createUserSchema.omit({ status: true, role: true });

// record related validations
export const financeRecordSchema = z.object({
  amount: z.coerce.number().positive('amount must be a positive number'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1),
  description: z.string().nullish(),
  date: z.coerce.date(),
});

export const updateRecordSchema = financeRecordSchema.partial();


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

export const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(6),
});

// shared validations
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const payloadSchema = userSchema.pick({ id: true, username: true, role: true });

export const filterInputSchema = z.object({
  pagination: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  trend: z.string().regex(/^\d+[dwmy]$/).default('1w'),
});

// types
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UserInsert = Omit<CreateUser, 'password'>; // user fields only, password passed separately
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type returnUser = Pick<User, 'id' | 'username' | 'role' | 'status'>;

export type Payload = z.infer<typeof payloadSchema>;

export type FinanceRecord = z.infer<typeof financeRecordSchema>;
export type UpdateRecord = z.infer<typeof updateRecordSchema>;

export type dashboard = { totalIncome: number; totalExpense: number; netBalance: number };
export type CategoryTotal = { category: string; income: number; expense: number };
export type Trend = { period: string; income: number; expense: number };
export type FinanceRecordReturn = FinanceRecord & { id: number };
export type filterInput = z.infer<typeof filterInputSchema>;
export type RecordFilter = z.infer<typeof recordFilterSchema>;
export type UserFilter = z.infer<typeof userFilterSchema>;
