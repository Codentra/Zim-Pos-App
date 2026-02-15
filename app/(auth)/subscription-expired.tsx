import { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";

export default function SubscriptionExpiredScreen() {
  const theme = useColors();
  const router = useRouter();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, padding: spacing.lg, backgroundColor: theme.background, justifyContent: "center" },
        title: { fontSize: 24, fontWeight: "700", color: theme.text, marginBottom: spacing.md, textAlign: "center" },
        message: { fontSize: 16, color: theme.textSecondary, textAlign: "center", marginBottom: spacing.xl, lineHeight: 24 },
        primaryBtn: { backgroundColor: theme.primary, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: "center" },
        primaryBtnText: { color: theme.primaryText, fontSize: 16, fontWeight: "600" },
        secondaryBtn: { marginTop: spacing.md, paddingVertical: spacing.md, alignItems: "center" },
        secondaryBtnText: { color: theme.primary, fontSize: 16 },
      }),
    [theme]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscription expired</Text>
      <Text style={styles.message}>
        Your trial or subscription has ended. You can still view reports and export data, but new sales and inventory changes are blocked.
      </Text>
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => router.push("/(auth)/plans")}
      >
        <Text style={styles.primaryBtnText}>Renew subscription</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => router.replace("/welcome")}
      >
        <Text style={styles.secondaryBtnText}>Back to welcome</Text>
      </TouchableOpacity>
    </View>
  );
}

