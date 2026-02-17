/**
 * Multi-currency formatting. Amounts are stored in base currency (cents).
 * Display uses defaultCurrency and exchange rate when different from base.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useQuery } from "convex/react";
import { useBusiness } from "@/contexts/BusinessContext";
import { getDb } from "@/lib/data/db";
import { api } from "@/lib/convexApi";

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  ZWL: "Z$",
  ZAR: "R",
  BWP: "P",
};

export const DEFAULT_CURRENCY_LABEL = "USD ($)";
const LABEL_TO_CODE: Record<string, string> = {
  "USD ($)": "USD",
  "ZWL (Z$)": "ZWL",
  "ZAR (R)": "ZAR",
  "BWP (P)": "BWP",
};

/** Format cents (in base currency) for display. If rate is provided and display is not base, converts: amount = (cents/100) * rate. */
export function formatCentsInCurrency(
  cents: number,
  displayCurrencyCode: string,
  baseCurrencyCode: string,
  rate?: number
): string {
  const symbol = CURRENCY_SYMBOLS[displayCurrencyCode] ?? displayCurrencyCode;
  let amount = cents / 100;
  if (displayCurrencyCode !== baseCurrencyCode && rate != null && rate > 0) {
    amount *= rate;
  }
  return symbol + amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Map app_meta defaultCurrency label to code (e.g. "USD ($)" -> "USD"). */
export function labelToCode(label: string): string {
  return LABEL_TO_CODE[label] ?? "USD";
}

/** Get display label from app_meta and exchange rates from Convex, then format. */
export function formatCentsWithRates(
  cents: number,
  displayCurrencyLabel: string,
  exchangeRates: { baseCurrency: string; rates: Record<string, number> } | null | undefined
): string {
  const code = labelToCode(displayCurrencyLabel);
  const base = exchangeRates?.baseCurrency ?? "USD";
  const rate = code !== base ? exchangeRates?.rates[code] : 1;
  return formatCentsInCurrency(cents, code, base, rate);
}

/** Simple fallback when Convex currency API is not deployed or fails. */
export function simpleFormatCents(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}

/** Hook: format cents using business base currency, exchange rates, and app default display currency. May throw if Convex currency API is not deployed. */
export function useCurrencyFormat(): (cents: number) => string {
  const { businessId } = useBusiness();
  const exchangeRates = useQuery(api.currency.getExchangeRates, businessId ? { businessId } : "skip");
  const [displayLabel, setDisplayLabel] = useState(DEFAULT_CURRENCY_LABEL);

  useEffect(() => {
    getDb()
      .then((db) => db.getFirstAsync<{ value: string }>("SELECT value FROM app_meta WHERE key = ?", "defaultCurrency"))
      .then((r) => {
        if (r?.value) setDisplayLabel(r.value);
      });
  }, []);

  return useCallback(
    (cents: number) => formatCentsWithRates(cents, displayLabel, exchangeRates),
    [displayLabel, exchangeRates]
  );
}

/** Context for currency formatter so sale screens can use a fallback when Convex currency API is missing. */
export type CurrencyFormatter = (cents: number) => string;
const CurrencyFormatContext = createContext<CurrencyFormatter>(simpleFormatCents);

export function useCurrencyFormatSafe(): CurrencyFormatter {
  return useContext(CurrencyFormatContext);
}

/** Wraps children and provides a currency formatter; uses Convex when available, otherwise simple $ format. */
export function CurrencyFormatProvider(props: { children: React.ReactNode }) {
  const [formatter, setFormatter] = useState<CurrencyFormatter>(() => simpleFormatCents);
  const [errored, setErrored] = useState(false);
  const Provider = CurrencyFormatContext.Provider;
  return (
    <Provider value={formatter}>
      {!errored ? (
        <CurrencyErrorBoundary onError={() => setErrored(true)}>
          <CurrencyFormatLoader onReady={setFormatter} />
        </CurrencyErrorBoundary>
      ) : null}
      {props.children}
    </Provider>
  );
}

function CurrencyFormatLoader({ onReady }: { onReady: (f: CurrencyFormatter) => void }) {
  const formatCents = useCurrencyFormat();
  useEffect(() => {
    // Pass updater ()=>formatCents so React doesn't call formatCents(prevState) as setState updater
    onReady(() => formatCents);
  }, [formatCents, onReady]);
  return null;
}

class CurrencyErrorBoundary extends React.Component<
  { onError: () => void; children: React.ReactNode },
  Record<string, never>
> {
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.props.children;
  }
}
