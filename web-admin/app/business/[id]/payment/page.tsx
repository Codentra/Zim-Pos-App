"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/api";

export default function PaymentSetupPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const [businessId, setBusinessId] = useState("");
  const [paynowIntegrationId, setPaynowIntegrationId] = useState("");
  const [paynowIntegrationKey, setPaynowIntegrationKey] = useState("");
  const [ecocashMerchantId, setEcocashMerchantId] = useState("");
  const [ecocashMerchantPin, setEcocashMerchantPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    const p = Promise.resolve(params);
    p.then((resolved) => setBusinessId(resolved.id));
  }, [params]);
  const id = businessId;

  const business = useQuery(
    api.admin.getBusiness,
    id ? { businessId: id } : "skip"
  );
  const config = useQuery(
    api.admin.getPaymentConfigForAdmin,
    id ? { businessId: id } : "skip"
  );

  const didPrefill = useRef(false);
  useEffect(() => {
    if (!config || didPrefill.current) return;
    didPrefill.current = true;
    setPaynowIntegrationId(config.paynowIntegrationId ?? "");
    setEcocashMerchantId(config.ecocashMerchantId ?? "");
  }, [config]);

  const save = useCallback(async () => {
    if (!id) return;
    setSaving(true);
    setMessage(null);
    const siteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
    if (!siteUrl) {
      setMessage({ type: "error", text: "Missing NEXT_PUBLIC_CONVEX_SITE_URL" });
      setSaving(false);
      return;
    }
    try {
      const res = await fetch(`${siteUrl}/api/payment-config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: id,
          paynowIntegrationId: paynowIntegrationId.trim() || undefined,
          paynowIntegrationKey: paynowIntegrationKey.trim() || undefined,
          ecocashMerchantId: ecocashMerchantId.trim() || undefined,
          ecocashMerchantPin: ecocashMerchantPin.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Failed to save" });
      } else {
        setMessage({ type: "ok", text: "Saved." });
        setPaynowIntegrationKey("");
        setEcocashMerchantPin("");
      }
    } catch (e) {
      setMessage({
        type: "error",
        text: e instanceof Error ? e.message : "Request failed",
      });
    } finally {
      setSaving(false);
    }
  }, [
    id,
    paynowIntegrationId,
    paynowIntegrationKey,
    ecocashMerchantId,
    ecocashMerchantPin,
  ]);

  if (!id) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }
  if (business === null) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <p className="text-zinc-600">Business not found.</p>
        <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  if (business === undefined) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }

  const b = business;

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <header className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">Payment setup</h1>
        <p className="text-zinc-600">
          {b.name} · {b.ownerName}
        </p>
      </header>

      <section className="max-w-md space-y-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-zinc-800">PayNow</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Integration ID
            </label>
            <input
              type="text"
              value={paynowIntegrationId}
              onChange={(e) => setPaynowIntegrationId(e.target.value)}
              placeholder="From PayNow merchant dashboard"
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Integration Key
            </label>
            <input
              type="password"
              value={paynowIntegrationKey}
              onChange={(e) => setPaynowIntegrationKey(e.target.value)}
              placeholder={config?.paynowConfigured ? "Leave blank to keep current" : "From PayNow email"}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900"
            />
          </div>
        </div>

        <h2 className="text-lg font-medium text-zinc-800">EcoCash</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Merchant ID
            </label>
            <input
              type="text"
              value={ecocashMerchantId}
              onChange={(e) => setEcocashMerchantId(e.target.value)}
              placeholder="From EcoCash merchant account"
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Merchant PIN / API key
            </label>
            <input
              type="password"
              value={ecocashMerchantPin}
              onChange={(e) => setEcocashMerchantPin(e.target.value)}
              placeholder={config?.ecocashConfigured ? "Leave blank to keep current" : "From EcoCash"}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900"
            />
          </div>
        </div>

        {message && (
          <p
            className={
              message.type === "ok"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {message.text}
          </p>
        )}

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </section>
    </div>
  );
}
