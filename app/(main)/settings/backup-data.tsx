/**
 * Backup data. Export to JSON file and share via system share sheet.
 */
import { useState, useMemo } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useColors } from "@/contexts/ThemeContext";
import { getDb } from "@/lib/data/db";
import { spacing } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const TABLES = [
  "businesses",
  "products",
  "transactions",
  "transaction_items",
  "customers",
  "users",
  "cash_shifts",
  "activity_logs",
];

export default function BackupDataScreen() {
  const theme = useColors();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    setMessage("");
    setError(false);
    try {
      const db = await getDb();
      const data: Record<string, unknown[]> = {};
      for (const table of TABLES) {
        try {
          const rows = await db.getAllAsync(`SELECT * FROM ${table}`);
          data[table] = rows as unknown[];
        } catch {
          data[table] = [];
        }
      }
      const json = JSON.stringify(data, null, 2);
      const filename = `zimpos-backup-${new Date().toISOString().slice(0, 10)}.json`;
      const dir = FileSystem.documentDirectory;
      if (!dir) {
        setMessage("No document directory");
        setError(true);
        return;
      }
      const uri = dir + filename;
      await FileSystem.writeAsStringAsync(uri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/json",
          dialogTitle: "Share ZimPOS backup",
        });
        setMessage("Backup created and share dialog opened.");
      } else {
        setMessage(`Backup saved to app documents: ${filename}`);
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Export failed");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
        title: { fontSize: 22, fontWeight: "700", color: theme.text, marginBottom: spacing.md },
        desc: { fontSize: 14, color: theme.textSecondary, marginBottom: spacing.xl, lineHeight: 22 },
        card: { marginBottom: spacing.lg },
        cardTitle: { fontSize: 16, fontWeight: "600", color: theme.text },
        cardDesc: { fontSize: 14, color: theme.textSecondary, marginTop: 4 },
        exportBtn: { marginTop: spacing.md, minHeight: 48 },
        message: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.lg },
        messageError: { color: theme.error },
      }),
    [theme]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Backup data</Text>
      <Text style={styles.desc}>
        Export your data as a JSON file and share it (e.g. save to Files or drive) for backup or restore on another device.
      </Text>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Export data</Text>
        <Text style={styles.cardDesc}>Create a backup file and open the share sheet to save or send it.</Text>
        <Button
          title={loading ? "Exporting…" : "Export backup"}
          onPress={handleExport}
          loading={loading}
          disabled={loading}
          style={styles.exportBtn}
        />
      </Card>
      {message ? (
        <Text style={[styles.message, error && styles.messageError]}>{message}</Text>
      ) : null}
    </ScrollView>
  );
}
