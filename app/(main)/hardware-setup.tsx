import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/contexts/ThemeContext";
import { spacing } from "@/constants/theme";

export default function HardwareSetupScreen() {
  const theme = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, padding: spacing.lg, backgroundColor: theme.background },
        title: { fontSize: 24, fontWeight: "700", color: theme.text, marginBottom: spacing.lg },
        card: {
          backgroundColor: theme.surface,
          padding: spacing.lg,
          borderRadius: 10,
          marginBottom: spacing.md,
          borderWidth: 1,
          borderColor: theme.border,
        },
        sectionTitle: { fontSize: 16, fontWeight: "600", color: theme.text },
        text: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.sm },
        banner: {
          marginTop: spacing.lg,
          padding: spacing.md,
          backgroundColor: `${theme.primary}15`,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: theme.primary,
        },
        bannerText: { fontSize: 14, color: theme.text },
      }),
    [theme]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hardware setup</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Printer</Text>
        <Text style={styles.text}>Connect and test receipt printer. (Coming soon)</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Barcode scanner</Text>
        <Text style={styles.text}>Connect scanner for quick product lookup. (Coming soon)</Text>
      </View>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>ZimPOS works without hardware. Add printer and scanner when ready.</Text>
      </View>
    </View>
  );
}

