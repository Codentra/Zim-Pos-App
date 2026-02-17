import { useState, useMemo, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { useRouter } from "expo-router";
import { useAction, useQuery } from "convex/react";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { useSale } from "@/contexts/SaleContext";
import { useColors } from "@/contexts/ThemeContext";
import { useCurrencyFormatSafe } from "@/lib/currencyFormat";
import { createSale } from "@/lib/data/repositories/salesRepo";
import { api } from "@/lib/convexApi";
import type { PaymentMethod } from "@/lib/domain/types";
import { spacing, borderRadius } from "@/constants/theme";

const METHODS: PaymentMethod[] = ["CASH", "PAYNOW", "ECOCASH", "ONEMONEY", "ZIPIT"];

const GATEWAY_METHODS: PaymentMethod[] = ["PAYNOW", "ECOCASH"];
const isGatewayPayment = (m: PaymentMethod) => GATEWAY_METHODS.includes(m);

const CONVEX_SITE_URL = process.env.EXPO_PUBLIC_CONVEX_SITE_URL ?? "";

export default function PaymentScreen() {
  const theme = useColors();
  const router = useRouter();
  const formatCents = useCurrencyFormatSafe();
  const { user } = useAuth();
  const { businessId } = useBusiness();
  const {
    cart,
    totalCents,
    discountCents,
    setLastTransaction,
    clearCart,
  } = useSale();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [amountTenderedStr, setAmountTenderedStr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingReference, setPendingReference] = useState<string | null>(null);
  const completedRef = useRef<string | null>(null);

  const createPaymentAction = useAction(api.paymentGateway.createPayment);
  const pendingStatus = useQuery(
    api.paymentGateway.getPendingPaymentStatus,
    pendingReference ? { reference: pendingReference } : "skip"
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, padding: spacing.lg, paddingTop: 48, backgroundColor: theme.background },
        title: { fontSize: 22, fontWeight: "700", color: theme.text, marginBottom: spacing.sm },
        total: { fontSize: 20, fontWeight: "600", color: theme.text, marginBottom: spacing.lg },
        label: { fontSize: 14, fontWeight: "600", color: theme.text, marginTop: spacing.md, marginBottom: spacing.xs },
        methodRow: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: spacing.sm },
        methodBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: theme.border },
        methodBtnActive: { backgroundColor: theme.primary, borderColor: theme.primary },
        methodBtnText: { fontSize: 14, color: theme.text },
        methodBtnTextActive: { color: theme.primaryText },
        input: { borderWidth: 1, borderColor: theme.border, borderRadius: borderRadius.md, padding: spacing.md, fontSize: 18, color: theme.text, backgroundColor: theme.surface },
        change: { fontSize: 16, color: theme.success, marginTop: spacing.sm },
        error: { color: theme.error, marginTop: spacing.sm },
        confirmBtn: { backgroundColor: theme.primary, paddingVertical: spacing.md, borderRadius: borderRadius.xl, alignItems: "center", marginTop: spacing.xl, minHeight: 48 },
        confirmBtnDisabled: { opacity: 0.6 },
        confirmBtnText: { color: theme.primaryText, fontSize: 16, fontWeight: "600" },
        waiting: { marginTop: spacing.lg, padding: spacing.md, backgroundColor: theme.surface, borderRadius: borderRadius.md, color: theme.text, fontSize: 14 },
        cancelBtn: { marginTop: spacing.sm, paddingVertical: spacing.sm, alignItems: "center" },
        cancelBtnText: { color: theme.textSecondary, fontSize: 16 },
      }),
    [theme]
  );

  if (!user || cart.length === 0) {
    router.replace("/(main)/sale");
    return null;
  }

  const amountTenderedCents = Math.round(parseFloat(amountTenderedStr || "0") * 100);
  const changeCents = paymentMethod === "CASH" ? Math.max(0, amountTenderedCents - totalCents) : 0;

  // When gateway payment completes, create sale and go to receipt
  useEffect(() => {
    if (!pendingReference || !pendingStatus) return;
    if (pendingStatus.status === "FAILED") {
      setError("Payment was cancelled or failed.");
      setPendingReference(null);
      return;
    }
    if (
      pendingStatus.status !== "COMPLETED" ||
      !user ||
      cart.length === 0 ||
      completedRef.current === pendingReference
    )
      return;
    completedRef.current = pendingReference;
    (async () => {
      try {
        const { transaction, items } = await createSale({
          items: cart,
          discountCents,
          paymentMethod,
          amountTenderedCents: totalCents,
          changeGivenCents: 0,
          cashierUserId: user.id,
        });
        setLastTransaction({ transaction, items });
        clearCart();
        setPendingReference(null);
        router.replace("/(main)/sale/receipt");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Sale failed");
        setPendingReference(null);
      }
    })();
  }, [pendingReference, pendingStatus?.status, user, cart.length, discountCents, paymentMethod, totalCents]);

  const handleConfirm = async () => {
    setError("");
    if (paymentMethod === "CASH" && amountTenderedCents < totalCents) {
      setError("Amount tendered is less than total");
      return;
    }

    if (isGatewayPayment(paymentMethod)) {
      if (!businessId || !CONVEX_SITE_URL) {
        setError("Payment gateway not configured. Set EXPO_PUBLIC_CONVEX_SITE_URL.");
        return;
      }
      setLoading(true);
      const reference = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const gateway = paymentMethod === "PAYNOW" ? "PAYNOW" : "ECOCASH";
      const resultUrl = `${CONVEX_SITE_URL.replace(/\/$/, "")}/webhooks/${gateway.toLowerCase()}`;
      const returnUrl = `${CONVEX_SITE_URL.replace(/\/$/, "")}/payment-return`;
      try {
        const result = await createPaymentAction({
          businessId,
          gateway,
          amountCents: totalCents,
          reference,
          returnUrl,
          resultUrl,
        });
        if (!result.success) {
          setError(result.error ?? "Payment request failed");
          setLoading(false);
          return;
        }
        if (result.paymentUrl) {
          setPendingReference(reference);
          await Linking.openURL(result.paymentUrl);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Payment request failed");
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { transaction, items } = await createSale({
        items: cart,
        discountCents,
        paymentMethod,
        amountTenderedCents: paymentMethod === "CASH" ? amountTenderedCents : totalCents,
        changeGivenCents: changeCents,
        cashierUserId: user.id,
      });
      setLastTransaction({ transaction, items });
      clearCart();
      router.replace("/(main)/sale/receipt");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sale failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>
      <Text style={styles.total}>Total: {formatCents(totalCents)}</Text>

      <Text style={styles.label}>Payment method</Text>
      <View style={styles.methodRow}>
        {METHODS.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.methodBtn, paymentMethod === m && styles.methodBtnActive]}
            onPress={() => setPaymentMethod(m)}
          >
            <Text style={[styles.methodBtnText, paymentMethod === m && styles.methodBtnTextActive]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {paymentMethod === "CASH" && (
        <>
          <Text style={styles.label}>Amount tendered</Text>
          <TextInput
            style={styles.input}
            value={amountTenderedStr}
            onChangeText={setAmountTenderedStr}
            placeholder="0.00"
            keyboardType="decimal-pad"
            placeholderTextColor={theme.textSecondary}
          />
          {amountTenderedCents >= totalCents && (
            <Text style={styles.change}>Change: {formatCents(changeCents)}</Text>
          )}
        </>
      )}

      {pendingReference ? (
        <>
          <Text style={styles.waiting}>Waiting for payment… Complete payment in the browser then return here.</Text>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setPendingReference(null)}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.confirmBtn, (loading || pendingReference) && styles.confirmBtnDisabled]}
        onPress={handleConfirm}
        disabled={
          loading ||
          !!pendingReference ||
          (paymentMethod === "CASH" && amountTenderedCents < totalCents)
        }
      >
        <Text style={styles.confirmBtnText}>
          {pendingReference
            ? "Waiting…"
            : loading
              ? "Processing…"
              : isGatewayPayment(paymentMethod)
                ? `Pay with ${paymentMethod}`
                : "Confirm sale"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

