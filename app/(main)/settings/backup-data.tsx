import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/contexts/ThemeContext";
import { getDb } from "@/lib/data/db";
import { spacing, borderRadius } from "@/constants/theme";

export default function BackupDataScreen() {
  const theme = useColors();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleExport = async () => {
    setLoading(true);
    setMessage("");
    try {
      const db = await getDb();
      const tables = ["businesses", "products", "transactions", "transaction_items", "customers", "users", "cash_shifts", "activity_logs"];
      const data: Record<string, unknown[]> = {};
      for (const table of tables) {
        try {
          const rows = await db.getAllAsync(`SELECT * FROM ${table}`);
          data[table] = rows as unknown[];
        } catch {
          data[table] = [];
        }
      }
      setMessage("Export ready. (Full file export requires sharing API)");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Export failed");
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
    title: { fontSize: 22, fontWeight: "700" as const, color: theme.text, marginBottom: spacing.md },
    desc: { fontSize: 14, color: theme.textSecondary, marginBottom: spacing.xl, lineHeight: 22 },
    card: {
      backgroundColor: theme.surface,
      padding: spacing.lg,
      borderRadius: borderRadius.md,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardTitle: { fontSize: 16, fontWeight: "600" as const, color: theme.text },
    cardDesc: { fontSize: 14, color: theme.textSecondary, marginTop: 4 },
    btn: {
      backgroundColor: theme.primary,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: "center" as const,
      marginTop: spacing.md,
    },
    btnDisabled: { opacity: 0.6 },
    btnText: { color: theme.primaryText, fontSize: 16, fontWeight: "600" as const },
    message: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.lg },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Backup data</Text>
      <Text style={styles.desc}>
        Export your data for backup or restore on another device. Data is stored locally and can be exported when needed.
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Export data</Text>
        <Text style={styles.cardDesc}>Create a backup of all your business data.</Text>
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleExport}
          disabled={loading}
        >
          <Text style={styles.btnText}>{loading ? "Exporting…" : "Export backup"}</Text>
        </TouchableOpacity>
      </View>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </ScrollView>
  );
}
