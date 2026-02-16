/**
 * Subscription expired. Figma: amber warning, available vs blocked features, Renew / Contact support.
 */
import { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const AVAILABLE = ["View reports", "Export data", "View products"];
const BLOCKED = ["Process sales", "Add products", "Manage customers"];

export default function SubscriptionExpiredScreen() {
  const theme = useColors();
  const router = useRouter();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          padding: spacing.lg,
          backgroundColor: theme.background,
          justifyContent: "center",
        },
        header: {
          alignItems: "center",
          marginBottom: spacing.xl,
        },
        iconWrap: {
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: theme.warning + "25",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.md,
        },
        icon: { fontSize: 36 },
        title: {
          fontSize: 24,
          fontWeight: "700",
          color: theme.text,
          textAlign: "center",
        },
        sub: {
          fontSize: 14,
          color: theme.textSecondary,
          textAlign: "center",
          marginTop: spacing.sm,
        },
        card: { marginBottom: spacing.lg },
        sectionTitle: {
          fontSize: 14,
          fontWeight: "600",
          color: theme.text,
          marginBottom: spacing.sm,
        },
        row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
        check: { fontSize: 16, marginRight: spacing.sm },
        blockIcon: { fontSize: 16, marginRight: spacing.sm },
        dataSafe: {
          fontSize: 14,
          color: theme.textSecondary,
          textAlign: "center",
          marginTop: spacing.lg,
          marginBottom: spacing.lg,
        },
        renewBtn: { marginBottom: spacing.md, minHeight: 48 },
        secondaryBtn: { alignItems: "center", minHeight: 44, justifyContent: "center" },
        secondaryBtnText: { fontSize: 16, fontWeight: "600", color: theme.primary },
      }),
    [theme]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>⚠️</Text>
        </View>
        <Text style={styles.title}>Subscription expired</Text>
        <Text style={styles.sub}>Your trial or subscription has ended.</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Available</Text>
        {AVAILABLE.map((l) => (
          <View key={l} style={styles.row}>
            <Text style={styles.check}>✓</Text>
            <Text style={{ fontSize: 14, color: theme.text }}>{l}</Text>
          </View>
        ))}
        <Text style={[styles.sectionTitle, { marginTop: spacing.md }]}>Blocked</Text>
        {BLOCKED.map((l) => (
          <View key={l} style={styles.row}>
            <Text style={styles.blockIcon}>🔒</Text>
            <Text style={{ fontSize: 14, color: theme.text }}>{l}</Text>
          </View>
        ))}
      </Card>

      <Text style={styles.dataSafe}>Your data is safe. Renew to continue selling.</Text>

      <Button
        title="Renew subscription"
        onPress={() => router.push("/(auth)/plans")}
        style={styles.renewBtn}
      />
      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => router.replace("/welcome")}
        activeOpacity={0.8}
      >
        <Text style={styles.secondaryBtnText}>Back to welcome</Text>
      </TouchableOpacity>
    </View>
  );
}
