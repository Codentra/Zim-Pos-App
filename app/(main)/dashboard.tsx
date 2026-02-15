import { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/contexts/ThemeContext";
import {
  getDashboardStats,
  getLowStockProducts,
} from "@/lib/data/repositories/reportsRepo";
import { spacing, borderRadius } from "@/constants/theme";

function formatCents(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardScreen() {
  const router = useRouter();
  const theme = useColors();
  const { user } = useAuth();
  const [stats, setStats] = useState<{
    todaySalesCents: number;
    todayTransactions: number;
    cashInDrawerCents: number;
    productsSoldToday: number;
  } | null>(null);
  const [lowStock, setLowStock] = useState<{ name: string; stock: number }[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [s, ls] = await Promise.all([
        getDashboardStats(),
        getLowStockProducts(),
      ]);
      setStats(s);
      setLowStock(ls.map((p) => ({ name: p.name, stock: p.stock })));
    } catch {
      setStats(null);
      setLowStock([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const firstName = user?.name?.split(" ")[0] ?? "Owner";
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        content: {
          padding: spacing.lg,
          paddingTop: 48,
          paddingBottom: spacing.xl * 2,
        },
        greeting: {
          fontSize: 22,
          fontWeight: "700",
          color: theme.text,
          marginBottom: spacing.xs,
        },
        date: {
          fontSize: 14,
          color: theme.textSecondary,
          marginBottom: spacing.xs,
        },
        role: {
          fontSize: 13,
          color: theme.primary,
          fontWeight: "600",
          marginBottom: spacing.lg,
        },
        kpiRow: {
          flexDirection: "row",
          gap: spacing.md,
          marginBottom: spacing.md,
        },
        kpiCard: {
          flex: 1,
          backgroundColor: theme.surface,
          padding: spacing.md,
          borderRadius: borderRadius.md,
          borderWidth: 1,
          borderColor: theme.border,
        },
        kpiValue: {
          fontSize: 18,
          fontWeight: "700",
          color: theme.text,
        },
        kpiLabel: {
          fontSize: 12,
          color: theme.textSecondary,
          marginTop: spacing.xs,
        },
        alert: {
          backgroundColor: "#fef3c7",
          padding: spacing.md,
          borderRadius: borderRadius.md,
          marginBottom: spacing.md,
          borderWidth: 1,
          borderColor: "#f59e0b",
        },
        alertTitle: {
          fontSize: 14,
          fontWeight: "600",
          color: "#92400e",
        },
        alertText: {
          fontSize: 13,
          color: "#92400e",
          marginTop: spacing.xs,
        },
        alertLink: { marginTop: spacing.sm },
        alertLinkText: {
          fontSize: 13,
          fontWeight: "600",
          color: "#b45309",
        },
        offlineBanner: {
          paddingVertical: spacing.sm,
          marginBottom: spacing.md,
        },
        offlineText: {
          fontSize: 12,
          color: theme.textSecondary,
        },
        primaryCard: {
          backgroundColor: theme.primary,
          padding: spacing.lg,
          borderRadius: borderRadius.lg,
          marginBottom: spacing.lg,
          borderWidth: 0,
        },
        primaryCardTitle: {
          fontSize: 20,
          fontWeight: "700",
          color: theme.primaryText,
        },
        primaryCardSubtitle: {
          fontSize: 14,
          color: "rgba(255,255,255,0.9)",
          marginTop: spacing.xs,
        },
        actions: { gap: spacing.md },
        card: {
          backgroundColor: theme.surface,
          padding: spacing.lg,
          borderRadius: borderRadius.md,
          borderWidth: 1,
          borderColor: theme.border,
        },
        cardTitle: {
          fontSize: 18,
          fontWeight: "600",
          color: theme.text,
        },
        cardSubtitle: {
          fontSize: 14,
          color: theme.textSecondary,
          marginTop: spacing.xs,
        },
        footer: { height: spacing.xl },
      }),
    [theme]
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.primary}
        />
      }
    >
      {/* Header: greeting + date */}
      <Text style={styles.greeting}>
        {getGreeting()}, {firstName}
      </Text>
      <Text style={styles.date}>{formatDate()}</Text>
      {user ? (
        <Text style={styles.role}>{user.role}</Text>
      ) : null}

      {/* KPI cards */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>
            {loading ? "—" : formatCents(stats?.todaySalesCents ?? 0)}
          </Text>
          <Text style={styles.kpiLabel}>Sales today</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>
            {loading ? "—" : stats?.todayTransactions ?? 0}
          </Text>
          <Text style={styles.kpiLabel}>Transactions</Text>
        </View>
      </View>
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>
            {loading ? "—" : formatCents(stats?.cashInDrawerCents ?? 0)}
          </Text>
          <Text style={styles.kpiLabel}>Cash in drawer</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiValue}>
            {loading ? "—" : stats?.productsSoldToday ?? 0}
          </Text>
          <Text style={styles.kpiLabel}>Products sold</Text>
        </View>
      </View>

      {/* Alerts */}
      {lowStock.length > 0 && (
        <View style={styles.alert}>
          <Text style={styles.alertTitle}>⚠️ Low stock</Text>
          <Text style={styles.alertText}>
            {lowStock.slice(0, 3).map((p) => `${p.name} (${p.stock})`).join(", ")}
            {lowStock.length > 3 ? ` +${lowStock.length - 3} more` : ""}
          </Text>
          <TouchableOpacity
            style={styles.alertLink}
            onPress={() => router.push("/(main)/products")}
          >
            <Text style={styles.alertLinkText}>View products</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.offlineBanner}>
        <Text style={styles.offlineText}>● Offline – data saved locally</Text>
      </View>

      {/* Primary CTA: New Sale */}
      <TouchableOpacity
        style={styles.primaryCard}
        onPress={() => router.push("/(main)/sale")}
        activeOpacity={0.9}
      >
        <Text style={styles.primaryCardTitle}>New Sale</Text>
        <Text style={styles.primaryCardSubtitle}>Start a sale</Text>
      </TouchableOpacity>

      {/* Quick actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(main)/products")}
        >
          <Text style={styles.cardTitle}>Products</Text>
          <Text style={styles.cardSubtitle}>Add and manage products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(main)/customers")}
        >
          <Text style={styles.cardTitle}>Customers</Text>
          <Text style={styles.cardSubtitle}>Manage customers & credit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(main)/reports")}
        >
          <Text style={styles.cardTitle}>Reports</Text>
          <Text style={styles.cardSubtitle}>Sales, top products, low stock</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(main)/cash")}
        >
          <Text style={styles.cardTitle}>Cash Management</Text>
          <Text style={styles.cardSubtitle}>Open / close shift</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(main)/refunds")}
        >
          <Text style={styles.cardTitle}>Refunds</Text>
          <Text style={styles.cardSubtitle}>Process refunds</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(main)/stock")}
        >
          <Text style={styles.cardTitle}>Stock Receiving</Text>
          <Text style={styles.cardSubtitle}>Receive stock</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(main)/activity-logs")}
        >
          <Text style={styles.cardTitle}>Activity logs</Text>
          <Text style={styles.cardSubtitle}>Audit trail, approvals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(main)/system-status")}
        >
          <Text style={styles.cardTitle}>System status</Text>
          <Text style={styles.cardSubtitle}>Sync & pending uploads</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(main)/hardware-setup")}
        >
          <Text style={styles.cardTitle}>Hardware setup</Text>
          <Text style={styles.cardSubtitle}>Printer, scanner</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/(main)/settings")}
        >
          <Text style={styles.cardTitle}>Settings</Text>
          <Text style={styles.cardSubtitle}>Account, business, sync</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}
