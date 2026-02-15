/**
 * Auth repository. Login by PIN; users table.
 */
import { getDb } from "../db";
import type { User } from "@/lib/domain/types";
import { generateUUID } from "@/lib/utils/uuid";

export async function createOwner(name: string, pin: string): Promise<User> {
  const db = await getDb();
  const id = generateUUID();
  const now = Date.now();
  await db.runAsync(
    `INSERT INTO users (id, name, role, pinHash, email, phone, location, createdAt, updatedAt, syncStatus, convexId, deleted)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    name,
    "OWNER",
    pin,
    "",
    "",
    "",
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

export async function updateUserPin(userId: string, newPin: string): Promise<void> {
  const db = await getDb();
  const now = Date.now();
  await db.runAsync(
    "UPDATE users SET pinHash = ?, updatedAt = ? WHERE id = ?",
    newPin,
    now,
    userId
  );
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
    email: string | null;
    phone: string | null;
    location: string | null;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>(
    "SELECT id, name, role, pinHash, COALESCE(email,'') as email, COALESCE(phone,'') as phone, COALESCE(location,'') as location, createdAt, updatedAt, syncStatus, convexId, deleted, lastError FROM users WHERE deleted = 0 AND pinHash = ?",
    pin
  );
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    role: row.role as User["role"],
    pinHash: row.pinHash,
    email: row.email ?? "",
    phone: row.phone ?? "",
    location: row.location ?? "",
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
    email: string | null;
    phone: string | null;
    location: string | null;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>(
    "SELECT id, name, role, pinHash, COALESCE(email,'') as email, COALESCE(phone,'') as phone, COALESCE(location,'') as location, createdAt, updatedAt, syncStatus, convexId, deleted, lastError FROM users WHERE id = ? AND deleted = 0",
    id
  );
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    role: row.role as User["role"],
    pinHash: row.pinHash,
    email: row.email ?? "",
    phone: row.phone ?? "",
    location: row.location ?? "",
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    syncStatus: row.syncStatus as User["syncStatus"],
    convexId: row.convexId,
    deleted: row.deleted,
    lastError: row.lastError,
  };
}

export async function updateUserProfile(
  userId: string,
  input: { name?: string; email?: string; phone?: string; location?: string; role?: User["role"] }
): Promise<void> {
  const db = await getDb();
  const existing = await getUserById(userId);
  if (!existing) throw new Error("User not found");
  const now = Date.now();
  await db.runAsync(
    "UPDATE users SET name = ?, email = ?, phone = ?, location = ?, role = ?, updatedAt = ?, syncStatus = 'PENDING' WHERE id = ?",
    input.name ?? existing.name,
    input.email ?? existing.email,
    input.phone ?? existing.phone,
    input.location ?? existing.location,
    input.role ?? existing.role,
    now,
    userId
  );
}
