/**
 * Auth repository. Login by PIN; users table. PINs are hashed with salt (never stored plain).
 */
import { getDb } from "../db";
import type { User } from "@/lib/domain/types";
import { generateUUID } from "@/lib/utils/uuid";
import { generateSalt, hashPin, verifyPin } from "@/lib/auth/pinHash";

const PIN_MASK = "***";

export async function createOwner(name: string, pin: string): Promise<User> {
  const db = await getDb();
  const id = generateUUID();
  const now = Date.now();
  const salt = await generateSalt();
  const hashedPin = await hashPin(pin, salt);
  await db.runAsync(
    `INSERT INTO users (id, name, role, pinHash, pinSalt, email, phone, location, createdAt, updatedAt, syncStatus, convexId, deleted)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    name,
    "OWNER",
    hashedPin,
    salt,
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
  const salt = await generateSalt();
  const hashedPin = await hashPin(newPin, salt);
  await db.runAsync(
    "UPDATE users SET pinHash = ?, pinSalt = ?, updatedAt = ? WHERE id = ?",
    hashedPin,
    salt,
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

/** Legacy: plain PIN stored (no pinSalt). Migrate to hashed on first successful login. */
async function migrateToHashed(db: Awaited<ReturnType<typeof getDb>>, userId: string, plainPin: string): Promise<void> {
  const salt = await generateSalt();
  const hashedPin = await hashPin(plainPin, salt);
  const now = Date.now();
  await db.runAsync(
    "UPDATE users SET pinHash = ?, pinSalt = ?, updatedAt = ? WHERE id = ?",
    hashedPin,
    salt,
    now,
    userId
  );
}

export async function loginByPin(pin: string): Promise<User | null> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: string;
    name: string;
    role: string;
    pinHash: string;
    pinSalt: string | null;
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
    "SELECT id, name, role, pinHash, pinSalt, COALESCE(email,'') as email, COALESCE(phone,'') as phone, COALESCE(location,'') as location, createdAt, updatedAt, syncStatus, convexId, deleted, lastError FROM users WHERE deleted = 0"
  );

  for (const row of rows) {
    if (row.pinSalt == null || row.pinSalt === "") {
      if (row.pinHash === pin) {
        await migrateToHashed(db, row.id, pin);
        return mapRowToUser(row);
      }
      continue;
    }
    const ok = await verifyPin(pin, row.pinSalt, row.pinHash);
    if (ok) return mapRowToUser(row);
  }
  return null;
}

function mapRowToUser(row: {
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
}): User {
  return {
    id: row.id,
    name: row.name,
    role: row.role as User["role"],
    pinHash: PIN_MASK,
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
  return mapRowToUser(row);
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
