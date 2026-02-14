/**
 * ZimPOS Convex schema. Sync hub: idempotent upserts by stable IDs (UUIDs).
 */
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    id: v.string(),
    name: v.string(),
    role: v.string(),
    updatedAt: v.number(),
    deleted: v.optional(v.number()),
  }).index("by_stable_id", ["id"]),

  products: defineTable({
    id: v.string(),
    name: v.string(),
    category: v.string(),
    sku: v.string(),
    barcode: v.string(),
    priceCents: v.number(),
    costCents: v.number(),
    stock: v.number(),
    lowStockThreshold: v.number(),
    description: v.string(),
    updatedAt: v.number(),
    deleted: v.optional(v.number()),
  }).index("by_stable_id", ["id"]),

  transactions: defineTable({
    id: v.string(),
    receiptNo: v.number(),
    timestamp: v.number(),
    subtotalCents: v.number(),
    discountCents: v.number(),
    taxCents: v.number(),
    totalCents: v.number(),
    paymentMethod: v.string(),
    amountTenderedCents: v.number(),
    changeGivenCents: v.number(),
    customerId: v.optional(v.string()),
    cashierUserId: v.string(),
    isRefund: v.number(),
    originalTransactionId: v.optional(v.string()),
    notes: v.string(),
    updatedAt: v.number(),
    deleted: v.optional(v.number()),
  }).index("by_stable_id", ["id"]),

  transaction_items: defineTable({
    id: v.string(),
    transactionId: v.string(),
    productId: v.string(),
    nameSnapshot: v.string(),
    unitPriceCents: v.number(),
    quantity: v.number(),
    lineTotalCents: v.number(),
  }).index("by_transaction", ["transactionId"]).index("by_stable_id", ["id"]),

  cash_shifts: defineTable({
    id: v.string(),
    openedAt: v.number(),
    closedAt: v.optional(v.number()),
    openingFloatCents: v.number(),
    expectedCashCents: v.optional(v.number()),
    actualCashCents: v.optional(v.number()),
    varianceCents: v.optional(v.number()),
    openedByUserId: v.string(),
    closedByUserId: v.optional(v.string()),
    managerApprovalUserId: v.optional(v.string()),
    notes: v.string(),
    updatedAt: v.number(),
    deleted: v.optional(v.number()),
  }).index("by_stable_id", ["id"]),

  activity_logs: defineTable({
    id: v.string(),
    type: v.string(),
    action: v.string(),
    details: v.string(),
    userId: v.string(),
    managerUserId: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_stable_id", ["id"]),

  stock_receipts: defineTable({
    id: v.string(),
    receivedAt: v.number(),
    supplierName: v.string(),
    totalCostCents: v.number(),
    receivedByUserId: v.string(),
    notes: v.string(),
    updatedAt: v.number(),
    deleted: v.optional(v.number()),
  }).index("by_stable_id", ["id"]),

  stock_receipt_items: defineTable({
    id: v.string(),
    stockReceiptId: v.string(),
    productId: v.string(),
    quantity: v.number(),
    unitCostCents: v.number(),
    lineTotalCents: v.number(),
  }).index("by_receipt", ["stockReceiptId"]).index("by_stable_id", ["id"]),
});
