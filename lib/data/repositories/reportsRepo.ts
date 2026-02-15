/**
 * Local reporting queries.
 */
import { getDb } from "../db";
import { getActiveShift, getCashSalesTotalSince } from "./cashRepo";

export interface DashboardStats {
  todaySalesCents: number;
  todayTransactions: number;
  cashInDrawerCents: number;
  productsSoldToday: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = await getDb();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const since = startOfToday.getTime();

  const [salesRow, productsRow] = await Promise.all([
    db.getFirstAsync<{ cnt: number; total: number }>(
      `SELECT COUNT(*) as cnt, COALESCE(SUM(totalCents), 0) as total
       FROM transactions WHERE timestamp >= ? AND deleted = 0 AND isRefund = 0`,
      since
    ),
    db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(ti.quantity), 0) as total FROM transaction_items ti
       JOIN transactions t ON ti.transactionId = t.id
       WHERE t.timestamp >= ? AND t.deleted = 0 AND t.isRefund = 0`,
      since
    ),
  ]);

  let cashInDrawerCents = 0;
  const shift = await getActiveShift();
  if (shift) {
    const cashSales = await getCashSalesTotalSince(shift.openedAt);
    cashInDrawerCents = shift.openingFloatCents + cashSales;
  }

  return {
    todaySalesCents: salesRow?.total ?? 0,
    todayTransactions: salesRow?.cnt ?? 0,
    cashInDrawerCents,
    productsSoldToday: productsRow?.total ?? 0,
  };
}

export interface DailySalesRow {
  date: string;
  transactionCount: number;
  totalCents: number;
}

export async function getSalesByDay(days: number): Promise<DailySalesRow[]> {
  const db = await getDb();
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const rows = await db.getAllAsync<{ date: string; cnt: number; total: number }>(
    `SELECT date(timestamp / 1000, 'unixepoch', 'localtime') as date, COUNT(*) as cnt, COALESCE(SUM(totalCents), 0) as total
     FROM transactions WHERE timestamp >= ? AND deleted = 0 AND isRefund = 0 GROUP BY date ORDER BY date DESC LIMIT 90`,
    since
  );
  return rows.map((r) => ({
    date: r.date,
    transactionCount: r.cnt,
    totalCents: r.total,
  }));
}

export interface PaymentMethodRow {
  paymentMethod: string;
  totalCents: number;
  count: number;
}

export async function getPaymentMethodBreakdown(days: number): Promise<PaymentMethodRow[]> {
  const db = await getDb();
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const rows = await db.getAllAsync<{ paymentMethod: string; total: number; cnt: number }>(
    `SELECT paymentMethod, COALESCE(SUM(totalCents), 0) as total, COUNT(*) as cnt
     FROM transactions WHERE timestamp >= ? AND deleted = 0 AND isRefund = 0 GROUP BY paymentMethod`,
    since
  );
  return rows.map((r) => ({
    paymentMethod: r.paymentMethod,
    totalCents: r.total,
    count: r.cnt,
  }));
}

export interface TopProductRow {
  productId: string;
  nameSnapshot: string;
  quantity: number;
  totalCents: number;
}

export async function getTopProducts(days: number, limit: number): Promise<TopProductRow[]> {
  const db = await getDb();
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const rows = await db.getAllAsync<{
    productId: string;
    nameSnapshot: string;
    quantity: number;
    totalCents: number;
  }>(
    `SELECT ti.productId, ti.nameSnapshot, SUM(ti.quantity) as quantity, SUM(ti.lineTotalCents) as totalCents
     FROM transaction_items ti JOIN transactions t ON ti.transactionId = t.id
     WHERE t.timestamp >= ? AND t.deleted = 0 AND t.isRefund = 0
     GROUP BY ti.productId ORDER BY quantity DESC LIMIT ?`,
    since,
    limit
  );
  return rows.map((r) => ({
    productId: r.productId,
    nameSnapshot: r.nameSnapshot,
    quantity: r.quantity,
    totalCents: r.totalCents,
  }));
}

export async function getLowStockProducts(): Promise<{ id: string; name: string; stock: number; lowStockThreshold: number }[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ id: string; name: string; stock: number; lowStockThreshold: number }>(
    "SELECT id, name, stock, lowStockThreshold FROM products WHERE deleted = 0 AND stock <= lowStockThreshold ORDER BY stock ASC"
  );
  return rows;
}
