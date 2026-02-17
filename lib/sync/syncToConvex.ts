/**
 * Upload PENDING SQLite rows to Convex. Multi-tenant: pass current businessId.
 * When CONVEX_SYNC_KEY is set in Convex, set EXPO_PUBLIC_CONVEX_SYNC_KEY in .env to the same value.
 */
import { getDb } from "@/lib/data/db";
import type { ConvexReactClient } from "convex/react";
import { api } from "../../convex/_generated/api";

const BATCH_SIZE = 50;

function getSyncKey(): string | undefined {
  if (typeof process === "undefined") return undefined;
  const k = process.env.EXPO_PUBLIC_CONVEX_SYNC_KEY;
  return k != null && k !== "" ? k : undefined;
}

function withSyncKey<T extends Record<string, unknown>>(args: T): T & { syncKey?: string } {
  const k = getSyncKey();
  return { ...args, ...(k != null && { syncKey: k }) };
}

async function markSynced(db: Awaited<ReturnType<typeof getDb>>, table: string, ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  for (const id of ids) {
    await db.runAsync(`UPDATE ${table} SET syncStatus = 'SYNCED' WHERE id = ?`, id);
  }
}

export async function runSyncToConvex(
  client: ConvexReactClient,
  businessId: string
): Promise<{ ok: boolean; error?: string }> {
  const db = await getDb();
  try {
    // 1. Businesses (no businessId in payload; business is the entity)
    const businessRows = await db.getAllAsync<{
      id: string;
      name: string;
      ownerName: string;
      phone: string;
      email: string;
      country: string;
      city: string;
      address: string | null;
      website: string | null;
      taxNumber: string | null;
      baseCurrency: string | null;
      updatedAt: number;
      deleted: number;
    }>(
      "SELECT id, name, ownerName, phone, email, country, city, address, website, taxNumber, baseCurrency, updatedAt, deleted FROM businesses WHERE syncStatus = 'PENDING' AND deleted = 0"
    );
    const bizIds: string[] = [];
    for (const row of businessRows) {
      await client.mutation(api.sync.upsertBusiness, withSyncKey({
        id: row.id,
        name: row.name,
        ownerName: row.ownerName,
        phone: row.phone,
        email: row.email,
        country: row.country,
        city: row.city,
        ...(row.address != null && row.address !== "" && { address: row.address }),
        ...(row.website != null && row.website !== "" && { website: row.website }),
        ...(row.taxNumber != null && row.taxNumber !== "" && { taxNumber: row.taxNumber }),
        ...(row.baseCurrency != null && row.baseCurrency !== "" && { baseCurrency: row.baseCurrency }),
        updatedAt: row.updatedAt,
        ...(row.deleted !== 0 && { deleted: row.deleted }),
      }));
      bizIds.push(row.id);
    }
    await markSynced(db, "businesses", bizIds);

    // 2. Users (no pinHash; sync businessId + id, name, role, updatedAt, deleted)
    const userRows = await db.getAllAsync<{
      id: string;
      name: string;
      role: string;
      updatedAt: number;
      deleted: number;
    }>("SELECT id, name, role, updatedAt, deleted FROM users WHERE syncStatus = 'PENDING' AND deleted = 0");
    const userIds: string[] = [];
    for (const row of userRows) {
      await client.mutation(api.sync.upsertUser, withSyncKey({
        businessId,
        id: row.id,
        name: row.name,
        role: row.role,
        updatedAt: row.updatedAt,
        ...(row.deleted !== 0 && { deleted: row.deleted }),
      }));
      userIds.push(row.id);
    }
    await markSynced(db, "users", userIds);

    // 3. Products
    const productRows = await db.getAllAsync<{
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
      updatedAt: number;
      deleted: number;
    }>("SELECT id, name, category, sku, barcode, priceCents, costCents, stock, lowStockThreshold, description, updatedAt, deleted FROM products WHERE syncStatus = 'PENDING' AND deleted = 0");
    const productIds: string[] = [];
    for (const row of productRows) {
      await client.mutation(api.sync.upsertProduct, withSyncKey({
        businessId,
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
        updatedAt: row.updatedAt,
        ...(row.deleted !== 0 && { deleted: row.deleted }),
      }));
      productIds.push(row.id);
    }
    await markSynced(db, "products", productIds);

    // 4. Customers
    const customerRows = await db.getAllAsync<{
      id: string;
      name: string;
      phone: string;
      email: string;
      location: string;
      creditLimitCents: number;
      creditBalanceCents: number;
      isVip: number;
      notes: string;
      updatedAt: number;
      deleted: number;
    }>("SELECT id, name, phone, email, location, creditLimitCents, creditBalanceCents, isVip, notes, updatedAt, deleted FROM customers WHERE syncStatus = 'PENDING' AND deleted = 0");
    const customerIds: string[] = [];
    for (const row of customerRows) {
      await client.mutation(api.sync.upsertCustomer, withSyncKey({
        businessId,
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        location: row.location,
        creditLimitCents: row.creditLimitCents,
        creditBalanceCents: row.creditBalanceCents,
        isVip: row.isVip,
        notes: row.notes,
        updatedAt: row.updatedAt,
        ...(row.deleted !== 0 && { deleted: row.deleted }),
      }));
      customerIds.push(row.id);
    }
    await markSynced(db, "customers", customerIds);

    // 5. Subscriptions
    const subRows = await db.getAllAsync<{
      id: string;
      businessId: string;
      planId: string;
      status: string;
      trialStartAt: number | null;
      trialEndAt: number | null;
      currentPeriodStart: number | null;
      currentPeriodEnd: number | null;
      userLimit: number;
      updatedAt: number;
      deleted: number;
    }>("SELECT id, businessId, planId, status, trialStartAt, trialEndAt, currentPeriodStart, currentPeriodEnd, userLimit, updatedAt, deleted FROM subscriptions WHERE syncStatus = 'PENDING' AND deleted = 0");
    const subIds: string[] = [];
    for (const row of subRows) {
      await client.mutation(api.sync.upsertSubscription, withSyncKey({
        businessId: row.businessId,
        id: row.id,
        planId: row.planId,
        status: row.status,
        ...(row.trialStartAt != null && { trialStartAt: row.trialStartAt }),
        ...(row.trialEndAt != null && { trialEndAt: row.trialEndAt }),
        ...(row.currentPeriodStart != null && { currentPeriodStart: row.currentPeriodStart }),
        ...(row.currentPeriodEnd != null && { currentPeriodEnd: row.currentPeriodEnd }),
        userLimit: row.userLimit,
        updatedAt: row.updatedAt,
        ...(row.deleted !== 0 && { deleted: row.deleted }),
      }));
      subIds.push(row.id);
    }
    await markSynced(db, "subscriptions", subIds);

    // 6. Transactions: sync then sync their items, then mark transactions SYNCED (transaction_items have no syncStatus)
    const txRows = await db.getAllAsync<{
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
      currency: string | null;
      updatedAt: number;
      deleted: number;
    }>("SELECT id, receiptNo, timestamp, subtotalCents, discountCents, taxCents, totalCents, paymentMethod, amountTenderedCents, changeGivenCents, customerId, cashierUserId, isRefund, originalTransactionId, notes, currency, updatedAt, deleted FROM transactions WHERE syncStatus = 'PENDING' AND deleted = 0");
    const txRowsBatch = txRows.slice(0, BATCH_SIZE);
    const txIds: string[] = [];
    for (const row of txRowsBatch) {
      await client.mutation(api.sync.upsertTransaction, withSyncKey({
        businessId,
        id: row.id,
        receiptNo: row.receiptNo,
        timestamp: row.timestamp,
        subtotalCents: row.subtotalCents,
        discountCents: row.discountCents,
        taxCents: row.taxCents,
        totalCents: row.totalCents,
        paymentMethod: row.paymentMethod,
        amountTenderedCents: row.amountTenderedCents,
        changeGivenCents: row.changeGivenCents,
        ...(row.customerId != null && { customerId: row.customerId }),
        cashierUserId: row.cashierUserId,
        isRefund: row.isRefund,
        ...(row.originalTransactionId != null && { originalTransactionId: row.originalTransactionId }),
        notes: row.notes,
        ...(row.currency != null && row.currency !== "" && { currency: row.currency }),
        updatedAt: row.updatedAt,
        ...(row.deleted !== 0 && { deleted: row.deleted }),
      }));
      txIds.push(row.id);
    }
    // 7. Transaction items for the transactions we just synced (sync before marking transactions SYNCED)
    if (txIds.length > 0) {
      const placeholders = txIds.map(() => "?").join(",");
      const txItemRows = await db.getAllAsync<{
        id: string;
        transactionId: string;
        productId: string;
        nameSnapshot: string;
        unitPriceCents: number;
        quantity: number;
        lineTotalCents: number;
      }>(
        `SELECT id, transactionId, productId, nameSnapshot, unitPriceCents, quantity, lineTotalCents FROM transaction_items WHERE transactionId IN (${placeholders})`,
        ...txIds
      );
      for (const row of txItemRows) {
        await client.mutation(api.sync.upsertTransactionItem, withSyncKey({
          businessId,
          id: row.id,
          transactionId: row.transactionId,
          productId: row.productId,
          nameSnapshot: row.nameSnapshot,
          unitPriceCents: row.unitPriceCents,
          quantity: row.quantity,
          lineTotalCents: row.lineTotalCents,
        }));
      }
    }
    await markSynced(db, "transactions", txIds);

    // 8. Cash shifts
    const cashRows = await db.getAllAsync<{
      id: string;
      openedAt: number;
      closedAt: number | null;
      openingFloatCents: number;
      expectedCashCents: number | null;
      actualCashCents: number | null;
      varianceCents: number | null;
      openedByUserId: string;
      closedByUserId: string | null;
      managerApprovalUserId: string | null;
      notes: string;
      updatedAt: number;
      deleted: number;
    }>("SELECT id, openedAt, closedAt, openingFloatCents, expectedCashCents, actualCashCents, varianceCents, openedByUserId, closedByUserId, managerApprovalUserId, notes, updatedAt, deleted FROM cash_shifts WHERE syncStatus = 'PENDING' AND deleted = 0");
    const cashIds: string[] = [];
    for (const row of cashRows) {
      await client.mutation(api.sync.upsertCashShift, withSyncKey({
        businessId,
        id: row.id,
        openedAt: row.openedAt,
        ...(row.closedAt != null && { closedAt: row.closedAt }),
        openingFloatCents: row.openingFloatCents,
        ...(row.expectedCashCents != null && { expectedCashCents: row.expectedCashCents }),
        ...(row.actualCashCents != null && { actualCashCents: row.actualCashCents }),
        ...(row.varianceCents != null && { varianceCents: row.varianceCents }),
        openedByUserId: row.openedByUserId,
        ...(row.closedByUserId != null && { closedByUserId: row.closedByUserId }),
        ...(row.managerApprovalUserId != null && { managerApprovalUserId: row.managerApprovalUserId }),
        notes: row.notes,
        updatedAt: row.updatedAt,
        ...(row.deleted !== 0 && { deleted: row.deleted }),
      }));
      cashIds.push(row.id);
    }
    await markSynced(db, "cash_shifts", cashIds);

    // 9. Activity logs (syncStatus added in migration 8)
    const logRows = await db.getAllAsync<{
      id: string;
      type: string;
      action: string;
      details: string;
      userId: string;
      managerUserId: string | null;
      timestamp: number;
    }>("SELECT id, type, action, details, userId, managerUserId, timestamp FROM activity_logs WHERE syncStatus = 'PENDING' LIMIT ?", BATCH_SIZE * 5);
    const logIds: string[] = [];
    for (const row of logRows) {
      await client.mutation(api.sync.upsertActivityLog, withSyncKey({
        businessId,
        id: row.id,
        type: row.type,
        action: row.action,
        details: row.details,
        userId: row.userId,
        ...(row.managerUserId != null && { managerUserId: row.managerUserId }),
        timestamp: row.timestamp,
      }));
      logIds.push(row.id);
    }
    await markSynced(db, "activity_logs", logIds);

    // 10. Stock receipts
    const stockRows = await db.getAllAsync<{
      id: string;
      receivedAt: number;
      supplierName: string;
      totalCostCents: number;
      receivedByUserId: string;
      notes: string;
      updatedAt: number;
      deleted: number;
    }>("SELECT id, receivedAt, supplierName, totalCostCents, receivedByUserId, notes, updatedAt, deleted FROM stock_receipts WHERE syncStatus = 'PENDING' AND deleted = 0");
    const stockIds: string[] = [];
    for (const row of stockRows) {
      await client.mutation(api.sync.upsertStockReceipt, withSyncKey({
        businessId,
        id: row.id,
        receivedAt: row.receivedAt,
        supplierName: row.supplierName,
        totalCostCents: row.totalCostCents,
        receivedByUserId: row.receivedByUserId,
        notes: row.notes,
        updatedAt: row.updatedAt,
        ...(row.deleted !== 0 && { deleted: row.deleted }),
      }));
      stockIds.push(row.id);
    }
    await markSynced(db, "stock_receipts", stockIds);

    // 11. Stock receipt items
    const stockItemRows = await db.getAllAsync<{
      id: string;
      stockReceiptId: string;
      productId: string;
      quantity: number;
      unitCostCents: number;
      lineTotalCents: number;
    }>(
      "SELECT sri.id, sri.stockReceiptId, sri.productId, sri.quantity, sri.unitCostCents, sri.lineTotalCents FROM stock_receipt_items sri INNER JOIN stock_receipts sr ON sr.id = sri.stockReceiptId WHERE sr.syncStatus = 'PENDING' AND sr.deleted = 0"
    );
    const stockItemIds: string[] = [];
    for (const row of stockItemRows) {
        await client.mutation(api.sync.upsertStockReceiptItem, withSyncKey({
          businessId,
          id: row.id,
          stockReceiptId: row.stockReceiptId,
          productId: row.productId,
          quantity: row.quantity,
          unitCostCents: row.unitCostCents,
          lineTotalCents: row.lineTotalCents,
        }));
      stockItemIds.push(row.id);
    }
    await markSynced(db, "stock_receipt_items", stockItemIds);

    // Record sync health for admin monitoring
    await client.mutation(api.sync.recordSyncHealth, withSyncKey({ businessId }));

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
