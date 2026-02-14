import { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { listProducts } from "@/lib/data/repositories/productsRepo";
import type { Product } from "@/lib/domain/types";
import { colors, spacing, borderRadius } from "@/constants/theme";

function formatCents(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}

export default function ProductsScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listProducts();
      setProducts(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push({ pathname: "/(main)/products/[id]", params: { id: item.id } })}
    >
      <View style={styles.rowLeft}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>{item.category || "—"} · {formatCents(item.priceCents)} · Stock: {item.stock}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(main)/products/add")}>
        <Text style={styles.addButtonText}>+ Add product</Text>
      </TouchableOpacity>
      {loading ? (
        <Text style={styles.loading}>Loading…</Text>
      ) : products.length === 0 ? (
        <Text style={styles.empty}>No products. Add one above.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.light.background,
  },
  addButton: {
    backgroundColor: colors.light.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  addButtonText: {
    color: colors.light.primaryText,
    fontSize: 16,
    fontWeight: "600",
  },
  loading: {
    color: colors.light.textSecondary,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  empty: {
    color: colors.light.textSecondary,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.light.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  rowLeft: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.light.text,
  },
  meta: {
    fontSize: 13,
    color: colors.light.textSecondary,
    marginTop: spacing.xs,
  },
  arrow: {
    fontSize: 20,
    color: colors.light.textSecondary,
  },
});
