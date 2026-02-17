/**
 * PayNow / EcoCash: create payment (action) and helpers.
 * Credentials come from payment_configs per business; webhooks in http.ts.
 */
import { v } from "convex/values";
import { action, internalAction, internalMutation, internalQuery, query } from "./_generated/server";
import { internal } from "./_generated/api";

const PAYNOW_INITIATE_URL = "https://www.paynow.co.zw/interface/initiatetransaction";

async function paynowHash(values: Record<string, string>, integrationKey: string): Promise<string> {
  const order = ["id", "reference", "amount", "returnurl", "resulturl", "status"];
  let s = "";
  for (const k of order) {
    if (values[k] !== undefined) s += values[k];
  }
  s += integrationKey;
  const buf = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(s));
  const hex = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex.toUpperCase();
}

function parsePaynowResponse(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of body.split("&")) {
    const i = part.indexOf("=");
    if (i === -1) continue;
    const key = part.slice(0, i).trim();
    const value = decodeURIComponent(part.slice(i + 1).trim());
    out[key.toLowerCase()] = value;
  }
  return out;
}

/** Parse PayNow POST body into ordered [key, decodedValue] for hash validation (order of appearance, exclude hash). */
function parsePaynowStatusBody(body: string): { values: Record<string, string>; hashInputOrder: string[] } {
  const values: Record<string, string> = {};
  const hashInputOrder: string[] = [];
  for (const part of body.split("&")) {
    const i = part.indexOf("=");
    if (i === -1) continue;
    const key = part.slice(0, i).trim();
    const value = decodeURIComponent(part.slice(i + 1).trim());
    const keyLower = key.toLowerCase();
    values[keyLower] = value;
    if (keyLower !== "hash") hashInputOrder.push(value);
  }
  return { values, hashInputOrder };
}

async function paynowVerifyHash(body: string, integrationKey: string): Promise<boolean> {
  const { values, hashInputOrder } = parsePaynowStatusBody(body);
  const receivedHash = values["hash"];
  if (!receivedHash) return false;
  const s = hashInputOrder.join("") + integrationKey;
  const buf = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(s));
  const hex = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex.toUpperCase() === receivedHash.toUpperCase();
}

/** Create a payment request with PayNow or EcoCash. App calls this with resultUrl = Convex site URL + /webhooks/paynow (or ecocash). */
export const createPayment = action({
  args: {
    businessId: v.string(),
    gateway: v.union(v.literal("PAYNOW"), v.literal("ECOCASH")),
    amountCents: v.number(),
    reference: v.string(),
    returnUrl: v.string(),
    resultUrl: v.string(),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const config = await ctx.runQuery(internal.payments.getPaymentConfig, {
      businessId: args.businessId,
    });
    if (!config) {
      return { success: false as const, error: "Payment config not found for business" };
    }

    const amountStr = (args.amountCents / 100).toFixed(2);
    const now = Date.now();

    if (args.gateway === "PAYNOW") {
      const id = config.paynowIntegrationId;
      const key = config.paynowIntegrationKey;
      if (!id || !key) {
        return { success: false as const, error: "PayNow not configured (Integration ID and Key required)" };
      }
      const values: Record<string, string> = {
        id,
        reference: args.reference,
        amount: amountStr,
        returnurl: args.returnUrl,
        resulturl: args.resultUrl,
        status: "Message",
      };
      const hash = await paynowHash(values, key);
      const body = new URLSearchParams({ ...values, hash }).toString();
      const res = await fetch(PAYNOW_INITIATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      const text = await res.text();
      const parsed = parsePaynowResponse(text);
      const status = parsed["status"] ?? "";
      if (status.toLowerCase() === "ok") {
        const paymentUrl = parsed["browserurl"] ?? "";
        const pollUrl = parsed["pollurl"] ?? "";
        await ctx.runMutation(internal.paymentGateway.insertPendingPayment, {
          businessId: args.businessId,
          gateway: "PAYNOW",
          amountCents: args.amountCents,
          reference: args.reference,
          currency: args.currency,
          status: "PENDING",
          paymentUrl,
          pollUrl,
          createdAt: now,
          updatedAt: now,
        });
        return {
          success: true as const,
          paymentUrl,
          pollUrl,
        };
      }
      const errMsg = parsed["error"] ?? text;
      return { success: false as const, error: errMsg };
    }

    if (args.gateway === "ECOCASH") {
      // EcoCash merchant API is typically partner-specific (e.g. SmatPay). Insert pending and return placeholder until credentials/API are set.
      await ctx.runMutation(internal.paymentGateway.insertPendingPayment, {
        businessId: args.businessId,
        gateway: "ECOCASH",
        amountCents: args.amountCents,
        reference: args.reference,
        currency: args.currency,
        status: "PENDING",
        createdAt: now,
        updatedAt: now,
      });
      return {
        success: false as const,
        error:
          "EcoCash create-payment API not yet wired. Add your EcoCash merchant API endpoint and credentials when available.",
      };
    }

    return { success: false as const, error: "Unknown gateway" };
  },
});

export const insertPendingPayment = internalMutation({
  args: {
    businessId: v.string(),
    gateway: v.string(),
    amountCents: v.number(),
    reference: v.string(),
    currency: v.optional(v.string()),
    status: v.string(),
    paymentUrl: v.optional(v.string()),
    pollUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("pending_payments", {
      businessId: args.businessId,
      gateway: args.gateway,
      amountCents: args.amountCents,
      reference: args.reference,
      currency: args.currency,
      status: args.status,
      paymentUrl: args.paymentUrl,
      pollUrl: args.pollUrl,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    });
  },
});

/** Get pending payment status by reference (for app to poll after createPayment). */
export const getPendingPaymentStatus = query({
  args: { reference: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("pending_payments")
      .withIndex("by_reference", (q) => q.eq("reference", args.reference))
      .first();
    return row ? { status: row.status, paymentUrl: row.paymentUrl, pollUrl: row.pollUrl } : null;
  },
});

/** Internal: get pending payment by reference (for webhook lookup). */
export const getPendingPaymentByReference = internalQuery({
  args: { reference: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pending_payments")
      .withIndex("by_reference", (q) => q.eq("reference", args.reference))
      .first();
  },
});

/** Internal: update pending payment status (called from webhooks). */
export const updatePendingPaymentByReference = internalMutation({
  args: {
    reference: v.string(),
    status: v.string(),
    externalId: v.optional(v.string()),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("pending_payments")
      .withIndex("by_reference", (q) => q.eq("reference", args.reference))
      .first();
    if (!row) return null;
    await ctx.db.patch(row._id, {
      status: args.status,
      ...(args.externalId != null && { externalId: args.externalId }),
      updatedAt: args.updatedAt,
    });
    return row._id;
  },
});

/** Internal action: verify PayNow webhook body and update pending payment. Called from http.ts. */
export const verifyAndUpdatePaynowWebhook = internalAction({
  args: { body: v.string() },
  handler: async (ctx, args) => {
    const { values } = parsePaynowStatusBody(args.body);
    const reference = values["reference"];
    if (!reference) return { ok: false, error: "Missing reference" };
    const pending = await ctx.runQuery(internal.paymentGateway.getPendingPaymentByReference, { reference });
    if (!pending) return { ok: false, error: "Pending payment not found" };
    const config = await ctx.runQuery(internal.payments.getPaymentConfig, { businessId: pending.businessId });
    if (!config?.paynowIntegrationKey) return { ok: false, error: "Config not found" };
    const valid = await paynowVerifyHash(args.body, config.paynowIntegrationKey);
    if (!valid) return { ok: false, error: "Invalid hash" };
    const status = values["status"] ?? "Unknown";
    const paynowReference = values["paynowreference"];
    const mapStatus = (s: string) =>
      s === "Paid" || s === "Awaiting Delivery" || s === "Delivered"
        ? "COMPLETED"
        : s === "Cancelled" || s === "Refunded"
          ? "FAILED"
          : "PENDING";
    await ctx.runMutation(internal.paymentGateway.updatePendingPaymentByReference, {
      reference,
      status: mapStatus(status),
      externalId: paynowReference,
      updatedAt: Date.now(),
    });
    return { ok: true };
  },
});

/** Internal action: handle EcoCash webhook (stub – update by reference when partner API sends callback). */
export const handleEcocashWebhook = internalAction({
  args: { body: v.string() },
  handler: async (ctx, args) => {
    const params = new URLSearchParams(args.body);
    const reference = params.get("reference") ?? params.get("Reference");
    if (!reference) return { ok: false, error: "Missing reference" };
    const pending = await ctx.runQuery(internal.paymentGateway.getPendingPaymentByReference, { reference });
    if (!pending) return { ok: false, error: "Pending payment not found" };
    const status = params.get("status") ?? params.get("Status") ?? "PENDING";
    const completed = ["completed", "paid", "success"].includes(status.toLowerCase());
    await ctx.runMutation(internal.paymentGateway.updatePendingPaymentByReference, {
      reference,
      status: completed ? "COMPLETED" : "PENDING",
      updatedAt: Date.now(),
    });
    return { ok: true };
  },
});
