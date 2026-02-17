/**
 * Admin-only queries for the web admin dashboard.
 * App: payment setup (owners save their own PayNow/EcoCash credentials).
 */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** List all businesses (for web admin dashboard). */
export const listBusinesses = query({
  args: {},
  handler: async (ctx) => {
    const businesses = await ctx.db.query("businesses").collect();
    return businesses
      .filter((b) => !b.deleted)
      .map(({ _id, _creationTime, ...b }) => b)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

/** Get one business by id (for payment setup page). */
export const getBusiness = query({
  args: { businessId: v.string() },
  handler: async (ctx, args) => {
    const b = await ctx.db
      .query("businesses")
      .withIndex("by_stable_id", (q) => q.eq("id", args.businessId))
      .first();
    if (!b || b.deleted) return null;
    const { _id, _creationTime, ...rest } = b;
    return rest;
  },
});

/** Payment config for admin UI only: IDs for pre-fill, booleans for secrets (never return actual keys). */
export const getPaymentConfigForAdmin = query({
  args: { businessId: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("payment_configs")
      .withIndex("by_business_id", (q) => q.eq("businessId", args.businessId))
      .first();
    if (!row) return null;
    return {
      paynowIntegrationId: row.paynowIntegrationId ?? null,
      paynowConfigured: !!row.paynowIntegrationKey,
      ecocashMerchantId: row.ecocashMerchantId ?? null,
      ecocashConfigured: !!row.ecocashMerchantPin,
    };
  },
});

/** App: business owner saves their own PayNow/EcoCash credentials. Call with current user's businessId only. */
export const saveMyPaymentConfig = mutation({
  args: {
    businessId: v.string(),
    paynowIntegrationId: v.optional(v.string()),
    paynowIntegrationKey: v.optional(v.string()),
    ecocashMerchantId: v.optional(v.string()),
    ecocashMerchantPin: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("payment_configs")
      .withIndex("by_business_id", (q) => q.eq("businessId", args.businessId))
      .first();

    const merge = <T>(arg: T | undefined, current: T | undefined): T | undefined =>
      arg !== undefined ? arg : current;

    const doc = {
      businessId: args.businessId,
      paynowIntegrationId: merge(args.paynowIntegrationId, existing?.paynowIntegrationId),
      paynowIntegrationKey: merge(args.paynowIntegrationKey, existing?.paynowIntegrationKey),
      ecocashMerchantId: merge(args.ecocashMerchantId, existing?.ecocashMerchantId),
      ecocashMerchantPin: merge(args.ecocashMerchantPin, existing?.ecocashMerchantPin),
      stripeSecretKey: existing?.stripeSecretKey,
      stripeWebhookSecret: existing?.stripeWebhookSecret,
      stripePublishableKey: existing?.stripePublishableKey,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, doc);
      return existing._id;
    }
    return await ctx.db.insert("payment_configs", doc);
  },
});
