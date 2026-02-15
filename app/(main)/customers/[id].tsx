import { useCallback, useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useColors } from "@/contexts/ThemeContext";
import { getCustomerById } from "@/lib/data/repositories/customersRepo";
import { getTransactionsByCustomerId } from "@/lib/data/repositories/salesRepo";
import type { Customer } from "@/lib/domain/types";
import type { Transaction } from "@/lib/domain/types";
import { spacing, borderRadius } from "@/constants/theme";

function formatCents(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}

export default function CustomerDetailScreen() {
  const theme = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [c, txs] = await Promise.all([
        getCustomerById(id),
        getTransactionsByCustomerId(id),
      ]);
      setCustomer(c ?? null);
      setTransactions(txs);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
        header: { flexDirection: "row" as const, alignItems: "center", gap: spacing.sm },
        name: { fontSize: 22, fontWeight: "700" as const, color: theme.text },
        vipBadge: { fontSize: 12, fontWeight: "600" as const, color: theme.primary, backgroundColor: `${theme.primary}20`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
        phone: { fontSize: 16, color: theme.textSecondary, marginTop: spacing.xs },
        email: { fontSize: 14, color: theme.textSecondary, marginTop: 2 },
        location: { fontSize: 14, color: theme.textSecondary, marginTop: 2 },
        creditSection: { marginTop: spacing.lg },
        sectionTitle: { fontSize: 16, fontWeight: "600" as const, color: theme.text, marginTop: spacing.lg, marginBottom: spacing.sm },
        progressBar: { height: 8, backgroundColor: theme.border, borderRadius: 4, overflow: "hidden" as const },
        progressFill: { height: "100%", backgroundColor: theme.primary },
        progressWarning: { backgroundColor: theme.error },
        creditText: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.xs },
        notes: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.md, fontStyle: "italic" as const },
        editBtn: { marginTop: spacing.lg, padding: spacing.md, borderWidth: 1, borderColor: theme.primary, borderRadius: borderRadius.md, alignItems: "center" as const },
        editBtnText: { color: theme.primary, fontSize: 16, fontWeight: "600" as const },
        empty: { color: theme.textSecondary, marginTop: spacing.sm },
        txRow: { flexDirection: "row" as const, justifyContent: "space-between", alignItems: "center", padding: spacing.md, backgroundColor: theme.surface, borderRadius: borderRadius.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: theme.border },
        txReceipt: { fontSize: 14, fontWeight: "600" as const, color: theme.text },
        txDate: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
        txTotal: { fontSize: 16, fontWeight: "600" as const, color: theme.text },
        error: { color: theme.error, marginBottom: spacing.md },
        link: { color: theme.primary, fontSize: 16 },
      }),
    [theme]
  );

  if (!customer && !loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Customer not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!customer) return null;

  const creditProgress = customer.creditLimitCents > 0
    ? Math.min(100, (customer.creditBalanceCents / customer.creditLimitCents) * 100)
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.name}>{customer.name}</Text>
        {customer.isVip ? <Text style={styles.vipBadge}>VIP</Text> : null}
      </View>
      <Text style={styles.phone}>{customer.phone || "—"}</Text>
      <Text style={styles.email}>{customer.email || "—"}</Text>
      <Text style={styles.location}>{customer.location || "—"}</Text>

      {customer.creditLimitCents > 0 && (
        <View style={styles.creditSection}>
          <Text style={styles.sectionTitle}>Credit</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${creditProgress}%` },
                creditProgress > 80 && styles.progressWarning,
              ]}
            />
          </View>
          <Text style={styles.creditText}>
            {formatCents(customer.creditBalanceCents)} / {formatCents(customer.creditLimitCents)}
          </Text>
        </View>
      )}

      {customer.notes ? (
        <Text style={styles.notes}>Notes: {customer.notes}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => router.push({ pathname: "/(main)/customers/[id]/edit", params: { id: customer.id } })}
      >
        <Text style={styles.editBtnText}>Edit customer</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Transaction history</Text>
      {transactions.length === 0 ? (
        <Text style={styles.empty}>No transactions</Text>
      ) : (
        transactions.map((tx) => (
          <TouchableOpacity
            key={tx.id}
            style={styles.txRow}
            onPress={() => {}}
          >
            <View>
              <Text style={styles.txReceipt}>#{tx.receiptNo}</Text>
              <Text style={styles.txDate}>
                {new Date(tx.timestamp).toLocaleString()}
              </Text>
            </View>
            <Text style={styles.txTotal}>{formatCents(tx.totalCents)}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

