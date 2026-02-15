import { useCallback, useState, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useColors } from "@/contexts/ThemeContext";
import {
  listLogsByType,
  getLogStats,
} from "@/lib/data/repositories/logsRepo";
import type { LogWithUser } from "@/lib/data/repositories/logsRepo";
import { spacing, borderRadius } from "@/constants/theme";

type FilterTab = "all" | "SALE" | "REFUND" | "CASH";

function formatCents(c: number): string {
  return "$" + (c / 100).toFixed(2);
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  return isToday
    ? "Today, " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : d.toLocaleString();
}

function parseDetails(details: string): Record<string, unknown> {
  try {
    return JSON.parse(details) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export default function ActivityLogsScreen() {
  const theme = useColors();
  const [logs, setLogs] = useState<LogWithUser[]>([]);
  const [stats, setStats] = useState({ total: 0, activeUsers: 0, approvals: 0 });
  const [filter, setFilter] = useState<FilterTab>("all");
  const [loading, setLoading] = useState(true);

  const typeColors: Record<string, string> = useMemo(
    () => ({
      SALE: theme.success,
      REFUND: theme.error,
      CASH: theme.primary,
      STOCK: "#0ea5e9",
      PRICE_CHANGE: "#8b5cf6",
      APPROVAL: "#f59e0b",
      SYNC: theme.textSecondary,
    }),
    [theme]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [logList, logStats] = await Promise.all([
        listLogsByType(filter === "all" ? null : filter, 100),
        getLogStats(),
      ]);
      setLogs(logList);
      setStats(logStats);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
        loading: { color: theme.textSecondary, textAlign: "center" as const, marginTop: spacing.xl },
        empty: { color: theme.textSecondary, textAlign: "center" as const, marginTop: spacing.xl },
        metricsRow: { flexDirection: "row" as const, gap: spacing.sm, marginBottom: spacing.lg },
        metricCard: {
          flex: 1,
          backgroundColor: theme.surface,
          padding: spacing.md,
          borderRadius: borderRadius.md,
          borderWidth: 1,
          borderColor: theme.border,
        },
        metricValue: { fontSize: 18, fontWeight: "700" as const, color: theme.text },
        metricLabel: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
        tabs: { flexDirection: "row" as const, gap: spacing.sm, marginBottom: spacing.md },
        tab: {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: borderRadius.md,
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.border,
        },
        tabActive: { backgroundColor: theme.primary, borderColor: theme.primary },
        tabText: { fontSize: 14, color: theme.text },
        tabTextActive: { color: theme.primaryText, fontWeight: "600" as const },
        list: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xl * 2 },
        row: {
          flexDirection: "row" as const,
          alignItems: "flex-start",
          padding: spacing.md,
          backgroundColor: theme.surface,
          borderRadius: 10,
          marginBottom: spacing.sm,
          borderWidth: 1,
          borderColor: theme.border,
        },
        iconBox: {
          width: 40,
          height: 40,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          marginRight: spacing.md,
        },
        rowContent: { flex: 1 },
        rowHeader: { flexDirection: "row" as const, justifyContent: "space-between", alignItems: "center" },
        action: { fontSize: 16, fontWeight: "600" as const, color: theme.text },
        amount: { fontSize: 16, fontWeight: "600" as const },
        details: { fontSize: 13, color: theme.textSecondary, marginTop: 4 },
        meta: { fontSize: 12, color: theme.textSecondary, marginTop: 4 },
        approvalBadge: {
          alignSelf: "flex-start",
          backgroundColor: "#8b5cf6",
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 4,
          marginTop: 4,
        },
        approvalBadgeText: { fontSize: 11, color: "#fff", fontWeight: "600" as const },
      }),
    [theme]
  );

  const getDisplayInfo = (item: LogWithUser) => {
    const parsed = parseDetails(item.details);
    const totalCents = (parsed.totalCents as number) ?? 0;
    const receiptNo = parsed.receiptNo as number | undefined;
    const itemCount = parsed.itemCount as number | undefined;
    const paymentMethod = parsed.paymentMethod as string | undefined;

    let actionLabel = item.action;
    if (item.type === "SALE") actionLabel = "Completed Sale";
    else if (item.type === "REFUND") actionLabel = "Approved Refund";
    else if (item.type === "PRICE_CHANGE") actionLabel = "Price Changed";

    let amountStr = "";
    if (item.type === "SALE" && totalCents > 0) amountStr = `+${formatCents(totalCents)}`;
    else if ((item.type === "REFUND" || item.type === "REFUND") && totalCents > 0) amountStr = formatCents(totalCents);
    else if (totalCents > 0) amountStr = formatCents(totalCents);

    let detailsStr = "";
    if (receiptNo) detailsStr += `Receipt #${receiptNo}`;
    if (itemCount) detailsStr += (detailsStr ? ", " : "") + `${itemCount} items`;
    if (paymentMethod) detailsStr += (detailsStr ? ", " : "") + paymentMethod;
    if (!detailsStr && item.details) detailsStr = item.details;

    return { actionLabel, amountStr, detailsStr, hasManagerApproval: !!item.managerUserId };
  };

  const renderItem = ({ item }: { item: LogWithUser }) => {
    const color = typeColors[item.type] ?? theme.textSecondary;
    const info = getDisplayInfo(item);

    return (
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: color + "30" }]}>
          <Text style={{ fontSize: 18, color }}>
            {item.type === "SALE" ? "₵" : item.type === "REFUND" ? "↺" : item.type === "PRICE_CHANGE" ? "✎" : "•"}
          </Text>
        </View>
        <View style={styles.rowContent}>
          <View style={styles.rowHeader}>
            <Text style={styles.action}>{info.actionLabel}</Text>
            {info.amountStr ? (
              <Text style={[styles.amount, { color: item.type === "SALE" ? theme.success : item.type === "REFUND" ? theme.error : theme.text }]}>
                {info.amountStr}
              </Text>
            ) : null}
          </View>
          {info.detailsStr ? <Text style={styles.details}>{info.detailsStr}</Text> : null}
          <Text style={styles.meta}>
            {item.userName ?? "—"} ({item.type}) · {formatTime(item.timestamp)}
          </Text>
          {info.hasManagerApproval ? (
            <View style={styles.approvalBadge}>
              <Text style={styles.approvalBadgeText}>Manager Approved</Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "SALE", label: "Sales" },
    { key: "REFUND", label: "Refunds" },
    { key: "CASH", label: "Cash" },
  ];

  const header = (
    <>
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{loading ? "—" : stats.total}</Text>
          <Text style={styles.metricLabel}>Total Logs</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{loading ? "—" : stats.activeUsers}</Text>
          <Text style={styles.metricLabel}>Active Users</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{loading ? "—" : stats.approvals}</Text>
          <Text style={styles.metricLabel}>Approvals</Text>
        </View>
      </View>
      <View style={styles.tabs}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, filter === t.key && styles.tabActive]}
            onPress={() => setFilter(t.key)}
          >
            <Text style={[styles.tabText, filter === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.content}>
          {header}
          <Text style={styles.loading}>Loading…</Text>
        </View>
      ) : logs.length === 0 ? (
        <View style={styles.content}>
          {header}
          <Text style={styles.empty}>No activity yet</Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={<View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.md }}>{header}</View>}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}
