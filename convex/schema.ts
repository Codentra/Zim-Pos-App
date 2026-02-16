/**
 * ZimPOS Convex schema. Multi-tenant sync hub: idempotent upserts by stable IDs (UUIDs) per business.
 */
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  businesses: defineTable({
    id: v.string(),
    name: v.string(),
    ownerName: v.string(),
    phone: v.string(),
    email: v.string(),
    country: v.string(),
    city: v.string(),
    address: v.optional(v.string()),
    website: v.optional(v.string()),
    taxNumber: v.optional(v.string()),
    updatedAt: v.number(),
    deleted: v.optional(v.number()),
  }).index("by_stable_id", ["id"]),

  users: defineTable({
    id: v.string(),
    businessId: v.string(),
    name: v.string(),
    role: v.string(),
    updatedAt: v.number(),
    deleted: v.optional(v.number()),
  })
    .index("by_stable_id", ["id"])
    .index("by_business_id", ["businessId", "id"]),

  products: defineTable({
    id: v.string(),
    businessId: v.string(),
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
  })
    .index("by_stable_id", ["id"])
    .index("by_business_id", ["businessId", "id"]),

  customers: defineTable({
    id: v.string(),
    businessId: v.string(),
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    location: v.string(),
    creditLimitCents: v.number(),
    creditBalanceCents: v.number(),
    isVip: v.number(),
    notes: v.string(),
    updatedAt: v.number(),
    deleted: v.optional(v.number()),
  })
    .index("by_stable_id", ["id"])
    .index("by_business_id", ["businessId", "id"]),

  subscriptions: defineTable({
    id: v.string(),
    businessId: v.string(),
    planId: v.string(),
    status: v.string(),
    trialStartAt: v.optional(v.number()),
    trialEndAt: v.optional(v.number()),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    userLimit: v.number(),
    updatedAt: v.number(),
    deleted: v.optional(v.number()),
  })
    .index("by_stable_id", ["id"])
    .index("by_business_id", ["businessId", "id"]),

  transactions: defineTable({
    id: v.string(),
    businessId: v.string(),
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
  })
    .index("by_stable_id", ["id"])
    .index("by_business_id", ["businessId", "id"]),

  transaction_items: defineTable({
    id: v.string(),
    businessId: v.string(),
    transactionId: v.string(),
    productId: v.string(),
    nameSnapshot: v.string(),
    unitPriceCents: v.number(),
    quantity: v.number(),
    lineTotalCents: v.number(),
  })
    .index("by_transaction", ["transactionId"])
    .index("by_stable_id", ["id"])
    .index("by_business_id", ["businessId", "id"]),

  cash_shifts: defineTable({
    id: v.string(),
    businessId: v.string(),
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
  })
    .index("by_stable_id", ["id"])
    .index("by_business_id", ["businessId", "id"]),

  activity_logs: defineTable({
    id: v.string(),
    businessId: v.string(),
    type: v.string(),
    action: v.string(),
    details: v.string(),
    userId: v.string(),
    managerUserId: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_stable_id", ["id"])
    .index("by_business_id", ["businessId", "id"]),

  stock_receipts: defineTable({
    id: v.string(),
    businessId: v.string(),
    receivedAt: v.number(),
    supplierName: v.string(),
    totalCostCents: v.number(),
    receivedByUserId: v.string(),
    notes: v.string(),
    updatedAt: v.number(),
    deleted: v.optional(v.number()),
  })
    .index("by_stable_id", ["id"])
    .index("by_business_id", ["businessId", "id"]),

  stock_receipt_items: defineTable({
    id: v.string(),
    businessId: v.string(),
    stockReceiptId: v.string(),
    productId: v.string(),
    quantity: v.number(),
    unitCostCents: v.number(),
    lineTotalCents: v.number(),
  })
    .index("by_receipt", ["stockReceiptId"])
    .index("by_stable_id", ["id"])
    .index("by_business_id", ["businessId", "id"]),

  /** Sync health: last successful sync per business (for admin monitoring). */
  business_sync: defineTable({
    businessId: v.string(),
    lastSyncAt: v.number(),
    updatedAt: v.number(),
  }).index("by_business_id", ["businessId"]),
});
