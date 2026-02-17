/**
 * Multi-currency: base currency per business and exchange rates.
 * Rates are "1 base unit = rate units of toCurrency" (e.g. 1 USD = 15000 ZWL).
 */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** Get base currency and all rates for a business (for display conversion). */
export const getExchangeRates = query({
  args: { businessId: v.string() },
  handler: async (ctx, args) => {
    const biz = await ctx.db
      .query("businesses")
      .withIndex("by_stable_id", (q) => q.eq("id", args.businessId))
      .first();
    const baseCurrency = biz?.baseCurrency ?? "USD";
    const rows = await ctx.db
      .query("exchange_rates")
      .withIndex("by_business_id", (q) => q.eq("businessId", args.businessId))
      .collect();
    const rates: Record<string, number> = {};
    for (const r of rows) rates[r.toCurrency] = r.rate;
    return { baseCurrency, rates };
  },
});

/** App: set exchange rate for a currency (e.g. 1 USD = 15000 ZWL → setExchangeRate(businessId, "ZWL", 15000)). */
export const setExchangeRate = mutation({
  args: {
    businessId: v.string(),
    toCurrency: v.string(),
    rate: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.rate <= 0) throw new Error("Rate must be positive");
    const now = Date.now();
    const existing = await ctx.db
      .query("exchange_rates")
      .withIndex("by_business_currency", (q) =>
        q.eq("businessId", args.businessId).eq("toCurrency", args.toCurrency)
      )
      .first();
    const doc = {
      businessId: args.businessId,
      toCurrency: args.toCurrency,
      rate: args.rate,
      updatedAt: now,
    };
    if (existing) await ctx.db.patch(existing._id, doc);
    else await ctx.db.insert("exchange_rates", doc);
  },
});
