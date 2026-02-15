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

export interface LogWithUser extends ActivityLog {
  userName?: string;
}

export async function listLogsByType(type: string | null, limit: number = 100): Promise<LogWithUser[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: string;
    type: string;
    action: string;
    details: string;
    userId: string;
    managerUserId: string | null;
    timestamp: number;
    userName?: string;
  }>(
    type
      ? `SELECT l.id, l.type, l.action, l.details, l.userId, l.managerUserId, l.timestamp, u.name as userName
         FROM activity_logs l LEFT JOIN users u ON l.userId = u.id
         WHERE l.type = ? ORDER BY l.timestamp DESC LIMIT ?`
      : `SELECT l.id, l.type, l.action, l.details, l.userId, l.managerUserId, l.timestamp, u.name as userName
         FROM activity_logs l LEFT JOIN users u ON l.userId = u.id
         ORDER BY l.timestamp DESC LIMIT ?`,
    ...(type ? [type, limit] : [limit])
  );
  return rows.map((r) => ({
    id: r.id,
    type: r.type as ActivityLog["type"],
    action: r.action,
    details: r.details,
    userId: r.userId,
    managerUserId: r.managerUserId,
    timestamp: r.timestamp,
    userName: r.userName ?? undefined,
  }));
}

export async function listLogs(limit: number = 100): Promise<LogWithUser[]> {
  return listLogsByType(null, limit);
}

export interface LogStats {
  total: number;
  activeUsers: number;
  approvals: number;
}

export async function getLogStats(): Promise<LogStats> {
  const db = await getDb();
  const total = (await db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM activity_logs"))?.count ?? 0;
  const activeUsers = (await db.getFirstAsync<{ count: number }>("SELECT COUNT(DISTINCT userId) as count FROM activity_logs"))?.count ?? 0;
  const approvals = (await db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM activity_logs WHERE type = 'APPROVAL'"))?.count ?? 0;
  return { total, activeUsers, approvals };
}
