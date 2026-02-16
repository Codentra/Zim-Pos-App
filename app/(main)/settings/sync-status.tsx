/**
 * Sync status. Figma: last sync, pending count, Sync now, connection indicator.
 */
import { useMemo, useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/contexts/ThemeContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { spacing, borderRadius } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getPendingCount, isConvexConfigured } from "@/lib/sync/syncService";

export default function SyncStatusScreen() {
  const theme = useColors();
  const router = useRouter();
  const { businessId } = useBusiness();
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async () => {
    const count = await getPendingCount();
    setPendingCount(count);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const configured = isConvexConfigured();
  const statusLabel = configured ? (pendingCount !== null && pendingCount > 0 ? "Pending sync" : "Up to date") : "Offline";
  const statusColor = configured ? (pendingCount === 0 ? theme.success : theme.warning) : theme.textSecondary;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
        title: { fontSize: 22, fontWeight: "700", color: theme.text, marginBottom: spacing.md },
        card: { marginBottom: spacing.lg },
        cardTitle: { fontSize: 18, fontWeight: "600", color: theme.text },
        status: { fontSize: 16, color: theme.textSecondary, marginTop: spacing.sm },
        subtitle: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.xs },
        syncBtn: { marginTop: spacing.lg, minHeight: 48 },
      }),
    [theme]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Sync status</Text>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Cloud sync</Text>
        <Text style={[styles.status, { color: statusColor }]}>● {statusLabel}</Text>
        <Text style={styles.subtitle}>
          {configured
            ? pendingCount !== null && pendingCount > 0
              ? `${pendingCount} item(s) pending upload. Data is saved locally.`
              : "Data is saved locally and synced when online."
            : "Set EXPO_PUBLIC_CONVEX_URL to enable sync. Data is saved locally."}
        </Text>
        <Button
          title={syncing ? "Syncing…" : "Sync when online"}
          onPress={() => {
            setSyncing(true);
            load().finally(() => setSyncing(false));
          }}
          loading={syncing}
          disabled={!configured || !businessId}
          style={styles.syncBtn}
        />
      </Card>
    </ScrollView>
  );
}
