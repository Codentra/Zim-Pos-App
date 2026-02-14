/**
 * Auth repository. Login by PIN; users table.
 */
import { getDb } from "../db";
import type { User } from "@/lib/domain/types";
import { generateUUID } from "@/lib/utils/uuid";

export async function createOwnerIfNone(name: string, pin: string): Promise<User> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM users WHERE deleted = 0"
  );
  if (row && row.count > 0) {
    const first = await db.getFirstAsync<{ id: string }>("SELECT id FROM users WHERE deleted = 0 LIMIT 1");
    const user = first ? await getUserById(first.id) : null;
    if (user) return user;
  }
  const id = generateUUID();
  const now = Date.now();
  await db.runAsync(
    `INSERT INTO users (id, name, role, pinHash, createdAt, updatedAt, syncStatus, convexId, deleted)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    name,
    "OWNER",
    pin,
    now,
    now,
    "PENDING",
    null,
    0
  );
  const created = await getUserById(id);
  if (!created) throw new Error("Failed to create owner");
  return created;
}

export async function hasAnyUser(): Promise<boolean> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM users WHERE deleted = 0"
  );
  return row ? row.count > 0 : false;
}

export async function loginByPin(pin: string): Promise<User | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{
    id: string;
    name: string;
    role: string;
    pinHash: string;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>(
    "SELECT id, name, role, pinHash, createdAt, updatedAt, syncStatus, convexId, deleted, lastError FROM users WHERE deleted = 0 AND pinHash = ?",
    pin
  );
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    role: row.role as User["role"],
    pinHash: row.pinHash,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    syncStatus: row.syncStatus as User["syncStatus"],
    convexId: row.convexId,
    deleted: row.deleted,
    lastError: row.lastError,
  };
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{
    id: string;
    name: string;
    role: string;
    pinHash: string;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>(
    "SELECT id, name, role, pinHash, createdAt, updatedAt, syncStatus, convexId, deleted, lastError FROM users WHERE id = ? AND deleted = 0",
    id
  );
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    role: row.role as User["role"],
    pinHash: row.pinHash,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    syncStatus: row.syncStatus as User["syncStatus"],
    convexId: row.convexId,
    deleted: row.deleted,
    lastError: row.lastError,
  };
}
