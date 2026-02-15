/**
 * Business context. Current business, subscription, boot state.
 */
import React, { createContext, useCallback, useContext, useState } from "react";
import type { Business, Subscription } from "@/lib/domain/types";
import {
  getBusinessId,
  setBusinessId as setBusinessIdRepo,
  isOnboarded,
  setOnboarded as setOnboardedRepo,
} from "@/lib/data/repositories/appStateRepo";
import { getBusinessById } from "@/lib/data/repositories/businessRepo";
import { getSubscriptionByBusinessId } from "@/lib/data/repositories/subscriptionRepo";

type BusinessContextValue = {
  business: Business | null;
  subscription: Subscription | null;
  businessId: string | null;
  onboarded: boolean;
  isReady: boolean;
  load: () => Promise<void>;
  setBusinessId: (id: string) => Promise<void>;
  setOnboarded: (value: boolean) => Promise<void>;
};

const BusinessContext = createContext<BusinessContextValue | null>(null);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [businessId, setBusinessIdState] = useState<string | null>(null);
  const [onboarded, setOnboardedState] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const load = useCallback(async () => {
    try {
      const bid = await getBusinessId();
      setBusinessIdState(bid);
      setOnboardedState(await isOnboarded());
      if (bid) {
        const b = await getBusinessById(bid);
        const s = await getSubscriptionByBusinessId(bid);
        setBusiness(b);
        setSubscription(s);
      } else {
        setBusiness(null);
        setSubscription(null);
      }
    } finally {
      setIsReady(true);
    }
  }, []);

  const setBusinessId = useCallback(async (id: string) => {
    await setBusinessIdRepo(id);
    setBusinessIdState(id);
    const b = await getBusinessById(id);
    const s = await getSubscriptionByBusinessId(id);
    setBusiness(b);
    setSubscription(s);
  }, []);

  const setOnboarded = useCallback(async (value: boolean) => {
    await setOnboardedRepo(value);
    setOnboardedState(value);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const value: BusinessContextValue = {
    business,
    subscription,
    businessId,
    onboarded,
    isReady,
    load,
    setBusinessId,
    setOnboarded,
  };

  return (
    <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>
  );
}

export function useBusiness(): BusinessContextValue {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used within BusinessProvider");
  return ctx;
}
