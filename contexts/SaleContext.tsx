/**
 * Cart and current sale flow state (New Sale → Payment → Receipt).
 */
import React, { createContext, useCallback, useContext, useState } from "react";
import type { Transaction, TransactionItem } from "@/lib/domain/types";
import type { CartItem } from "@/lib/data/repositories/salesRepo";

type SaleContextValue = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  lastTransaction: { transaction: Transaction; items: TransactionItem[] } | null;
  setLastTransaction: (t: { transaction: Transaction; items: TransactionItem[] } | null) => void;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  setDiscountCents: (c: number) => void;
};

const SaleContext = createContext<SaleContextValue | null>(null);

function cartSubtotal(cart: CartItem[]): number {
  return cart.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
}

export function SaleProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountCents, setDiscountCents] = useState(0);
  const [lastTransaction, setLastTransaction] = useState<{
    transaction: Transaction;
    items: TransactionItem[];
  } | null>(null);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const i = prev.findIndex((p) => p.productId === item.productId);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + item.quantity };
        return next;
      }
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((p) => p.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((p) => p.productId !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, quantity } : p))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const subtotalCents = cartSubtotal(cart);
  const totalCents = Math.max(0, subtotalCents - discountCents);

  const value: SaleContextValue = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    lastTransaction,
    setLastTransaction,
    subtotalCents,
    discountCents,
    totalCents,
    setDiscountCents,
  };

  return <SaleContext.Provider value={value}>{children}</SaleContext.Provider>;
}

export function useSale(): SaleContextValue {
  const ctx = useContext(SaleContext);
  if (!ctx) throw new Error("useSale must be used within SaleProvider");
  return ctx;
}
