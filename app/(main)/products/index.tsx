import { useCallback, useState, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { listProducts } from "@/lib/data/repositories/productsRepo";
import type { Product } from "@/lib/domain/types";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";
import { Button } from "@/components/ui/Button";

function formatCents(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}

export default function ProductsScreen() {
  const theme = useColors();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, padding: spacing.lg, backgroundColor: theme.background },
        addButton: { marginBottom: spacing.lg, minHeight: 48 },
        loading: { color: theme.textSecondary, textAlign: "center", marginTop: spacing.xl },
        empty: { color: theme.textSecondary, textAlign: "center", marginTop: spacing.xl },
        list: { paddingBottom: spacing.xl },
        row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: theme.surface, padding: spacing.lg, borderRadius: borderRadius.xl, marginBottom: spacing.sm, borderWidth: 1, borderColor: theme.border },
        rowLeft: { flex: 1 },
        name: { fontSize: 16, fontWeight: "600", color: theme.text },
        meta: { fontSize: 13, color: theme.textSecondary, marginTop: spacing.xs },
        arrow: { fontSize: 20, color: theme.textSecondary },
      }),
    [theme]
  );

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
      <Button title="+ Add product" onPress={() => router.push("/(main)/products/add")} style={styles.addButton} />
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
