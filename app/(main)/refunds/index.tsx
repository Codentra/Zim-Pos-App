import { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/contexts/ThemeContext";
import { getTransactionById } from "@/lib/data/repositories/salesRepo";
import { createFullRefund } from "@/lib/data/repositories/refundsRepo";
import { spacing, borderRadius } from "@/constants/theme";

function formatCents(c: number): string {
  return "$" + (c / 100).toFixed(2);
}

export default function RefundsScreen() {
  const theme = useColors();
  const { user } = useAuth();
  const [receiptNoStr, setReceiptNoStr] = useState("");
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactionPreview, setTransactionPreview] = useState<{ id: string; receiptNo: number; totalCents: number } | null>(null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, padding: spacing.lg, paddingTop: 48, backgroundColor: theme.background },
        title: { fontSize: 22, fontWeight: "700", color: theme.text, marginBottom: spacing.lg },
        label: { fontSize: 14, fontWeight: "600", color: theme.text, marginBottom: spacing.xs },
        input: { borderWidth: 1, borderColor: theme.border, borderRadius: borderRadius.md, padding: spacing.md, fontSize: 18, color: theme.text, backgroundColor: theme.surface, marginBottom: spacing.md },
        button: { backgroundColor: theme.primary, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: "center", marginBottom: spacing.lg },
        refundButton: { backgroundColor: theme.error, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: "center", marginTop: spacing.sm },
        buttonDisabled: { opacity: 0.6 },
        buttonText: { color: theme.primaryText, fontSize: 16, fontWeight: "600" },
        preview: { backgroundColor: theme.surface, padding: spacing.lg, borderRadius: borderRadius.md, borderWidth: 1, borderColor: theme.border },
        previewTitle: { fontSize: 16, fontWeight: "600", color: theme.text },
        previewTotal: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.xs },
        error: { color: theme.error, marginTop: spacing.sm },
      }),
    [theme]
  );

  const handleLookup = async () => {
    setError("");
    setTransactionPreview(null);
    const receiptNo = parseInt(receiptNoStr, 10);
    if (isNaN(receiptNo) || receiptNo < 1) {
      setError("Enter a valid receipt number");
      return;
    }
    setLookupLoading(true);
    try {
      const db = await import("@/lib/data/db").then((m) => m.getDb());
      const row = await db.getFirstAsync<{ id: string; receiptNo: number; totalCents: number }>(
        "SELECT id, receiptNo, totalCents FROM transactions WHERE receiptNo = ? AND deleted = 0 AND isRefund = 0",
        receiptNo
      );
      if (row) setTransactionPreview(row);
      else setError("Sale not found");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally {
      setLookupLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!user || !transactionPreview) return;
    setError("");
    setLoading(true);
    try {
      await createFullRefund({
        originalTransactionId: transactionPreview.id,
        cashierUserId: user.id,
        notes: "Full refund",
      });
      setTransactionPreview(null);
      setReceiptNoStr("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Refund failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Refunds</Text>
      <Text style={styles.label}>Receipt number</Text>
      <TextInput
        style={styles.input}
        value={receiptNoStr}
        onChangeText={setReceiptNoStr}
        placeholder="e.g. 1"
        keyboardType="number-pad"
        placeholderTextColor={theme.textSecondary}
      />
      <TouchableOpacity
        style={[styles.button, lookupLoading && styles.buttonDisabled]}
        onPress={handleLookup}
        disabled={lookupLoading}
      >
        <Text style={styles.buttonText}>{lookupLoading ? "Looking up…" : "Look up sale"}</Text>
      </TouchableOpacity>
      {transactionPreview && (
        <View style={styles.preview}>
          <Text style={styles.previewTitle}>Receipt #{transactionPreview.receiptNo}</Text>
          <Text style={styles.previewTotal}>Total: {formatCents(transactionPreview.totalCents)}</Text>
          <TouchableOpacity
            style={[styles.refundButton, loading && styles.buttonDisabled]}
            onPress={handleRefund}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Processing…" : "Full refund"}</Text>
          </TouchableOpacity>
        </View>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

