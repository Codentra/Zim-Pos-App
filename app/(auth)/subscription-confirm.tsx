/**
 * Subscription confirmation. Figma: success checkmark, plan details, Next steps, Continue to Login.
 */
import { useState, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useBusiness } from "@/contexts/BusinessContext";
import { createBusiness } from "@/lib/data/repositories/businessRepo";
import { createTrialSubscription, createPaidSubscription } from "@/lib/data/repositories/subscriptionRepo";
import { createOwner } from "@/lib/data/repositories/authRepo";
import { DEFAULT_PIN } from "@/constants/auth";
import { PLANS } from "@/lib/domain/types";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SubscriptionConfirmScreen() {
  const theme = useColors();
  const router = useRouter();
  const { setBusinessId } = useBusiness();
  const params = useLocalSearchParams<{
    businessName: string;
    ownerName: string;
    phone: string;
    email: string;
    country: string;
    city: string;
    planId: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const planId = (typeof params.planId === "string" ? params.planId : params.planId?.[0] ?? "TRIAL") as "TRIAL" | "STARTER" | "BUSINESS";
  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[0];
  const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          padding: spacing.lg,
          backgroundColor: theme.background,
          justifyContent: "center",
        },
        iconWrap: {
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: theme.success + "25",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          marginBottom: spacing.lg,
        },
        icon: { fontSize: 40 },
        title: {
          fontSize: 24,
          fontWeight: "700",
          color: theme.text,
          marginBottom: spacing.lg,
          textAlign: "center",
        },
        card: {
          marginBottom: spacing.lg,
        },
        planName: { fontSize: 18, fontWeight: "700", color: theme.text },
        planMeta: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.xs },
        trialInfo: { fontSize: 14, color: theme.success, marginTop: spacing.sm },
        nextSteps: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.md },
        nextStepItem: { marginTop: spacing.xs },
        pinInfo: {
          fontSize: 14,
          color: theme.textSecondary,
          textAlign: "center",
          marginBottom: spacing.lg,
        },
        error: { color: theme.error, textAlign: "center", marginBottom: spacing.md },
        continueBtn: { minHeight: 48 },
      }),
    [theme]
  );

  const handleContinue = async () => {
    setError("");
    setLoading(true);
    try {
      const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : v?.[0] ?? "");
      const business = await createBusiness({
        name: str(params.businessName) || "My Business",
        ownerName: str(params.ownerName) || "Owner",
        phone: str(params.phone) || "",
        email: str(params.email) || "",
        country: str(params.country) || "Zimbabwe",
        city: str(params.city) || "",
      });
      if (planId === "TRIAL") {
        await createTrialSubscription(business.id, plan.userLimit);
      } else {
        await createPaidSubscription(business.id, planId, plan.userLimit);
      }
      await createOwner(str(params.ownerName) || "Owner", DEFAULT_PIN);
      await setBusinessId(business.id);
      router.replace("/(auth)/login");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>✓</Text>
      </View>
      <Text style={styles.title}>You're All Set!</Text>
      <Card style={styles.card}>
        <Text style={styles.planName}>{plan.name}</Text>
        <Text style={styles.planMeta}>Up to {plan.userLimit} users</Text>
        {planId === "TRIAL" ? (
          <Text style={styles.trialInfo}>Trial ends: {trialEnd.toLocaleDateString()}</Text>
        ) : (
          <Text style={styles.trialInfo}>Active · Next billing in 30 days</Text>
        )}
        <Text style={styles.nextSteps}>Next steps:</Text>
        <Text style={[styles.nextSteps, styles.nextStepItem]}>• Add team members</Text>
        <Text style={[styles.nextSteps, styles.nextStepItem]}>• Set up products</Text>
        <Text style={[styles.nextSteps, styles.nextStepItem]}>• Start selling</Text>
      </Card>
      <Text style={styles.pinInfo}>
        Your default PIN is {DEFAULT_PIN}. You'll be asked to change it after your first login.
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        title={loading ? "Setting up…" : "Continue to Login"}
        onPress={handleContinue}
        loading={loading}
        disabled={loading}
        style={styles.continueBtn}
      />
    </View>
  );
}
