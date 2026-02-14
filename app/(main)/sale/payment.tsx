import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useSale } from "@/contexts/SaleContext";
import { createSale } from "@/lib/data/repositories/salesRepo";
import type { PaymentMethod } from "@/lib/domain/types";
import { colors, spacing, borderRadius } from "@/constants/theme";

const METHODS: PaymentMethod[] = ["CASH", "ECOCASH", "ONEMONEY", "ZIPIT"];

function formatCents(c: number): string {
  return "$" + (c / 100).toFixed(2);
}

export default function PaymentScreen() {
  const router = useRouter();
  const { user } = useAuth();
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

  if (!user || cart.length === 0) {
    router.replace("/(main)/sale");
    return null;
  }

  const amountTenderedCents = Math.round(parseFloat(amountTenderedStr || "0") * 100);
  const changeCents = paymentMethod === "CASH" ? Math.max(0, amountTenderedCents - totalCents) : 0;

  const handleConfirm = async () => {
    setError("");
    if (paymentMethod === "CASH" && amountTenderedCents < totalCents) {
      setError("Amount tendered is less than total");
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
            placeholderTextColor={colors.light.textSecondary}
          />
          {amountTenderedCents >= totalCents && (
            <Text style={styles.change}>Change: {formatCents(changeCents)}</Text>
          )}
        </>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.confirmBtn, loading && styles.confirmBtnDisabled]}
        onPress={handleConfirm}
        disabled={loading || (paymentMethod === "CASH" && amountTenderedCents < totalCents)}
      >
        <Text style={styles.confirmBtnText}>{loading ? "Processing…" : "Confirm sale"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, paddingTop: 48, backgroundColor: colors.light.background },
  title: { fontSize: 22, fontWeight: "700", color: colors.light.text, marginBottom: spacing.sm },
  total: { fontSize: 20, fontWeight: "600", color: colors.light.text, marginBottom: spacing.lg },
  label: { fontSize: 14, fontWeight: "600", color: colors.light.text, marginTop: spacing.md, marginBottom: spacing.xs },
  methodRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  methodBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.light.border },
  methodBtnActive: { backgroundColor: colors.light.primary, borderColor: colors.light.primary },
  methodBtnText: { fontSize: 14, color: colors.light.text },
  methodBtnTextActive: { color: colors.light.primaryText },
  input: { borderWidth: 1, borderColor: colors.light.border, borderRadius: borderRadius.md, padding: spacing.md, fontSize: 18, color: colors.light.text },
  change: { fontSize: 16, color: colors.light.success, marginTop: spacing.sm },
  error: { color: colors.light.error, marginTop: spacing.sm },
  confirmBtn: { backgroundColor: colors.light.primary, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: "center", marginTop: spacing.xl },
  confirmBtnDisabled: { opacity: 0.6 },
  confirmBtnText: { color: colors.light.primaryText, fontSize: 16, fontWeight: "600" },
});
