/**
 * Customers repository. CRUD, list, search.
 */
import { getDb } from "../db";
import type { Customer } from "@/lib/domain/types";
import { generateUUID } from "@/lib/utils/uuid";

const rowToCustomer = (row: {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  creditLimitCents: number;
  creditBalanceCents: number;
  isVip: number;
  notes: string;
  createdAt: number;
  updatedAt: number;
  syncStatus: string;
  convexId: string | null;
  deleted: number;
  lastError: string | null;
}): Customer => ({
  ...row,
  syncStatus: row.syncStatus as Customer["syncStatus"],
});

export async function listCustomers(): Promise<Customer[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: string;
    name: string;
    phone: string;
    email: string;
    location: string;
    creditLimitCents: number;
    creditBalanceCents: number;
    isVip: number;
    notes: string;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>("SELECT * FROM customers WHERE deleted = 0 ORDER BY name");
  return rows.map(rowToCustomer);
}

export async function listCustomersWithCredit(): Promise<Customer[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: string;
    name: string;
    phone: string;
    email: string;
    location: string;
    creditLimitCents: number;
    creditBalanceCents: number;
    isVip: number;
    notes: string;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>("SELECT * FROM customers WHERE deleted = 0 AND creditBalanceCents > 0 ORDER BY creditBalanceCents DESC");
  return rows.map(rowToCustomer);
}

export async function listVipCustomers(): Promise<Customer[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: string;
    name: string;
    phone: string;
    email: string;
    location: string;
    creditLimitCents: number;
    creditBalanceCents: number;
    isVip: number;
    notes: string;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>("SELECT * FROM customers WHERE deleted = 0 AND isVip = 1 ORDER BY name");
  return rows.map(rowToCustomer);
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{
    id: string;
    name: string;
    phone: string;
    email: string;
    location: string;
    creditLimitCents: number;
    creditBalanceCents: number;
    isVip: number;
    notes: string;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>("SELECT * FROM customers WHERE id = ? AND deleted = 0", id);
  return row ? rowToCustomer(row) : null;
}

export async function searchCustomers(query: string): Promise<Customer[]> {
  if (!query.trim()) return listCustomers();
  const db = await getDb();
  const q = `%${query.trim()}%`;
  const rows = await db.getAllAsync<{
    id: string;
    name: string;
    phone: string;
    email: string;
    location: string;
    creditLimitCents: number;
    creditBalanceCents: number;
    isVip: number;
    notes: string;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>(
    "SELECT * FROM customers WHERE deleted = 0 AND (name LIKE ? OR phone LIKE ? OR email LIKE ?) ORDER BY name",
    q,
    q,
    q
  );
  return rows.map(rowToCustomer);
}

export async function createCustomer(input: {
  name: string;
  phone?: string;
  email?: string;
  location?: string;
  creditLimitCents?: number;
  isVip?: boolean;
  notes?: string;
}): Promise<Customer> {
  const db = await getDb();
  const id = generateUUID();
  const now = Date.now();
  await db.runAsync(
    `INSERT INTO customers (id, name, phone, email, location, creditLimitCents, creditBalanceCents, isVip, notes, createdAt, updatedAt, syncStatus, convexId, deleted, lastError)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', NULL, 0, NULL)`,
    id,
    input.name,
    input.phone ?? "",
    input.email ?? "",
    input.location ?? "",
    input.creditLimitCents ?? 0,
    0,
    input.isVip ? 1 : 0,
    input.notes ?? "",
    now,
    now
  );
  const created = await getCustomerById(id);
  if (!created) throw new Error("Failed to create customer");
  return created;
}

export async function updateCustomer(
  id: string,
  input: Partial<{
    name: string;
    phone: string;
    email: string;
    location: string;
    creditLimitCents: number;
    creditBalanceCents: number;
    isVip: boolean;
    notes: string;
  }>
): Promise<Customer | null> {
  const db = await getDb();
  const existing = await getCustomerById(id);
  if (!existing) return null;
  const now = Date.now();
  await db.runAsync(
    `UPDATE customers SET
      name = ?, phone = ?, email = ?, location = ?,
      creditLimitCents = ?, creditBalanceCents = ?, isVip = ?, notes = ?,
      updatedAt = ?, syncStatus = 'PENDING'
     WHERE id = ?`,
    input.name ?? existing.name,
    input.phone ?? existing.phone,
    input.email ?? existing.email,
    input.location ?? existing.location,
    input.creditLimitCents ?? existing.creditLimitCents,
    input.creditBalanceCents ?? existing.creditBalanceCents,
    input.isVip !== undefined ? (input.isVip ? 1 : 0) : existing.isVip,
    input.notes ?? existing.notes,
    now,
    id
  );
  return getCustomerById(id);
}
