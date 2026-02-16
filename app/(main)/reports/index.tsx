import { useCallback, useState, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useColors } from "@/contexts/ThemeContext";
import {
  getSalesByDay,
  getPaymentMethodBreakdown,
  getTopProducts,
  getLowStockProducts,
} from "@/lib/data/repositories/reportsRepo";
import type { DailySalesRow, PaymentMethodRow, TopProductRow } from "@/lib/data/repositories/reportsRepo";
import { spacing, borderRadius } from "@/constants/theme";

function formatCents(c: number): string {
  return "$" + (c / 100).toFixed(2);
}

export default function ReportsScreen() {
  const theme = useColors();
  const [days] = useState(7);
  const [dailySales, setDailySales] = useState<DailySalesRow[]>([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState<PaymentMethodRow[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductRow[]>([]);
  const [lowStock, setLowStock] = useState<{ id: string; name: string; stock: number; lowStockThreshold: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        content: { padding: spacing.lg, paddingTop: 48, paddingBottom: spacing.xl * 2 },
        title: { fontSize: 22, fontWeight: "700", color: theme.text, marginBottom: spacing.lg },
        loading: { padding: spacing.lg, color: theme.textSecondary },
        sectionTitle: { fontSize: 16, fontWeight: "600", color: theme.text, marginTop: spacing.lg, marginBottom: spacing.sm },
        card: { backgroundColor: theme.surface, padding: spacing.lg, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: theme.border, marginBottom: spacing.md },
        row: { flexDirection: "row" as const, justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.xs },
        rowLabel: { fontSize: 14, color: theme.text, flex: 1 },
        rowValue: { fontSize: 14, color: theme.textSecondary },
        lowStockValue: { fontSize: 14, color: theme.error },
        empty: { fontSize: 14, color: theme.textSecondary },
      }),
    [theme]
  );

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      Promise.all([
        getSalesByDay(days),
        getPaymentMethodBreakdown(days),
        getTopProducts(days, 10),
        getLowStockProducts(),
      ]).then(([daily, payment, top, low]) => {
        if (!cancelled) {
          setDailySales(daily);
          setPaymentBreakdown(payment);
          setTopProducts(top);
          setLowStock(low);
        }
      }).finally(() => { if (!cancelled) setLoading(false); });
      return () => { cancelled = true; };
    }, [days])
  );

  if (loading) return <Text style={styles.loading}>Loading reports…</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Reports (last {days} days)</Text>

      <Text style={styles.sectionTitle}>Sales by day</Text>
      <View style={styles.card}>
        {dailySales.length === 0 ? (
          <Text style={styles.empty}>No sales</Text>
        ) : (
          dailySales.map((row) => (
            <View key={row.date} style={styles.row}>
              <Text style={styles.rowLabel}>{row.date}</Text>
              <Text style={styles.rowValue}>{row.transactionCount} sales · {formatCents(row.totalCents)}</Text>
            </View>
          ))
        )}
      </View>

      <Text style={styles.sectionTitle}>Payment methods</Text>
      <View style={styles.card}>
        {paymentBreakdown.map((row) => (
          <View key={row.paymentMethod} style={styles.row}>
            <Text style={styles.rowLabel}>{row.paymentMethod}</Text>
            <Text style={styles.rowValue}>{row.count} · {formatCents(row.totalCents)}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Top products</Text>
      <View style={styles.card}>
        {topProducts.map((row, i) => (
          <View key={row.productId} style={styles.row}>
            <Text style={styles.rowLabel}>{i + 1}. {row.nameSnapshot}</Text>
            <Text style={styles.rowValue}>qty {row.quantity} · {formatCents(row.totalCents)}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Low stock</Text>
      <View style={styles.card}>
        {lowStock.length === 0 ? (
          <Text style={styles.empty}>None</Text>
        ) : (
          lowStock.map((row) => (
            <View key={row.id} style={styles.row}>
              <Text style={styles.rowLabel}>{row.name}</Text>
              <Text style={styles.lowStockValue}>Stock: {row.stock} (alert ≤{row.lowStockThreshold})</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

