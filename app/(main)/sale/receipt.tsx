import { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSale } from "@/contexts/SaleContext";
import { useColors } from "@/contexts/ThemeContext";
import { useCurrencyFormatSafe } from "@/lib/currencyFormat";
import { spacing, borderRadius } from "@/constants/theme";

export default function ReceiptScreen() {
  const theme = useColors();
  const router = useRouter();
  const formatCents = useCurrencyFormatSafe();
  const { lastTransaction, setLastTransaction } = useSale();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, padding: spacing.lg, paddingTop: 48, backgroundColor: theme.background },
        title: { fontSize: 22, fontWeight: "700", color: theme.text, marginBottom: spacing.md },
        receipt: { flex: 1 },
        receiptContent: { paddingBottom: spacing.xl },
        businessName: { fontSize: 18, fontWeight: "700", color: theme.text, textAlign: "center" as const },
        receiptNo: { fontSize: 14, color: theme.textSecondary, textAlign: "center" as const, marginTop: spacing.xs },
        date: { fontSize: 12, color: theme.textSecondary, textAlign: "center" as const, marginTop: spacing.xs },
        divider: { height: 1, backgroundColor: theme.border, marginVertical: spacing.md },
        lineRow: { flexDirection: "row" as const, justifyContent: "space-between", marginBottom: spacing.xs },
        lineName: { flex: 1, fontSize: 14, color: theme.text },
        lineTotal: { fontSize: 14, color: theme.text },
        totalRow: { flexDirection: "row" as const, justifyContent: "space-between", marginTop: spacing.sm },
        totalLabel: { fontSize: 16, fontWeight: "700", color: theme.text },
        totalValue: { fontSize: 16, fontWeight: "700", color: theme.text },
        payment: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.sm },
        change: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.xs },
        actions: { marginTop: spacing.lg, gap: spacing.sm },
        primaryBtn: { backgroundColor: theme.primary, paddingVertical: spacing.md, borderRadius: borderRadius.xl, alignItems: "center", minHeight: 48, justifyContent: "center" },
        primaryBtnText: { color: theme.primaryText, fontSize: 16, fontWeight: "600" },
        secondaryBtn: { paddingVertical: spacing.md, alignItems: "center" },
        secondaryBtnText: { color: theme.textSecondary, fontSize: 16 },
      }),
    [theme]
  );

  const handleDone = () => {
    setLastTransaction(null);
    router.replace("/(main)/dashboard");
  };

  const handleNewSale = () => {
    setLastTransaction(null);
    router.replace("/(main)/sale");
  };

  if (!lastTransaction) {
    router.replace("/(main)/sale");
    return null;
  }

  const { transaction, items } = lastTransaction;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipt</Text>
      <ScrollView style={styles.receipt} contentContainerStyle={styles.receiptContent}>
        <Text style={styles.businessName}>ZimPOS</Text>
        <Text style={styles.receiptNo}>Receipt #{transaction.receiptNo}</Text>
        <Text style={styles.date}>
          {new Date(transaction.timestamp).toLocaleString()}
        </Text>
        <View style={styles.divider} />
        {items.map((item) => (
          <View key={item.id} style={styles.lineRow}>
            <Text style={styles.lineName}>{item.nameSnapshot} x{item.quantity}</Text>
            <Text style={styles.lineTotal}>{formatCents(item.lineTotalCents)}</Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCents(transaction.totalCents)}</Text>
        </View>
        <Text style={styles.payment}>Payment: {transaction.paymentMethod}</Text>
        {transaction.changeGivenCents > 0 && (
          <Text style={styles.change}>Change: {formatCents(transaction.changeGivenCents)}</Text>
        )}
      </ScrollView>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleNewSale}>
          <Text style={styles.primaryBtnText}>New sale</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={handleDone}>
          <Text style={styles.secondaryBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

