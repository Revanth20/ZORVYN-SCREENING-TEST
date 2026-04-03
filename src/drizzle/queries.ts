import db from './drizzle.js';
import { users, records } from './schema.js';
import * as zod from '../utilities/zod.js';
import { eq, desc, and, isNull, sql, ilike, or } from 'drizzle-orm';


//  user related queries
export async function insertUser(data: zod.CreateUser): Promise<zod.returnUser> {
  const [result] = await db.insert(users)
    .values({ username: data.username!, role: data.role, status: data.status })
    .returning({ id: users.id, username: users.username, role: users.role, status: users.status });
  return result;
}

export async function updateUser(id: number, data: Partial<zod.UpdateUser>): Promise<zod.returnUser> {
  const { username, role, status } = data;
  const [result] = await db.update(users)
    .set({ username, role, status })
    .where(eq(users.id, id))
    .returning({ id: users.id, username: users.username, role: users.role, status: users.status });
  if (!result) throw new Error('User not found');
  return result;
}

export async function deleteUser(id: number): Promise<void> {
  const [result] = await db.update(users)
    .set({ deletedAt: new Date() })
    .where(and(eq(users.id, id), isNull(users.deletedAt)))
    .returning({ id: users.id });
  if (!result) throw new Error('User not found');
}

export async function getUser(id: number): Promise<zod.returnUser | null> {
  const [result] = await db.select({ 
    id: users.id, username: users.username, role: users.role,
    status: users.status 
  }).from(users)
    .where(and(eq(users.id, id), isNull(users.deletedAt)));
  return result;
}

export async function getUsers(filters: zod.UserFilter): Promise<zod.returnUser[]> {
  const { search, status, role, pagination, limit } = filters;
  const offset = (pagination - 1) * limit;
  const results = await db.select({ id: users.id, username: users.username,
    role: users.role, status: users.status
  }).from(users)
    .where(and(
      isNull(users.deletedAt),
      search ? ilike(users.username, `%${search}%`) : undefined,
      status ? eq(users.status, status) : undefined,
      role ? eq(users.role, role) : undefined,
    ))
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);
  return results;
}


//  record related queries
export async function insertRecord(data: zod.FinanceRecord): Promise<zod.FinanceRecordReturn> {
  const [result] = await db.insert(records)
    .values({
      amount: data.amount.toString(),
      type: data.type,
      category: data.category,
      description: data.description,
      date: data.date
    })
    .returning({ 
      id: records.id, amount: records.amount, type: records.type, 
      category: records.category, description: records.description, 
      date: records.date 
    });
    if (!result) throw new Error('Record not found');
  return { ...result, amount: Number(result.amount) };
}

export async function updateRecord(id: number, data: zod.FinanceRecord): Promise<zod.FinanceRecordReturn> {
  const [result] = await db.update(records)
    .set({ ...data, amount: data.amount.toString() })
    .where(eq(records.id, id))
    .returning({ id: records.id, amount: records.amount, type: records.type, 
    category: records.category, description: records.description, 
    date: records.date 
  });
  if (!result) throw new Error('Record not found');
  return { ...result, amount: Number(result.amount) };
}

export async function deleteRecord(id: number): Promise<void> {
  const [result] = await db.update(records)
    .set({ deletedAt: new Date() })
    .where(and(eq(records.id, id), isNull(records.deletedAt)))
    .returning({ id: records.id });
  if (!result) throw new Error('Record not found');
}

export async function getRecord(id: number): Promise<zod.FinanceRecordReturn | null> {
  const [result] = await db.select({ id: records.id, amount: records.amount, 
    type: records.type, category: records.category, 
    description: records.description, date: records.date 
  })
    .from(records)
    .where(and(eq(records.id, id), isNull(records.deletedAt)));
    if (!result) return null;
  return { ...result, amount: Number(result.amount) };
}

export async function getRecords(filters: zod.RecordFilter): Promise<zod.FinanceRecordReturn[]> {
  const { search, pagination, limit, type } = filters;
  const offset = (pagination - 1) * limit;
  const result = await db.select({
    id: records.id, amount: records.amount,
    type: records.type, category: records.category,
    description: records.description, date: records.date
  })
    .from(records)
    .where(and(
      isNull(records.deletedAt),
      search ? or(ilike(records.category, `%${search}%`), ilike(records.description, `%${search}%`)) : undefined,
      type ? eq(records.type, type) : undefined,
    ))
    .orderBy(desc(records.createdAt))
    .limit(limit)
    .offset(offset);
  return result.map(r => ({ ...r, amount: Number(r.amount) }));
}

// dashboard related queries
export async function getDashboardDetails(): Promise<zod.dashboard> {
  const [row] = await db.select({
    totalIncome: sql<string>`COALESCE(SUM(${records.amount}) FILTER (WHERE ${records.type} = 'income'), 0)`,
    totalExpense: sql<string>`COALESCE(SUM(${records.amount}) FILTER (WHERE ${records.type} = 'expense'), 0)`,
  }).from(records).where(isNull(records.deletedAt));
  const totalIncome = Number(row.totalIncome);
  const totalExpense = Number(row.totalExpense);
  return { totalIncome, totalExpense, netBalance: totalIncome - totalExpense };
}

export async function getCategoryWiseTotals(): Promise<zod.CategoryTotal[]> {
  const result = await db.select({
    category: records.category,
    income: sql<string>`COALESCE(SUM(${records.amount}) FILTER (WHERE ${records.type} = 'income'), 0)`,
    expense: sql<string>`COALESCE(SUM(${records.amount}) FILTER (WHERE ${records.type} = 'expense'), 0)`,
  }).from(records).where(isNull(records.deletedAt)).groupBy(records.category).orderBy(records.category);
  return result.map(r => ({
    category: r.category,
    income: Number(r.income),
    expense: Number(r.expense),
  }));
}

export async function getRecentActivity(filters: Pick<zod.filterInput, 'pagination' | 'limit'>): Promise<zod.FinanceRecordReturn[]> {
  const { pagination, limit } = filters;
  const offset = (pagination - 1) * limit;
  const result = await db.select({
    id: records.id, amount: records.amount, type: records.type,
    category: records.category, description: records.description, date: records.date,
  })
    .from(records)
    .where(isNull(records.deletedAt))
    .orderBy(desc(records.createdAt))
    .limit(limit)
    .offset(offset);
  return result.map(r => ({ ...r, amount: Number(r.amount) }));
}

function parseTrend(trend: string): { interval: string; groupBy: string } {
  const value = trend.slice(0, -1);
  const unit = trend.slice(-1);
  const intervalMap: Record<string, string> = { d: 'days', w: 'weeks', m: 'months', y: 'years' };
  const groupMap: Record<string, string> = { d: 'day', w: 'week', m: 'month', y: 'year' };
  return { interval: `${value} ${intervalMap[unit]}`, groupBy: groupMap[unit] };
}

export async function getTrends(filters: Pick<zod.filterInput, 'trend'>): Promise<zod.Trend[]> {
  const { interval, groupBy } = parseTrend(filters.trend);
  const result = await db.execute(sql`
    SELECT
      DATE_TRUNC(${groupBy}, date) AS period,
      COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0) AS income,
      COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS expense
    FROM records
    WHERE deleted_at IS NULL
      AND date >= NOW() - INTERVAL ${interval}
    GROUP BY DATE_TRUNC(${groupBy}, date)
    ORDER BY period ASC
  `);
  return (result.rows as { period: string; income: string; expense: string }[]).map(r => ({
    period: r.period,
    income: Number(r.income),
    expense: Number(r.expense),
  }));
}