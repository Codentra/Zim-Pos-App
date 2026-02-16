/**
 * Sync status and (when Convex URL configured) upload PENDING rows.
 * Idempotent upserts by id. Run: npx convex dev and set EXPO_PUBLIC_CONVEX_URL to enable.
 */
import { getDb } from "@/lib/data/db";

export type SyncStatus = "offline" | "pending" | "syncing" | "ok" | "error";

export async function getPendingCount(): Promise<number> {
  const db = await getDb();
  const queries: Promise<{ count: number } | null>[] = [
    db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM businesses WHERE syncStatus = 'PENDING' AND deleted = 0"),
    db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM users WHERE syncStatus = 'PENDING' AND deleted = 0"),
    db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM products WHERE syncStatus = 'PENDING' AND deleted = 0"),
    db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM customers WHERE syncStatus = 'PENDING' AND deleted = 0"),
    db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM subscriptions WHERE syncStatus = 'PENDING' AND deleted = 0"),
    db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM transactions WHERE syncStatus = 'PENDING' AND deleted = 0"),
    db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM cash_shifts WHERE syncStatus = 'PENDING' AND deleted = 0"),
    db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM stock_receipts WHERE syncStatus = 'PENDING' AND deleted = 0"),
    db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM activity_logs WHERE syncStatus = 'PENDING'").catch(() => null),
  ];
  const results = await Promise.all(queries);
  return results.reduce((sum, r) => sum + (r?.count ?? 0), 0);
}

export function isConvexConfigured(): boolean {
  return typeof process !== "undefined" && !!process.env.EXPO_PUBLIC_CONVEX_URL;
}
