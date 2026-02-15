import { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";

const METHODS = ["EcoCash", "OneMoney", "Card", "Bank transfer"];

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

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, padding: spacing.lg, backgroundColor: theme.background },
        title: { fontSize: 24, fontWeight: "700", color: theme.text, marginBottom: spacing.xs },
        subtitle: { fontSize: 16, color: theme.textSecondary, marginBottom: spacing.lg },
        methodCard: {
          backgroundColor: theme.surface,
          padding: spacing.lg,
          borderRadius: borderRadius.md,
          marginBottom: spacing.md,
          borderWidth: 1,
          borderColor: theme.border,
        },
        methodText: { fontSize: 16, fontWeight: "600", color: theme.text },
        backBtn: { marginTop: spacing.xl, alignItems: "center" },
        backBtnText: { color: theme.textSecondary, fontSize: 16 },
      }),
    [theme]
  );

  const handlePay = (method: string) => {
    // Placeholder - integrate payment gateway later
    router.replace({
      pathname: "/(auth)/subscription-confirm",
      params: params as Record<string, string>,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete payment</Text>
      <Text style={styles.subtitle}>Choose your payment method</Text>

      {METHODS.map((m) => (
        <TouchableOpacity
          key={m}
          style={styles.methodCard}
          onPress={() => handlePay(m)}
        >
          <Text style={styles.methodText}>{m}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

