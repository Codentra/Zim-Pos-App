/**
 * Subscription payment. Figma: order summary, Zimbabwe methods (Card, EcoCash, OneMoney, ZIPIT).
 */
import { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PLANS } from "@/lib/domain/types";

const METHODS = [
  { id: "CARD", label: "Card", desc: "Visa, Mastercard, Amex", icon: "💳" },
  { id: "ECOCASH", label: "EcoCash", desc: "Econet mobile money", icon: "📱" },
  { id: "ONEMONEY", label: "OneMoney", desc: "NetOne mobile money", icon: "📱" },
  { id: "ZIPIT", label: "ZIPIT", desc: "Instant bank transfer", icon: "🏦" },
];

export default function PaymentSubscriptionScreen() {
  const theme = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{
    businessName?: string;
    ownerName?: string;
    phone?: string;
    email?: string;
    country?: string;
    city?: string;
    planId?: string;
  }>();

  const planId = (params.planId as string) || "STARTER";
  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1];
  const priceStr = plan.priceCents === 0 ? "Free" : `$${(plan.priceCents / 100).toFixed(0)}/month`;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
        backBtn: { alignSelf: "flex-start", marginBottom: spacing.md, minHeight: 44, justifyContent: "center" },
        backBtnText: { color: theme.textSecondary, fontSize: 16, fontWeight: "600" },
        title: { fontSize: 24, fontWeight: "700", color: theme.text, marginBottom: spacing.xs },
        subtitle: { fontSize: 16, color: theme.textSecondary, marginBottom: spacing.lg },
        orderCard: {
          backgroundColor: theme.surface,
          borderRadius: borderRadius.xl,
          padding: spacing.lg,
          marginBottom: spacing.lg,
          borderWidth: 1,
          borderColor: theme.border,
        },
        orderRow: { flexDirection: "row" as const, justifyContent: "space-between", marginBottom: spacing.xs },
        orderLabel: { fontSize: 14, color: theme.textSecondary },
        orderValue: { fontSize: 16, fontWeight: "600", color: theme.text },
        methodCard: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: theme.surface,
          padding: spacing.lg,
          borderRadius: borderRadius.xl,
          marginBottom: spacing.md,
          borderWidth: 1,
          borderColor: theme.border,
        },
        methodIcon: { fontSize: 24, marginRight: spacing.md },
        methodLabel: { fontSize: 16, fontWeight: "600", color: theme.text },
        methodDesc: { fontSize: 13, color: theme.textSecondary, marginTop: 2 },
        securityNote: {
          flexDirection: "row",
          alignItems: "center",
          marginTop: spacing.lg,
          marginBottom: spacing.lg,
        },
        securityText: { fontSize: 12, color: theme.textSecondary, marginLeft: spacing.sm },
        confirmBtn: { minHeight: 48 },
      }),
    [theme]
  );

  const handlePay = () => {
    router.replace({
      pathname: "/(auth)/subscription-confirm",
      params: params as Record<string, string>,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Complete payment</Text>
      <Text style={styles.subtitle}>Choose your payment method</Text>

      <Card style={styles.orderCard}>
        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Plan</Text>
          <Text style={styles.orderValue}>{plan.name}</Text>
        </View>
        <View style={styles.orderRow}>
          <Text style={styles.orderLabel}>Total</Text>
          <Text style={styles.orderValue}>{priceStr}</Text>
        </View>
      </Card>

      {METHODS.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={styles.methodCard}
          onPress={handlePay}
          activeOpacity={0.8}
        >
          <Text style={styles.methodIcon}>{m.icon}</Text>
          <View>
            <Text style={styles.methodLabel}>{m.label}</Text>
            <Text style={styles.methodDesc}>{m.desc}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.securityNote}>
        <Text>🔒</Text>
        <Text style={styles.securityText}>SSL encrypted · PCI compliant</Text>
      </View>

      <Button title="Complete Payment" onPress={handlePay} style={styles.confirmBtn} />
    </ScrollView>
  );
}
