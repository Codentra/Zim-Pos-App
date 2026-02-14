/**
 * Stock receiving. Create receipt + items, increment product stock.
 */
import { getDb } from "../db";
import { generateUUID } from "@/lib/utils/uuid";
import type { StockReceipt, StockReceiptItem } from "@/lib/domain/types";

export interface StockReceiptItemInput {
  productId: string;
  quantity: number;
  unitCostCents: number;
}

export async function createStockReceipt(input: {
  supplierName: string;
  items: StockReceiptItemInput[];
  receivedByUserId: string;
  notes?: string;
}): Promise<{ receipt: StockReceipt; items: StockReceiptItem[] }> {
  const db = await getDb();
  const receiptId = generateUUID();
  const now = Date.now();
  const totalCostCents = input.items.reduce((s, i) => s + i.quantity * i.unitCostCents, 0);
  const items: StockReceiptItem[] = [];

  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.runAsync(
      `INSERT INTO stock_receipts (id, receivedAt, supplierName, totalCostCents, receivedByUserId, notes, createdAt, updatedAt, syncStatus, convexId, deleted, lastError)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', NULL, 0, NULL)`,
      receiptId,
      now,
      input.supplierName,
      totalCostCents,
      input.receivedByUserId,
      input.notes ?? "",
      now,
      now
    );
    for (const it of input.items) {
      const itemId = generateUUID();
      const lineTotalCents = it.quantity * it.unitCostCents;
      await txn.runAsync(
        `INSERT INTO stock_receipt_items (id, stockReceiptId, productId, quantity, unitCostCents, lineTotalCents)
         VALUES (?, ?, ?, ?, ?, ?)`,
        itemId,
        receiptId,
        it.productId,
        it.quantity,
        it.unitCostCents,
        lineTotalCents
      );
      items.push({
        id: itemId,
        stockReceiptId: receiptId,
        productId: it.productId,
        quantity: it.quantity,
        unitCostCents: it.unitCostCents,
        lineTotalCents,
      });
      await txn.runAsync(
        "UPDATE products SET stock = stock + ?, updatedAt = ?, syncStatus = 'PENDING' WHERE id = ?",
        it.quantity,
        now,
        it.productId
      );
    }
    await txn.runAsync(
      `INSERT INTO activity_logs (id, type, action, details, userId, managerUserId, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      generateUUID(),
      "STOCK",
      "RECEIVE",
      JSON.stringify({ receiptId, totalCostCents }),
      input.receivedByUserId,
      null,
      now
    );
  });

  const receipt: StockReceipt = {
    id: receiptId,
    receivedAt: now,
    supplierName: input.supplierName,
    totalCostCents,
    receivedByUserId: input.receivedByUserId,
    notes: input.notes ?? "",
    createdAt: now,
    updatedAt: now,
    syncStatus: "PENDING",
    convexId: null,
    deleted: 0,
    lastError: null,
  };
  return { receipt, items };
}
