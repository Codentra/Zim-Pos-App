/**
 * Plans selection. Trial, Starter, Business. Trial = no payment required.
 */
import { useState, useMemo } from "react";
import { Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { PLANS } from "@/lib/domain/types";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";

function formatPrice(cents: number): string {
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(0)}/month`;
}

export default function PlansScreen() {
  const theme = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{
    businessName: string;
    ownerName: string;
    phone: string;
    email: string;
    country: string;
    city: string;
  }>();
  const [selectedPlanId, setSelectedPlanId] = useState<"TRIAL" | "STARTER" | "BUSINESS">("TRIAL");

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
        backBtn: { alignSelf: "flex-start", marginBottom: spacing.md },
        backBtnText: { color: theme.textSecondary, fontSize: 16 },
        title: { fontSize: 24, fontWeight: "700", color: theme.text, marginBottom: spacing.xs },
        subtitle: { fontSize: 16, color: theme.textSecondary, marginBottom: spacing.lg },
        card: {
          backgroundColor: theme.surface,
          borderWidth: 2,
          borderColor: theme.border,
          borderRadius: borderRadius.md,
          padding: spacing.lg,
          marginBottom: spacing.md,
        },
        cardSelected: { borderColor: theme.primary, backgroundColor: `${theme.primary}10` },
        planName: { fontSize: 18, fontWeight: "700", color: theme.text },
        planPrice: { fontSize: 20, fontWeight: "600", color: theme.primary, marginTop: spacing.xs },
        planMeta: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.xs },
        trialBadge: { fontSize: 12, color: theme.success, marginTop: spacing.sm },
        button: {
          backgroundColor: theme.primary,
          paddingVertical: spacing.md,
          borderRadius: borderRadius.md,
          alignItems: "center",
          marginTop: spacing.xl,
        },
        buttonText: { color: theme.primaryText, fontSize: 16, fontWeight: "600" },
      }),
    [theme]
  );

  const handleContinue = () => {
    const target =
      selectedPlanId === "TRIAL"
        ? "/(auth)/subscription-confirm"
        : "/(auth)/payment-subscription";
    router.push({
      pathname: target,
      params: {
        ...params,
        planId: selectedPlanId,
      },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Choose Your Plan</Text>
      <Text style={styles.subtitle}>No payment required during trial.</Text>

      {PLANS.map((plan) => (
        <TouchableOpacity
          key={plan.id}
          style={[
            styles.card,
            selectedPlanId === plan.id && styles.cardSelected,
          ]}
          onPress={() => setSelectedPlanId(plan.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planPrice}>{formatPrice(plan.priceCents)}</Text>
          <Text style={styles.planMeta}>Up to {plan.userLimit} users</Text>
          {plan.id === "TRIAL" && (
            <Text style={styles.trialBadge}>14 days · No payment required</Text>
          )}
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleContinue} activeOpacity={0.8}>
        <Text style={styles.buttonText}>
          {selectedPlanId === "TRIAL" ? "Start 14-Day Free Trial" : "Continue"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
