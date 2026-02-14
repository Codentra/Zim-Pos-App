import { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getPendingCount, isConvexConfigured } from "@/lib/sync/syncService";
import { colors, spacing, borderRadius } from "@/constants/theme";

export default function SystemStatusScreen() {
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getPendingCount().then(setPending).finally(() => setLoading(false));
    }, [])
  );

  const configured = isConvexConfigured();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>System status</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Sync</Text>
        <Text style={styles.value}>
          {configured ? "Convex configured" : "Convex not configured"}
        </Text>
        <Text style={styles.hint}>
          Set EXPO_PUBLIC_CONVEX_URL and run npx convex dev to enable cloud sync.
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Pending uploads</Text>
        <Text style={styles.value}>{loading ? "…" : pending}</Text>
        <Text style={styles.hint}>Rows waiting to sync to Convex when online.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, paddingTop: 48, backgroundColor: colors.light.background },
  title: { fontSize: 22, fontWeight: "700", color: colors.light.text, marginBottom: spacing.lg },
  card: { backgroundColor: colors.light.surface, padding: spacing.lg, borderRadius: borderRadius.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.light.border },
  label: { fontSize: 14, fontWeight: "600", color: colors.light.text },
  value: { fontSize: 18, color: colors.light.primary, marginTop: spacing.xs },
  hint: { fontSize: 12, color: colors.light.textSecondary, marginTop: spacing.sm },
});
