/**
 * Per-business payment config: storage and internal read/write.
 * Secrets are only readable/writable from other Convex functions (e.g. payment actions, web admin HTTP action).
 */
import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

/** Get payment config for a business. Internal only — use from actions (e.g. create payment, webhooks). */
export const getPaymentConfig = internalQuery({
  args: { businessId: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("payment_configs")
      .withIndex("by_business_id", (q) => q.eq("businessId", args.businessId))
      .first();
    return row ?? null;
  },
});

/** Create or update payment config for a business. Internal only — call from web admin backend (e.g. HTTP action) when you add that. */
export const upsertPaymentConfig = internalMutation({
  args: {
    businessId: v.string(),
    paynowIntegrationId: v.optional(v.string()),
    paynowIntegrationKey: v.optional(v.string()),
    ecocashMerchantId: v.optional(v.string()),
    ecocashMerchantPin: v.optional(v.string()),
    stripeSecretKey: v.optional(v.string()),
    stripeWebhookSecret: v.optional(v.string()),
    stripePublishableKey: v.optional(v.string()),
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
      stripeSecretKey: merge(args.stripeSecretKey, existing?.stripeSecretKey),
      stripeWebhookSecret: merge(args.stripeWebhookSecret, existing?.stripeWebhookSecret),
      stripePublishableKey: merge(args.stripePublishableKey, existing?.stripePublishableKey),
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, doc);
      return existing._id;
    }
    return await ctx.db.insert("payment_configs", doc);
  },
});
