import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const http = httpRouter();

http.route({
  path: "/api/payment-config",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = (await request.json()) as Record<string, unknown>;
      const businessId = body.businessId as string | undefined;
      if (!businessId || typeof businessId !== "string") {
        return new Response(
          JSON.stringify({ error: "Missing businessId" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      await ctx.runMutation(internal.payments.upsertPaymentConfig, {
        businessId,
        paynowIntegrationId: (body.paynowIntegrationId as string) || undefined,
        paynowIntegrationKey: (body.paynowIntegrationKey as string) || undefined,
        ecocashMerchantId: (body.ecocashMerchantId as string) || undefined,
        ecocashMerchantPin: (body.ecocashMerchantPin as string) || undefined,
      });
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(
        JSON.stringify({ error: e instanceof Error ? e.message : "Failed to save" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }),
});

http.route({
  path: "/api/payment-config",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: corsHeaders });
  }),
});

// PayNow webhook: POST with application/x-www-form-urlencoded body (reference, amount, paynowreference, status, hash, ...)
http.route({
  path: "/webhooks/paynow",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.text();
      const result = await ctx.runAction(internal.paymentGateway.verifyAndUpdatePaynowWebhook, { body });
      if (!result.ok) {
        return new Response(result.error ?? "Bad request", { status: 400 });
      }
      return new Response("OK", { status: 200, headers: { "Content-Type": "text/plain" } });
    } catch (e) {
      return new Response("Error", { status: 500 });
    }
  }),
});

// EcoCash webhook: POST (stub – adapt to partner API when available)
http.route({
  path: "/webhooks/ecocash",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.text();
      const result = await ctx.runAction(internal.paymentGateway.handleEcocashWebhook, { body });
      if (!result.ok) {
        return new Response(result.error ?? "Bad request", { status: 400 });
      }
      return new Response("OK", { status: 200, headers: { "Content-Type": "text/plain" } });
    } catch (e) {
      return new Response("Error", { status: 500 });
    }
  }),
});

export default http;
