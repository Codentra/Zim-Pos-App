import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";
import { Card } from "@/components/ui/Card";

export default function HardwareSetupScreen() {
  const theme = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, padding: spacing.lg, backgroundColor: theme.background },
        title: { fontSize: 22, fontWeight: "700", color: theme.text, marginBottom: spacing.lg },
        card: { marginBottom: spacing.lg },
        sectionTitle: { fontSize: 16, fontWeight: "600", color: theme.text },
        text: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.sm },
        banner: {
          marginTop: spacing.lg,
          padding: spacing.lg,
          backgroundColor: theme.primary + "18",
          borderRadius: borderRadius.xl,
          borderWidth: 1,
          borderColor: theme.primary + "40",
        },
        bannerText: { fontSize: 14, color: theme.text },
      }),
    [theme]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hardware setup</Text>
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Receipt printer</Text>
        <Text style={styles.text}>Connect and test receipt printer. (Coming soon)</Text>
      </Card>
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Barcode scanner</Text>
        <Text style={styles.text}>Connect scanner for quick product lookup. (Coming soon)</Text>
      </Card>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>ZimPOS works without hardware. Add printer and scanner when ready.</Text>
      </View>
    </View>
  );
}

