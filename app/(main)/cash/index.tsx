import { useCallback, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthContext";
import { getActiveShift, openShift, closeShift } from "@/lib/data/repositories/cashRepo";
import type { CashShift } from "@/lib/domain/types";
import { colors, spacing, borderRadius } from "@/constants/theme";

function formatCents(c: number): string {
  return "$" + (c / 100).toFixed(2);
}

export default function CashManagementScreen() {
  const { user } = useAuth();
  const [shift, setShift] = useState<CashShift | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFloatStr, setOpenFloatStr] = useState("");
  const [actualCashStr, setActualCashStr] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getActiveShift().then((s) => {
        if (!cancelled) setShift(s);
      }).finally(() => { if (!cancelled) setLoading(false); });
      return () => { cancelled = true; };
    }, [])
  );

  const handleOpenShift = async () => {
    if (!user) return;
    setError("");
    const float = Math.round(parseFloat(openFloatStr || "0") * 100);
    if (float < 0) {
      setError("Enter a valid opening float");
      return;
    }
    setActionLoading(true);
    try {
      const s = await openShift({ openingFloatCents: float, userId: user.id });
      setShift(s);
      setOpenFloatStr("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to open shift");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseShift = async () => {
    if (!user || !shift) return;
    setError("");
    const actual = Math.round(parseFloat(actualCashStr || "0") * 100);
    if (actual < 0) {
      setError("Enter actual cash count");
      return;
    }
    setActionLoading(true);
    try {
      await closeShift({
        shiftId: shift.id,
        actualCashCents: actual,
        closedByUserId: user.id,
      });
      setShift(null);
      setActualCashStr("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to close shift");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Text style={styles.loading}>Loading…</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Cash Management</Text>
      {shift ? (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Shift open</Text>
            <Text style={styles.meta}>Opened {new Date(shift.openedAt).toLocaleString()}</Text>
            <Text style={styles.meta}>Opening float: {formatCents(shift.openingFloatCents)}</Text>
          </View>
          <Text style={styles.label}>Actual cash count to close</Text>
          <TextInput
            style={styles.input}
            value={actualCashStr}
            onChangeText={setActualCashStr}
            placeholder="0.00"
            keyboardType="decimal-pad"
            placeholderTextColor={colors.light.textSecondary}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={[styles.button, styles.closeButton, actionLoading && styles.buttonDisabled]}
            onPress={handleCloseShift}
            disabled={actionLoading}
          >
            <Text style={styles.buttonText}>{actionLoading ? "Closing…" : "Close shift"}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>Opening float</Text>
          <TextInput
            style={styles.input}
            value={openFloatStr}
            onChangeText={setOpenFloatStr}
            placeholder="0.00"
            keyboardType="decimal-pad"
            placeholderTextColor={colors.light.textSecondary}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={[styles.button, actionLoading && styles.buttonDisabled]}
            onPress={handleOpenShift}
            disabled={actionLoading}
          >
            <Text style={styles.buttonText}>{actionLoading ? "Opening…" : "Open shift"}</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  content: { padding: spacing.lg, paddingTop: 48 },
  title: { fontSize: 22, fontWeight: "700", color: colors.light.text, marginBottom: spacing.lg },
  loading: { padding: spacing.lg, color: colors.light.textSecondary },
  card: { backgroundColor: colors.light.surface, padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.light.border },
  cardTitle: { fontSize: 16, fontWeight: "600", color: colors.light.text },
  meta: { fontSize: 14, color: colors.light.textSecondary, marginTop: spacing.xs },
  label: { fontSize: 14, fontWeight: "600", color: colors.light.text, marginBottom: spacing.xs },
  input: { borderWidth: 1, borderColor: colors.light.border, borderRadius: borderRadius.md, padding: spacing.md, fontSize: 18, color: colors.light.text, marginBottom: spacing.md },
  error: { color: colors.light.error, marginBottom: spacing.sm },
  button: { backgroundColor: colors.light.primary, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: "center" },
  closeButton: { backgroundColor: colors.light.error },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.light.primaryText, fontSize: 16, fontWeight: "600" },
});
