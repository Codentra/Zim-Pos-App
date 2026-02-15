/**
 * Refunds. Full refund: create refund transaction, restock items, log.
 */
import { getDb } from "../db";
import { generateUUID } from "@/lib/utils/uuid";
import { getTransactionById, getTransactionItems } from "./salesRepo";
import type { Transaction, TransactionItem } from "@/lib/domain/types";

export async function createFullRefund(input: {
  originalTransactionId: string;
  cashierUserId: string;
  managerUserId?: string | null;
  notes?: string;
}): Promise<{ transaction: Transaction; items: TransactionItem[] }> {
  const db = await getDb();
  const original = await getTransactionById(input.originalTransactionId);
  if (!original) throw new Error("Transaction not found");
  if (original.isRefund) throw new Error("Cannot refund a refund");
  const originalItems = await getTransactionItems(input.originalTransactionId);
  if (originalItems.length === 0) throw new Error("No items to refund");

  const transactionId = generateUUID();
  const now = Date.now();
  const items: TransactionItem[] = [];
  let refundReceiptNo = 1;

  await db.withExclusiveTransactionAsync(async (txn) => {
    const receiptNoRow = await txn.getFirstAsync<{ value: string }>(
      "SELECT value FROM app_meta WHERE key = 'receiptCounter'"
    );
    refundReceiptNo = receiptNoRow ? parseInt(receiptNoRow.value || "0", 10) + 1 : 1;
    await txn.runAsync(
      "INSERT OR REPLACE INTO app_meta (key, value) VALUES ('receiptCounter', ?)",
      String(refundReceiptNo)
    );

    await txn.runAsync(
      `INSERT INTO transactions (id, receiptNo, timestamp, subtotalCents, discountCents, taxCents, totalCents, paymentMethod, amountTenderedCents, changeGivenCents, customerId, cashierUserId, isRefund, originalTransactionId, notes, createdAt, updatedAt, syncStatus, convexId, deleted, lastError)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, 1, ?, ?, ?, ?, 'PENDING', NULL, 0, NULL)`,
      transactionId,
      refundReceiptNo,
      now,
      -original.subtotalCents,
      -original.discountCents,
      -original.taxCents,
      -original.totalCents,
      original.paymentMethod,
      original.customerId,
      input.cashierUserId,
      input.originalTransactionId,
      input.notes ?? "Refund",
      now,
      now
    );

    for (const it of originalItems) {
      const itemId = generateUUID();
      const lineTotalCents = -it.lineTotalCents;
      await txn.runAsync(
        `INSERT INTO transaction_items (id, transactionId, productId, nameSnapshot, unitPriceCents, quantity, lineTotalCents)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        itemId,
        transactionId,
        it.productId,
        it.nameSnapshot,
        it.unitPriceCents,
        -it.quantity,
        lineTotalCents
      );
      items.push({
        id: itemId,
        transactionId,
        productId: it.productId,
        nameSnapshot: it.nameSnapshot,
        unitPriceCents: it.unitPriceCents,
        quantity: -it.quantity,
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
      "REFUND",
      "Approved Refund",
      JSON.stringify({
        transactionId,
        originalTransactionId: input.originalTransactionId,
        receiptNo: original.receiptNo,
        totalCents: original.totalCents,
        itemName: originalItems[0]?.nameSnapshot,
      }),
      input.cashierUserId,
      input.managerUserId ?? null,
      now
    );
  });

  const transaction: Transaction = {
    id: transactionId,
    receiptNo: refundReceiptNo,
    timestamp: now,
    subtotalCents: -original.subtotalCents,
    discountCents: -original.discountCents,
    taxCents: -original.taxCents,
    totalCents: -original.totalCents,
    paymentMethod: original.paymentMethod,
    amountTenderedCents: 0,
    changeGivenCents: 0,
    customerId: original.customerId,
    cashierUserId: input.cashierUserId,
    isRefund: 1,
    originalTransactionId: input.originalTransactionId,
    notes: input.notes ?? "Refund",
    createdAt: now,
    updatedAt: now,
    syncStatus: "PENDING",
    convexId: null,
    deleted: 0,
    lastError: null,
  };

  return { transaction, items };
}
