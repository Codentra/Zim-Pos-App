/**
 * Business repository. CRUD for businesses.
 */
import { getDb } from "../db";
import type { Business } from "@/lib/domain/types";
import { generateUUID } from "@/lib/utils/uuid";

export async function getBusinessById(id: string): Promise<Business | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{
    id: string;
    name: string;
    ownerName: string;
    phone: string;
    email: string;
    country: string;
    city: string;
    address?: string;
    website?: string;
    taxNumber?: string;
    baseCurrency?: string;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>(
    "SELECT id, name, ownerName, phone, email, country, city, address, website, taxNumber, baseCurrency, createdAt, updatedAt, syncStatus, convexId, deleted, lastError FROM businesses WHERE id = ? AND deleted = 0",
    id
  );
  if (!row) return null;
  return row as Business;
}

export async function createBusiness(data: {
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  country: string;
  city: string;
}): Promise<Business> {
  const db = await getDb();
  const id = generateUUID();
  const now = Date.now();
  await db.runAsync(
    `INSERT INTO businesses (id, name, ownerName, phone, email, country, city, createdAt, updatedAt, syncStatus, convexId, deleted)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    data.name,
    data.ownerName,
    data.phone,
    data.email,
    data.country,
    data.city,
    now,
    now,
    "PENDING",
    null,
    0
  );
  const created = await getBusinessById(id);
  if (!created) throw new Error("Failed to create business");
  return created;
}

export async function hasAnyBusiness(): Promise<boolean> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM businesses WHERE deleted = 0"
  );
  return row ? row.count > 0 : false;
}
