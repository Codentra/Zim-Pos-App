/**
 * Sales repository. Create sale in a single SQL transaction (transaction + items + stock decrement + log).
 */
import { getDb } from "../db";
import { generateUUID } from "@/lib/utils/uuid";
import type { Transaction, TransactionItem, PaymentMethod } from "@/lib/domain/types";
export interface CartItem {
  productId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
}

async function getNextReceiptNo(db: { runAsync: (sql: string, ...params: unknown[]) => Promise<unknown>; getFirstAsync: <T>(sql: string, ...params: unknown[]) => Promise<T | null> }): Promise<number> {
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_meta WHERE key = 'receiptCounter'"
  );
  const next = row ? parseInt(row.value || "0", 10) + 1 : 1;
  await db.runAsync(
    "INSERT OR REPLACE INTO app_meta (key, value) VALUES ('receiptCounter', ?)",
    String(next)
  );
  return next;
}

export async function createSale(input: {
  items: CartItem[];
  discountCents?: number;
  paymentMethod: PaymentMethod;
  amountTenderedCents: number;
  changeGivenCents: number;
  cashierUserId: string;
  customerId?: string | null;
  notes?: string;
}): Promise<{ transaction: Transaction; items: TransactionItem[] }> {
  const db = await getDb();
  const now = Date.now();
  const transactionId = generateUUID();

  const subtotalCents = input.items.reduce(
    (sum, i) => sum + i.unitPriceCents * i.quantity,
    0
  );
  const discountCents = input.discountCents ?? 0;
  const taxCents = 0;
  const totalCents = Math.max(0, subtotalCents - discountCents + taxCents);

  let receiptNo: number;
  const items: TransactionItem[] = [];

  await db.withExclusiveTransactionAsync(async (txn) => {
    receiptNo = await getNextReceiptNo(txn);

    await txn.runAsync(
      `INSERT INTO transactions (id, receiptNo, timestamp, subtotalCents, discountCents, taxCents, totalCents, paymentMethod, amountTenderedCents, changeGivenCents, customerId, cashierUserId, isRefund, originalTransactionId, notes, createdAt, updatedAt, syncStatus, convexId, deleted, lastError)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, ?, ?, ?, 'PENDING', NULL, 0, NULL)`,
      transactionId,
      receiptNo,
      now,
      subtotalCents,
      discountCents,
      taxCents,
      totalCents,
      input.paymentMethod,
      input.amountTenderedCents,
      input.changeGivenCents,
      input.customerId ?? null,
      input.cashierUserId,
      input.notes ?? "",
      now,
      now
    );

    for (const cartItem of input.items) {
      const itemId = generateUUID();
      const lineTotalCents = cartItem.unitPriceCents * cartItem.quantity;
      await txn.runAsync(
        `INSERT INTO transaction_items (id, transactionId, productId, nameSnapshot, unitPriceCents, quantity, lineTotalCents)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        itemId,
        transactionId,
        cartItem.productId,
        cartItem.name,
        cartItem.unitPriceCents,
        cartItem.quantity,
        lineTotalCents
      );
      items.push({
        id: itemId,
        transactionId,
        productId: cartItem.productId,
        nameSnapshot: cartItem.name,
        unitPriceCents: cartItem.unitPriceCents,
        quantity: cartItem.quantity,
        lineTotalCents,
      });

      await txn.runAsync(
        "UPDATE products SET stock = stock - ?, updatedAt = ?, syncStatus = 'PENDING' WHERE id = ?",
        cartItem.quantity,
        now,
        cartItem.productId
      );
    }

    await txn.runAsync(
      `INSERT INTO activity_logs (id, type, action, details, userId, managerUserId, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      generateUUID(),
      "SALE",
      "CREATE",
      JSON.stringify({ transactionId, receiptNo, totalCents: totalCents }),
      input.cashierUserId,
      null,
      now
    );
  });

  const transaction: Transaction = {
    id: transactionId,
    receiptNo: receiptNo!,
    timestamp: now,
    subtotalCents,
    discountCents,
    taxCents,
    totalCents,
    paymentMethod: input.paymentMethod,
    amountTenderedCents: input.amountTenderedCents,
    changeGivenCents: input.changeGivenCents,
    customerId: input.customerId ?? null,
    cashierUserId: input.cashierUserId,
    isRefund: 0,
    originalTransactionId: null,
    notes: input.notes ?? "",
    createdAt: now,
    updatedAt: now,
    syncStatus: "PENDING",
    convexId: null,
    deleted: 0,
    lastError: null,
  };

  return { transaction, items };
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{
    id: string;
    receiptNo: number;
    timestamp: number;
    subtotalCents: number;
    discountCents: number;
    taxCents: number;
    totalCents: number;
    paymentMethod: string;
    amountTenderedCents: number;
    changeGivenCents: number;
    customerId: string | null;
    cashierUserId: string;
    isRefund: number;
    originalTransactionId: string | null;
    notes: string;
    createdAt: number;
    updatedAt: number;
    syncStatus: string;
    convexId: string | null;
    deleted: number;
    lastError: string | null;
  }>("SELECT * FROM transactions WHERE id = ? AND deleted = 0", id);
  if (!row) return null;
  return {
    id: row.id,
    receiptNo: row.receiptNo,
    timestamp: row.timestamp,
    subtotalCents: row.subtotalCents,
    discountCents: row.discountCents,
    taxCents: row.taxCents,
    totalCents: row.totalCents,
    paymentMethod: row.paymentMethod as PaymentMethod,
    amountTenderedCents: row.amountTenderedCents,
    changeGivenCents: row.changeGivenCents,
    customerId: row.customerId,
    cashierUserId: row.cashierUserId,
    isRefund: row.isRefund,
    originalTransactionId: row.originalTransactionId,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    syncStatus: row.syncStatus as Transaction["syncStatus"],
    convexId: row.convexId,
    deleted: row.deleted,
    lastError: row.lastError,
  };
}

export async function getTransactionItems(transactionId: string): Promise<TransactionItem[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: string;
    transactionId: string;
    productId: string;
    nameSnapshot: string;
    unitPriceCents: number;
    quantity: number;
    lineTotalCents: number;
  }>("SELECT * FROM transaction_items WHERE transactionId = ?", transactionId);
  return rows.map((r) => ({
    id: r.id,
    transactionId: r.transactionId,
    productId: r.productId,
    nameSnapshot: r.nameSnapshot,
    unitPriceCents: r.unitPriceCents,
    quantity: r.quantity,
    lineTotalCents: r.lineTotalCents,
  }));
}
