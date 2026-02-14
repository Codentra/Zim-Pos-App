/**
 * Products repository. CRUD, list, search.
 */
import { getDb } from "../db";
import type { Product } from "@/lib/domain/types";
import { generateUUID } from "@/lib/utils/uuid";

const rowToProduct = (row: {
  id: string;
  name: string;
  category: string;
  sku: string;
  barcode: string;
  priceCents: number;
  costCents: number;
  stock: number;
  lowStockThreshold: number;
  description: string;
  createdAt: number;
  updatedAt: number;
  syncStatus: string;
  convexId: string | null;
  deleted: number;
  lastError: string | null;
}): Product => ({
  id: row.id,
  name: row.name,
  category: row.category,
  sku: row.sku,
  barcode: row.barcode,
  priceCents: row.priceCents,
  costCents: row.costCents,
  stock: row.stock,
  lowStockThreshold: row.lowStockThreshold,
  description: row.description,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  syncStatus: row.syncStatus as Product["syncStatus"],
  convexId: row.convexId,
  deleted: row.deleted,
  lastError: row.lastError,
});

export async function listProducts(): Promise<Product[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: string;
    name: string;
    category: string;
    sku: string;
    barcode: string;
    priceCents: number;
    costCents: number;
    stock: number;
    lowStockThreshold: number;
    description: string;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>("SELECT * FROM products WHERE deleted = 0 ORDER BY name");
  return rows.map(rowToProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{
    id: string;
    name: string;
    category: string;
    sku: string;
    barcode: string;
    priceCents: number;
    costCents: number;
    stock: number;
    lowStockThreshold: number;
    description: string;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>("SELECT * FROM products WHERE id = ? AND deleted = 0", id);
  return row ? rowToProduct(row) : null;
}

export async function createProduct(input: {
  name: string;
  category?: string;
  sku?: string;
  barcode?: string;
  priceCents: number;
  costCents?: number;
  stock?: number;
  lowStockThreshold?: number;
  description?: string;
}): Promise<Product> {
  const db = await getDb();
  const id = generateUUID();
  const now = Date.now();
  await db.runAsync(
    `INSERT INTO products (id, name, category, sku, barcode, priceCents, costCents, stock, lowStockThreshold, description, createdAt, updatedAt, syncStatus, convexId, deleted, lastError)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', NULL, 0, NULL)`,
    id,
    input.name,
    input.category ?? "",
    input.sku ?? "",
    input.barcode ?? "",
    input.priceCents,
    input.costCents ?? 0,
    input.stock ?? 0,
    input.lowStockThreshold ?? 0,
    input.description ?? "",
    now,
    now
  );
  const product = await getProductById(id);
  if (!product) throw new Error("Failed to create product");
  return product;
}

export async function updateProduct(
  id: string,
  input: Partial<{
    name: string;
    category: string;
    sku: string;
    barcode: string;
    priceCents: number;
    costCents: number;
    stock: number;
    lowStockThreshold: number;
    description: string;
  }>
): Promise<Product | null> {
  const db = await getDb();
  const existing = await getProductById(id);
  if (!existing) return null;
  const now = Date.now();
  await db.runAsync(
    `UPDATE products SET name = ?, category = ?, sku = ?, barcode = ?, priceCents = ?, costCents = ?, stock = ?, lowStockThreshold = ?, description = ?, updatedAt = ?, syncStatus = 'PENDING'
     WHERE id = ?`,
    input.name ?? existing.name,
    input.category ?? existing.category,
    input.sku ?? existing.sku,
    input.barcode ?? existing.barcode,
    input.priceCents ?? existing.priceCents,
    input.costCents ?? existing.costCents,
    input.stock ?? existing.stock,
    input.lowStockThreshold ?? existing.lowStockThreshold,
    input.description ?? existing.description,
    now,
    id
  );
  return getProductById(id);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.runAsync(
    "UPDATE products SET deleted = 1, updatedAt = ?, syncStatus = 'PENDING' WHERE id = ?",
    Date.now(),
    id
  );
  return (result.changes ?? 0) > 0;
}
