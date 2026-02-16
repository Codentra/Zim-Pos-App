import { useCallback, useState, useMemo } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/contexts/ThemeContext";
import { getActiveShift, openShift, closeShift } from "@/lib/data/repositories/cashRepo";
import type { CashShift } from "@/lib/domain/types";
import { spacing, borderRadius } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function formatCents(c: number): string {
  return "$" + (c / 100).toFixed(2);
}

export default function CashManagementScreen() {
  const theme = useColors();
  const { user } = useAuth();
  const [shift, setShift] = useState<CashShift | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFloatStr, setOpenFloatStr] = useState("");
  const [actualCashStr, setActualCashStr] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        content: { padding: spacing.lg, paddingTop: 48 },
        title: { fontSize: 22, fontWeight: "700", color: theme.text, marginBottom: spacing.lg },
        loading: { padding: spacing.lg, color: theme.textSecondary },
        card: { marginBottom: spacing.lg },
        cardTitle: { fontSize: 16, fontWeight: "600", color: theme.text },
        meta: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.xs },
        label: { fontSize: 14, fontWeight: "600", color: theme.text, marginBottom: spacing.xs },
        input: { borderWidth: 1, borderColor: theme.border, borderRadius: borderRadius.lg, padding: spacing.md, fontSize: 18, color: theme.text, backgroundColor: theme.inputBackground, marginBottom: spacing.md },
        error: { color: theme.error, marginBottom: spacing.sm },
        actionBtn: { marginTop: spacing.md, minHeight: 48 },
      }),
    [theme]
  );

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
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Shift open</Text>
            <Text style={styles.meta}>Opened {new Date(shift.openedAt).toLocaleString()}</Text>
            <Text style={styles.meta}>Opening float: {formatCents(shift.openingFloatCents)}</Text>
          </Card>
          <Text style={styles.label}>Actual cash count to close</Text>
          <TextInput
            style={styles.input}
            value={actualCashStr}
            onChangeText={setActualCashStr}
            placeholder="0.00"
            keyboardType="decimal-pad"
            placeholderTextColor={theme.textSecondary}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            title={actionLoading ? "Closing…" : "Close shift"}
            onPress={handleCloseShift}
            loading={actionLoading}
            disabled={actionLoading}
            variant="destructive"
            style={styles.actionBtn}
          />
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
            placeholderTextColor={theme.textSecondary}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            title={actionLoading ? "Opening…" : "Open shift"}
            onPress={handleOpenShift}
            loading={actionLoading}
            disabled={actionLoading}
            style={styles.actionBtn}
          />
        </>
      )}
    </ScrollView>
  );
}

