/**
 * Convex mutations for ZimPOS sync. Multi-tenant, idempotent upserts by stable id (UUID) per business.
 * PINs and payment tokens are never sent; only operational data.
 * When CONVEX_SYNC_KEY is set in Convex env, callers must pass matching syncKey or requests are rejected.
 */
import { v } from "convex/values";
import { mutation } from "./_generated/server";

function requireSyncKey(args: { syncKey?: string }): void {
  const envKey = process.env.CONVEX_SYNC_KEY;
  if (!envKey) return;
  if (args.syncKey !== envKey) throw new Error("Unauthorized: invalid sync key");
}

export const upsertBusiness = mutation({
  args: {
    syncKey: v.optional(v.string()),
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
    baseCurrency: v.optional(v.string()),
    updatedAt: v.number(),
    deleted: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    requireSyncKey(args);
    const { syncKey: _sk, ...doc } = args;
    const existing = await ctx.db.query("businesses").withIndex("by_stable_id", (q) => q.eq("id", args.id)).first();
    if (existing) await ctx.db.patch(existing._id, doc);
    else await ctx.db.insert("businesses", doc);
  },
});

export const upsertUser = mutation({
  args: {
    syncKey: v.optional(v.string()),
    businessId: v.string(),
    id: v.string(),
    name: v.string(),
    role: v.string(),
    updatedAt: v.number(),
    deleted: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    requireSyncKey(args);
    const { syncKey: _sk, ...doc } = args;
    const existing = await ctx.db.query("users").withIndex("by_business_id", (q) => q.eq("businessId", args.businessId).eq("id", args.id)).first();
    if (existing) await ctx.db.patch(existing._id, doc);
    else await ctx.db.insert("users", doc);
  },
});

export const upsertCustomer = mutation({
  args: {
    syncKey: v.optional(v.string()),
    businessId: v.string(),
    id: v.string(),
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
  },
  handler: async (ctx, args) => {
    requireSyncKey(args);
    const { syncKey: _sk, ...doc } = args;
    const existing = await ctx.db.query("customers").withIndex("by_business_id", (q) => q.eq("businessId", args.businessId).eq("id", args.id)).first();
    if (existing) await ctx.db.patch(existing._id, doc);
    else await ctx.db.insert("customers", doc);
  },
});

export const upsertSubscription = mutation({
  args: {
    syncKey: v.optional(v.string()),
    businessId: v.string(),
    id: v.string(),
    planId: v.string(),
    status: v.string(),
    trialStartAt: v.optional(v.number()),
    trialEndAt: v.optional(v.number()),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    userLimit: v.number(),
    updatedAt: v.number(),
    deleted: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    requireSyncKey(args);
    const { syncKey: _sk, ...doc } = args;
    const existing = await ctx.db.query("subscriptions").withIndex("by_business_id", (q) => q.eq("businessId", args.businessId).eq("id", args.id)).first();
    if (existing) await ctx.db.patch(existing._id, doc);
    else await ctx.db.insert("subscriptions", doc);
  },
});

export const upsertProduct = mutation({
  args: {
    syncKey: v.optional(v.string()),
    businessId: v.string(),
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
    requireSyncKey(args);
    const { syncKey: _sk, ...doc } = args;
    const existing = await ctx.db.query("products").withIndex("by_business_id", (q) => q.eq("businessId", args.businessId).eq("id", args.id)).first();
    if (existing) await ctx.db.patch(existing._id, doc);
    else await ctx.db.insert("products", doc);
  },
});

export const upsertTransaction = mutation({
  args: {
    syncKey: v.optional(v.string()),
    businessId: v.string(),
    id: v.string(),
    receiptNo: v.number(),
    timestamp: v.number(),
    subtotalCents: v.number(),
    discountCents: v.number(),
    taxCents: v.number(),
    totalCents: v.number(),
    currency: v.optional(v.string()),
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
    requireSyncKey(args);
    const { syncKey: _sk, ...doc } = args;
    const existing = await ctx.db.query("transactions").withIndex("by_business_id", (q) => q.eq("businessId", args.businessId).eq("id", args.id)).first();
    if (existing) await ctx.db.patch(existing._id, doc);
    else await ctx.db.insert("transactions", doc);
  },
});

export const upsertTransactionItem = mutation({
  args: {
    syncKey: v.optional(v.string()),
    businessId: v.string(),
    id: v.string(),
    transactionId: v.string(),
    productId: v.string(),
    nameSnapshot: v.string(),
    unitPriceCents: v.number(),
    quantity: v.number(),
    lineTotalCents: v.number(),
  },
  handler: async (ctx, args) => {
    requireSyncKey(args);
    const { syncKey: _sk, ...doc } = args;
    const existing = await ctx.db.query("transaction_items").withIndex("by_business_id", (q) => q.eq("businessId", args.businessId).eq("id", args.id)).first();
    if (existing) await ctx.db.patch(existing._id, doc);
    else await ctx.db.insert("transaction_items", doc);
  },
});

export const upsertCashShift = mutation({
  args: {
    syncKey: v.optional(v.string()),
    businessId: v.string(),
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
    requireSyncKey(args);
    const { syncKey: _sk, ...doc } = args;
    const existing = await ctx.db.query("cash_shifts").withIndex("by_business_id", (q) => q.eq("businessId", args.businessId).eq("id", args.id)).first();
    if (existing) await ctx.db.patch(existing._id, doc);
    else await ctx.db.insert("cash_shifts", doc);
  },
});

export const upsertActivityLog = mutation({
  args: {
    syncKey: v.optional(v.string()),
    businessId: v.string(),
    id: v.string(),
    type: v.string(),
    action: v.string(),
    details: v.string(),
    userId: v.string(),
    managerUserId: v.optional(v.string()),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    requireSyncKey(args);
    const { syncKey: _sk, ...doc } = args;
    const existing = await ctx.db.query("activity_logs").withIndex("by_business_id", (q) => q.eq("businessId", args.businessId).eq("id", args.id)).first();
    if (existing) await ctx.db.patch(existing._id, doc);
    else await ctx.db.insert("activity_logs", doc);
  },
});

export const upsertStockReceipt = mutation({
  args: {
    syncKey: v.optional(v.string()),
    businessId: v.string(),
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
    requireSyncKey(args);
    const { syncKey: _sk, ...doc } = args;
    const existing = await ctx.db.query("stock_receipts").withIndex("by_business_id", (q) => q.eq("businessId", args.businessId).eq("id", args.id)).first();
    if (existing) await ctx.db.patch(existing._id, doc);
    else await ctx.db.insert("stock_receipts", doc);
  },
});

export const upsertStockReceiptItem = mutation({
  args: {
    syncKey: v.optional(v.string()),
    businessId: v.string(),
    id: v.string(),
    stockReceiptId: v.string(),
    productId: v.string(),
    quantity: v.number(),
    unitCostCents: v.number(),
    lineTotalCents: v.number(),
  },
  handler: async (ctx, args) => {
    requireSyncKey(args);
    const { syncKey: _sk, ...doc } = args;
    const existing = await ctx.db.query("stock_receipt_items").withIndex("by_business_id", (q) => q.eq("businessId", args.businessId).eq("id", args.id)).first();
    if (existing) await ctx.db.patch(existing._id, doc);
    else await ctx.db.insert("stock_receipt_items", doc);
  },
});

/** Record last successful sync time for this business (for admin monitoring). */
export const recordSyncHealth = mutation({
  args: {
    syncKey: v.optional(v.string()),
    businessId: v.string(),
  },
  handler: async (ctx, args) => {
    requireSyncKey(args);
    const now = Date.now();
    const existing = await ctx.db.query("business_sync").withIndex("by_business_id", (q) => q.eq("businessId", args.businessId)).first();
    const doc = { businessId: args.businessId, lastSyncAt: now, updatedAt: now };
    if (existing) await ctx.db.patch(existing._id, doc);
    else await ctx.db.insert("business_sync", doc);
  },
});
