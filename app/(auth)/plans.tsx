/**
 * Plans selection. Figma: Trial, Starter, Business cards; "Most Popular" badge.
 */
import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { PLANS } from "@/lib/domain/types";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";
import { Button } from "@/components/ui/Button";

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
        backBtn: { alignSelf: "flex-start", marginBottom: spacing.md, minHeight: 44, justifyContent: "center" },
        backBtnText: { color: theme.textSecondary, fontSize: 16, fontWeight: "600" },
        title: { fontSize: 24, fontWeight: "700", color: theme.text, marginBottom: spacing.xs },
        subtitle: { fontSize: 16, color: theme.textSecondary, marginBottom: spacing.lg },
        card: {
          backgroundColor: theme.surface,
          borderWidth: 2,
          borderColor: theme.border,
          borderRadius: borderRadius.xl,
          padding: spacing.lg,
          marginBottom: spacing.md,
        },
        cardSelected: { borderColor: theme.primary, backgroundColor: theme.primary + "12" },
        badge: {
          alignSelf: "flex-start",
          paddingHorizontal: spacing.sm,
          paddingVertical: 4,
          backgroundColor: theme.primary,
          borderRadius: borderRadius.sm,
          marginBottom: spacing.sm,
        },
        badgeText: { fontSize: 12, fontWeight: "600", color: theme.primaryText },
        planName: { fontSize: 18, fontWeight: "700", color: theme.text },
        planPrice: { fontSize: 20, fontWeight: "600", color: theme.primary, marginTop: spacing.xs },
        planMeta: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.xs },
        trialBadge: { fontSize: 12, color: theme.success, marginTop: spacing.sm },
        continueBtn: { marginTop: spacing.xl, minHeight: 48 },
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
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Choose Your Plan</Text>
      <Text style={styles.subtitle}>No payment required during trial.</Text>

      {PLANS.map((plan) => (
        <TouchableOpacity
          key={plan.id}
          style={[styles.card, selectedPlanId === plan.id && styles.cardSelected]}
          onPress={() => setSelectedPlanId(plan.id)}
          activeOpacity={0.8}
        >
          {plan.id === "BUSINESS" && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Most Popular</Text>
            </View>
          )}
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planPrice}>{formatPrice(plan.priceCents)}</Text>
          <Text style={styles.planMeta}>Up to {plan.userLimit} users</Text>
          {plan.id === "TRIAL" && (
            <Text style={styles.trialBadge}>14 days · No payment required</Text>
          )}
        </TouchableOpacity>
      ))}

      <Button
        title={selectedPlanId === "TRIAL" ? "Start 14-Day Free Trial" : "Continue to Payment"}
        onPress={handleContinue}
        style={styles.continueBtn}
      />
    </ScrollView>
  );
}
