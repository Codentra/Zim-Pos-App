/**
 * Convex mutations for ZimPOS sync. Idempotent upserts by stable id (UUID).
 */
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const upsertProduct = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("products")
      .withIndex("by_stable_id", (q) => q.eq("id", args.id))
      .first();
    const doc = {
      id: args.id,
      name: args.name,
      category: args.category,
      sku: args.sku,
      barcode: args.barcode,
      priceCents: args.priceCents,
      costCents: args.costCents,
      stock: args.stock,
      lowStockThreshold: args.lowStockThreshold,
      description: args.description,
      updatedAt: args.updatedAt,
      ...(args.deleted !== undefined && { deleted: args.deleted }),
    };
    if (existing) await ctx.db.patch(existing._id, doc);
    else await ctx.db.insert("products", doc);
  },
});

export const upsertTransaction = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("transactions")
      .withIndex("by_stable_id", (q) => q.eq("id", args.id))
      .first();
    const doc = { ...args };
    if (existing) await ctx.db.patch(existing._id, doc);
    else await ctx.db.insert("transactions", doc);
  },
});

export const upsertTransactionItem = mutation({
  args: {
    id: v.string(),
    transactionId: v.string(),
    productId: v.string(),
    nameSnapshot: v.string(),
    unitPriceCents: v.number(),
    quantity: v.number(),
    lineTotalCents: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("transaction_items")
      .withIndex("by_stable_id", (q) => q.eq("id", args.id))
      .first();
    if (existing) await ctx.db.patch(existing._id, args);
    else await ctx.db.insert("transaction_items", args);
  },
});

export const upsertCashShift = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("cash_shifts")
      .withIndex("by_stable_id", (q) => q.eq("id", args.id))
      .first();
    if (existing) await ctx.db.patch(existing._id, args);
    else await ctx.db.insert("cash_shifts", args);
  },
});

export const upsertActivityLog = mutation({
  args: {
    id: v.string(),
    type: v.string(),
    action: v.string(),
    details: v.string(),
    userId: v.string(),
    managerUserId: v.optional(v.string()),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("activity_logs")
      .withIndex("by_stable_id", (q) => q.eq("id", args.id))
      .first();
    if (existing) await ctx.db.patch(existing._id, args);
    else await ctx.db.insert("activity_logs", args);
  },
});

export const upsertStockReceipt = mutation({
  args: {
    id: v.string(),
    receivedAt: v.number(),
    supplierName: v.string(),
    totalCostCents: v.number(),
    receivedByUserId: v.string(),
    notes: v.string(),
    updatedAt: v.number(),
    deleted: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stock_receipts")
      .withIndex("by_stable_id", (q) => q.eq("id", args.id))
      .first();
    if (existing) await ctx.db.patch(existing._id, args);
    else await ctx.db.insert("stock_receipts", args);
  },
});

export const upsertStockReceiptItem = mutation({
  args: {
    id: v.string(),
    stockReceiptId: v.string(),
    productId: v.string(),
    quantity: v.number(),
    unitCostCents: v.number(),
    lineTotalCents: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stock_receipt_items")
      .withIndex("by_stable_id", (q) => q.eq("id", args.id))
      .first();
    if (existing) await ctx.db.patch(existing._id, args);
    else await ctx.db.insert("stock_receipt_items", args);
  },
});
