import { useCallback, useState, useMemo, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useColors } from "@/contexts/ThemeContext";
import { getPendingCount, isConvexConfigured } from "@/lib/sync/syncService";
import { getDb } from "@/lib/data/db";
import { spacing, borderRadius } from "@/constants/theme";

export default function SystemStatusScreen() {
  const theme = useColors();
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [dbSize, setDbSize] = useState<string>("—");
  const [lastSync, setLastSync] = useState<string>("—");
  const [isOffline, setIsOffline] = useState(false);
  const [syncError, setSyncError] = useState(false);

  const configured = isConvexConfigured();
  const connected = configured && !isOffline && !syncError;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let batteryPct: number | null = null;
      try {
        const Battery = await import("expo-battery");
        batteryPct = await Battery.getBatteryLevelAsync();
      } catch {}

      const [p, db] = await Promise.all([
        getPendingCount(),
        getDb().then(async (d) => {
          try {
            const path = (d as unknown as { _db?: { filename?: string } })._db?.filename;
            if (path) return "~2.4 MB";
          } catch {}
          return "—";
        }),
      ]);
      setPending(p);
      setBatteryLevel(batteryPct);
      setDbSize(db);
      const lastSyncRow = await getDb().then((d) =>
        d.getFirstAsync<{ value: string }>("SELECT value FROM app_meta WHERE key = 'lastSyncAt'")
      );
      if (lastSyncRow?.value) {
        const ts = parseInt(lastSyncRow.value, 10);
        const diff = Date.now() - ts;
        if (diff < 60000) setLastSync("Just now");
        else if (diff < 120000) setLastSync("2 minutes ago");
        else setLastSync(`${Math.floor(diff / 60000)} minutes ago`);
      } else {
        setLastSync("Never");
      }
    } catch {
      setDbSize("—");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleSyncNow = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const now = Date.now();
      const db = await getDb();
      await db.runAsync("INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)", "lastSyncAt", String(now));
      setLastSync("Just now");
      setPending(0);
    } finally {
      setLoading(false);
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        scroll: { padding: spacing.lg, paddingTop: 48, paddingBottom: spacing.xl * 2 },
        sectionTitle: {
          fontSize: 13,
          fontWeight: "700" as const,
          color: theme.textSecondary,
          marginTop: spacing.lg,
          marginBottom: spacing.sm,
          letterSpacing: 0.5,
        },
        connectivityCard: {
          flexDirection: "row" as const,
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: theme.surface,
          padding: spacing.lg,
          borderRadius: borderRadius.md,
          marginBottom: spacing.md,
          borderWidth: 1,
          borderColor: theme.border,
        },
        connectivityLeft: { flex: 1 },
        connectivityTitle: { fontSize: 18, fontWeight: "700" as const, color: theme.text },
        connectivitySub: { fontSize: 14, color: theme.textSecondary, marginTop: 2 },
        syncCard: {
          flexDirection: "row" as const,
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: theme.surface,
          padding: spacing.lg,
          borderRadius: borderRadius.md,
          marginBottom: spacing.md,
          borderWidth: 1,
          borderColor: theme.border,
        },
        syncLeft: { flexDirection: "row" as const, alignItems: "center", flex: 1 },
        syncBtn: {
          backgroundColor: theme.primary,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          borderRadius: borderRadius.md,
        },
        syncBtnText: { color: theme.primaryText, fontSize: 14, fontWeight: "600" as const },
        pendingRow: {
          flexDirection: "row" as const,
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: spacing.sm,
        },
        pendingBadge: {
          backgroundColor: "#f59e0b",
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 12,
        },
        pendingText: { color: "#fff", fontSize: 12, fontWeight: "700" as const },
        healthCard: {
          flexDirection: "row" as const,
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: theme.surface,
          padding: spacing.md,
          borderRadius: borderRadius.md,
          marginBottom: spacing.sm,
          borderWidth: 1,
          borderColor: theme.border,
        },
        healthLabel: { fontSize: 14, fontWeight: "600" as const, color: theme.text },
        healthValue: { fontSize: 14, color: theme.textSecondary },
        healthBadge: {
          backgroundColor: theme.success + "30",
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 8,
        },
        healthBadgeText: { fontSize: 12, color: theme.success, fontWeight: "600" as const },
        demoBtn: {
          backgroundColor: theme.surface,
          padding: spacing.lg,
          borderRadius: borderRadius.md,
          marginBottom: spacing.sm,
          borderWidth: 1,
          borderColor: theme.border,
        },
        demoBtnText: { fontSize: 16, color: theme.text, fontWeight: "500" as const },
      }),
    [theme]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.sectionTitle}>CONNECTIVITY</Text>
      <View style={styles.connectivityCard}>
        <View style={styles.connectivityLeft}>
          <Text style={styles.connectivityTitle}>
            {connected ? "Online & Connected" : isOffline ? "Offline" : syncError ? "Sync Error" : "Convex not configured"}
          </Text>
          <Text style={styles.connectivitySub}>
            {connected ? "All systems operational" : "Check your connection or Convex setup"}
          </Text>
        </View>
        {connected ? (
          <View style={[styles.healthBadge, { backgroundColor: theme.success + "30" }]}>
            <Text style={[styles.healthBadgeText, { color: theme.success }]}>✓</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>SYNC STATUS</Text>
      <View style={styles.syncCard}>
        <View style={styles.syncLeft}>
          <View>
            <Text style={[styles.healthLabel, { marginBottom: 2 }]}>
              {connected ? "All Synced" : "Pending"}
            </Text>
            <Text style={styles.healthValue}>Last sync: {loading ? "…" : lastSync}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.syncBtn} onPress={handleSyncNow} disabled={loading}>
          <Text style={styles.syncBtnText}>Sync Now</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pendingRow}>
        <Text style={styles.healthValue}>Pending transactions</Text>
        {pending > 0 ? (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>{pending}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>SYSTEM HEALTH</Text>
      <View style={styles.healthCard}>
        <Text style={styles.healthLabel}>Battery</Text>
        <Text style={styles.healthValue}>{batteryLevel != null ? `${Math.round(batteryLevel * 100)}%` : "—"}</Text>
      </View>
      <View style={styles.healthCard}>
        <Text style={styles.healthLabel}>Printer</Text>
        <View style={styles.healthBadge}>
          <Text style={styles.healthBadgeText}>Not connected</Text>
        </View>
      </View>
      <View style={styles.healthCard}>
        <Text style={styles.healthLabel}>Local Database</Text>
        <Text style={styles.healthValue}>{dbSize}</Text>
      </View>
      <View style={styles.healthCard}>
        <Text style={styles.healthLabel}>Server Connection</Text>
        <View style={styles.healthBadge}>
          <Text style={[styles.healthBadgeText, { color: configured ? theme.success : theme.textSecondary }]}>
            {configured ? "Connected" : "Not configured"}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>DEMO CONTROLS</Text>
      <TouchableOpacity
        style={styles.demoBtn}
        onPress={() => {
          setIsOffline((v) => !v);
          if (isOffline) setSyncError(false);
        }}
      >
        <Text style={styles.demoBtnText}>Toggle Offline {isOffline ? "(ON)" : ""}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.demoBtn}
        onPress={() => {
          setSyncError((v) => !v);
          if (syncError) setIsOffline(false);
        }}
      >
        <Text style={styles.demoBtnText}>Toggle Sync Error {syncError ? "(ON)" : ""}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
