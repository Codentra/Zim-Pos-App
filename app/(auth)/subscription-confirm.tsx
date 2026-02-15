/**
 * Subscription confirmation. Creates business, subscription, owner. Redirects to Login.
 */
import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useBusiness } from "@/contexts/BusinessContext";
import { createBusiness } from "@/lib/data/repositories/businessRepo";
import { createTrialSubscription, createPaidSubscription } from "@/lib/data/repositories/subscriptionRepo";
import { createOwner } from "@/lib/data/repositories/authRepo";
import { DEFAULT_PIN } from "@/constants/auth";
import { PLANS } from "@/lib/domain/types";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";

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
        container: { flex: 1, padding: spacing.lg, backgroundColor: theme.background, justifyContent: "center" },
        title: { fontSize: 24, fontWeight: "700", color: theme.text, marginBottom: spacing.lg, textAlign: "center" },
        card: {
          backgroundColor: theme.surface,
          borderRadius: borderRadius.md,
          padding: spacing.lg,
          marginBottom: spacing.lg,
          borderWidth: 1,
          borderColor: theme.border,
        },
        planName: { fontSize: 18, fontWeight: "700", color: theme.text },
        planMeta: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.xs },
        trialInfo: { fontSize: 14, color: theme.success, marginTop: spacing.sm },
        pinInfo: { fontSize: 14, color: theme.textSecondary, textAlign: "center", marginBottom: spacing.lg },
        error: { color: theme.error, textAlign: "center", marginBottom: spacing.md },
        button: { backgroundColor: theme.primary, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: "center" },
        buttonDisabled: { opacity: 0.6 },
        buttonText: { color: theme.primaryText, fontSize: 16, fontWeight: "600" },
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
      <Text style={styles.title}>You're All Set!</Text>
      <View style={styles.card}>
        <Text style={styles.planName}>{plan.name}</Text>
        <Text style={styles.planMeta}>Up to {plan.userLimit} users</Text>
        {planId === "TRIAL" ? (
          <Text style={styles.trialInfo}>
            Trial ends: {trialEnd.toLocaleDateString()}
          </Text>
        ) : (
          <Text style={styles.trialInfo}>
            Active · Next billing in 30 days
          </Text>
        )}
      </View>
      <Text style={styles.pinInfo}>
        Your default PIN is {DEFAULT_PIN}. You'll be asked to change it after your first login.
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Setting up…" : "Continue to Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

