/**
 * Activity logs repository.
 */
import { getDb } from "../db";
import { generateUUID } from "@/lib/utils/uuid";
import type { ActivityLog, ActivityLogType } from "@/lib/domain/types";

export async function createLog(input: {
  type: ActivityLogType;
  action: string;
  details?: string;
  userId: string;
  managerUserId?: string | null;
}): Promise<ActivityLog> {
  const db = await getDb();
  const id = generateUUID();
  const now = Date.now();
  await db.runAsync(
    `INSERT INTO activity_logs (id, type, action, details, userId, managerUserId, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.type,
    input.action,
    input.details ?? "",
    input.userId,
    input.managerUserId ?? null,
    now
  );
  return {
    id,
    type: input.type,
    action: input.action,
    details: input.details ?? "",
    userId: input.userId,
    managerUserId: input.managerUserId ?? null,
    timestamp: now,
  };
}
