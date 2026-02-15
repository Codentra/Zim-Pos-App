import { useCallback, useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useColors } from "@/contexts/ThemeContext";
import {
  listCustomers,
  listCustomersWithCredit,
  listVipCustomers,
  searchCustomers,
} from "@/lib/data/repositories/customersRepo";
import type { Customer } from "@/lib/domain/types";
import { spacing, borderRadius } from "@/constants/theme";

function formatCents(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}

type Tab = "all" | "credit" | "vip";

export default function CustomersScreen() {
  const theme = useColors();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, credit: 0, vip: 0, owed: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [all, credit, vip] = await Promise.all([
        listCustomers(),
        listCustomersWithCredit(),
        listVipCustomers(),
      ]);
      const owed = credit.reduce((s, c) => s + c.creditBalanceCents, 0);
      setStats({
        total: all.length,
        credit: credit.length,
        vip: vip.length,
        owed,
      });
      if (search.trim()) {
        const found = await searchCustomers(search);
        setCustomers(found);
      } else {
        if (tab === "credit") setCustomers(credit);
        else if (tab === "vip") setCustomers(vip);
        else setCustomers(all);
      }
    } finally {
      setLoading(false);
    }
  }, [tab, search]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  useEffect(() => {
    load();
  }, [search, tab, load]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, padding: spacing.lg, backgroundColor: theme.background },
        statsRow: { flexDirection: "row" as const, gap: spacing.sm, marginBottom: spacing.md },
        statBox: { flex: 1, backgroundColor: theme.surface, padding: spacing.sm, borderRadius: borderRadius.md, alignItems: "center" as const, borderWidth: 1, borderColor: theme.border },
        statValue: { fontSize: 14, fontWeight: "700" as const, color: theme.text },
        statLabel: { fontSize: 11, color: theme.textSecondary, marginTop: 2 },
        search: { borderWidth: 1, borderColor: theme.border, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md, backgroundColor: theme.surface, fontSize: 16, color: theme.text },
        tabs: { flexDirection: "row" as const, gap: spacing.sm, marginBottom: spacing.md },
        tab: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.md, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border },
        tabActive: { backgroundColor: theme.primary, borderColor: theme.primary },
        tabText: { fontSize: 14, color: theme.text },
        tabTextActive: { color: theme.primaryText },
        addBtn: { backgroundColor: theme.primary, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: "center" as const, marginBottom: spacing.md },
        addBtnText: { color: theme.primaryText, fontSize: 16, fontWeight: "600" as const },
        loading: { color: theme.textSecondary, textAlign: "center" as const, marginTop: spacing.lg },
        empty: { color: theme.textSecondary, textAlign: "center" as const, marginTop: spacing.lg },
        list: { paddingBottom: spacing.xl * 2 },
        card: { backgroundColor: theme.surface, padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: theme.border },
        cardHeader: { flexDirection: "row" as const, alignItems: "center", gap: spacing.sm },
        name: { fontSize: 16, fontWeight: "600" as const, color: theme.text },
        vipBadge: { fontSize: 11, fontWeight: "600" as const, color: theme.primary, backgroundColor: `${theme.primary}20`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
        phone: { fontSize: 14, color: theme.textSecondary, marginTop: spacing.xs },
        owed: { fontSize: 13, color: theme.error, marginTop: spacing.xs },
      }),
    [theme]
  );

  const renderItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: "/(main)/customers/[id]", params: { id: item.id } })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        {item.isVip ? <Text style={styles.vipBadge}>VIP</Text> : null}
      </View>
      <Text style={styles.phone}>{item.phone || "—"}</Text>
      {item.creditBalanceCents > 0 ? (
        <Text style={styles.owed}>Owed: {formatCents(item.creditBalanceCents)}</Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.credit}</Text>
          <Text style={styles.statLabel}>Credit</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.vip}</Text>
          <Text style={styles.statLabel}>VIP</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{formatCents(stats.owed)}</Text>
          <Text style={styles.statLabel}>Owed</Text>
        </View>
      </View>

      <TextInput
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholder="Search by name, phone, email"
        placeholderTextColor={theme.textSecondary}
      />

      <View style={styles.tabs}>
        {(["all", "credit", "vip"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === "all" ? "All" : t === "credit" ? "Credit" : "VIP"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/(main)/customers/add")}
      >
        <Text style={styles.addBtnText}>+ Add customer</Text>
      </TouchableOpacity>

      {loading ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : customers.length === 0 ? (
        <Text style={styles.empty}>No customers.</Text>
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

