/**
 * Sync status and (when Convex URL configured) upload PENDING rows.
 * Idempotent upserts by id. Run: npx convex dev and set EXPO_PUBLIC_CONVEX_URL to enable.
 */
import { getDb } from "@/lib/data/db";

export type SyncStatus = "offline" | "pending" | "syncing" | "ok" | "error";

export async function getPendingCount(): Promise<number> {
  const db = await getDb();
  const products = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM products WHERE syncStatus = 'PENDING' AND deleted = 0"
  );
  const transactions = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM transactions WHERE syncStatus = 'PENDING' AND deleted = 0"
  );
  return (products?.count ?? 0) + (transactions?.count ?? 0);
}

export function isConvexConfigured(): boolean {
  return typeof process !== "undefined" && !!process.env.EXPO_PUBLIC_CONVEX_URL;
}
