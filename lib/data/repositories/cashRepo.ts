/**
 * Cash shifts repository. Open/close shift, variance.
 */
import { getDb } from "../db";
import { generateUUID } from "@/lib/utils/uuid";
import type { CashShift } from "@/lib/domain/types";

export async function getActiveShift(): Promise<CashShift | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{
    id: string;
    openedAt: number;
    closedAt: number | null;
    openingFloatCents: number;
    expectedCashCents: number | null;
    actualCashCents: number | null;
    varianceCents: number | null;
    openedByUserId: string;
    closedByUserId: string | null;
    managerApprovalUserId: string | null;
    notes: string;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>("SELECT * FROM cash_shifts WHERE closedAt IS NULL AND deleted = 0 LIMIT 1");
  if (!row) return null;
  return rowToShift(row);
}

export async function openShift(input: {
  openingFloatCents: number;
  userId: string;
}): Promise<CashShift> {
  const db = await getDb();
  const id = generateUUID();
  const now = Date.now();
  await db.runAsync(
    `INSERT INTO cash_shifts (id, openedAt, closedAt, openingFloatCents, expectedCashCents, actualCashCents, varianceCents, openedByUserId, closedByUserId, managerApprovalUserId, notes, createdAt, updatedAt, syncStatus, convexId, deleted, lastError)
     VALUES (?, ?, NULL, ?, NULL, NULL, NULL, ?, NULL, NULL, '', ?, ?, 'PENDING', NULL, 0, NULL)`,
    id,
    now,
    input.openingFloatCents,
    input.userId,
    now,
    now
  );
  const created = await db.getFirstAsync<{
    id: string;
    openedAt: number;
    closedAt: number | null;
    openingFloatCents: number;
    expectedCashCents: number | null;
    actualCashCents: number | null;
    varianceCents: number | null;
    openedByUserId: string;
    closedByUserId: string | null;
    managerApprovalUserId: string | null;
    notes: string;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>("SELECT * FROM cash_shifts WHERE id = ?", id);
  if (!created) throw new Error("Failed to create shift");
  return rowToShift(created);
}

export async function getCashSalesTotalSince(sinceTimestamp: number): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ total: number }>(
    "SELECT COALESCE(SUM(totalCents), 0) as total FROM transactions WHERE timestamp >= ? AND deleted = 0 AND isRefund = 0 AND paymentMethod = 'CASH'",
    sinceTimestamp
  );
  return row?.total ?? 0;
}

export async function closeShift(input: {
  shiftId: string;
  actualCashCents: number;
  closedByUserId: string;
  notes?: string;
}): Promise<CashShift> {
  const db = await getDb();
  const shift = await getActiveShift();
  if (!shift || shift.id !== input.shiftId) throw new Error("Shift not found or already closed");
  const cashSales = await getCashSalesTotalSince(shift.openedAt);
  const expectedCashCents = shift.openingFloatCents + cashSales;
  const varianceCents = input.actualCashCents - expectedCashCents;
  const now = Date.now();
  await db.runAsync(
    `UPDATE cash_shifts SET closedAt = ?, expectedCashCents = ?, actualCashCents = ?, varianceCents = ?, closedByUserId = ?, notes = ?, updatedAt = ?, syncStatus = 'PENDING' WHERE id = ?`,
    now,
    expectedCashCents,
    input.actualCashCents,
    varianceCents,
    input.closedByUserId,
    input.notes ?? "",
    now,
    input.shiftId
  );
  const updated = await db.getFirstAsync<{
    id: string;
    openedAt: number;
    closedAt: number | null;
    openingFloatCents: number;
    expectedCashCents: number | null;
    actualCashCents: number | null;
    varianceCents: number | null;
    openedByUserId: string;
    closedByUserId: string | null;
    managerApprovalUserId: string | null;
    notes: string;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>("SELECT * FROM cash_shifts WHERE id = ?", input.shiftId);
  if (!updated) throw new Error("Failed to update shift");
  return rowToShift(updated);
}

function rowToShift(row: {
  id: string;
  openedAt: number;
  closedAt: number | null;
  openingFloatCents: number;
  expectedCashCents: number | null;
  actualCashCents: number | null;
  varianceCents: number | null;
  openedByUserId: string;
  closedByUserId: string | null;
  managerApprovalUserId: string | null;
  notes: string;
  createdAt: number;
  updatedAt: number;
  syncStatus: string;
  convexId: string | null;
  deleted: number;
  lastError: string | null;
}): CashShift {
  return {
    id: row.id,
    openedAt: row.openedAt,
    closedAt: row.closedAt,
    openingFloatCents: row.openingFloatCents,
    expectedCashCents: row.expectedCashCents,
    actualCashCents: row.actualCashCents,
    varianceCents: row.varianceCents,
    openedByUserId: row.openedByUserId,
    closedByUserId: row.closedByUserId,
    managerApprovalUserId: row.managerApprovalUserId,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    syncStatus: row.syncStatus as CashShift["syncStatus"],
    convexId: row.convexId,
    deleted: row.deleted,
    lastError: row.lastError,
  };
}
