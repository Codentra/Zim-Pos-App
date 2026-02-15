import { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/contexts/ThemeContext";
import { spacing } from "@/constants/theme";

export default function SyncStatusScreen() {
  const theme = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, padding: spacing.lg, backgroundColor: theme.background },
        card: { backgroundColor: theme.surface, padding: spacing.lg, borderRadius: 10, borderWidth: 1, borderColor: theme.border },
        title: { fontSize: 18, fontWeight: "700" as const, color: theme.text },
        status: { fontSize: 16, color: theme.textSecondary, marginTop: spacing.sm },
        subtitle: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.xs },
        btn: { marginTop: spacing.lg, padding: spacing.md, backgroundColor: theme.primary, borderRadius: 10, alignItems: "center" as const },
        btnText: { color: theme.primaryText, fontSize: 16, fontWeight: "600" as const },
      }),
    [theme]
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sync status</Text>
        <Text style={styles.status}>● Offline</Text>
        <Text style={styles.subtitle}>Data is saved locally. Sync when online.</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Sync when online</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

