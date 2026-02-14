import { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthContext";
import { useSale } from "@/contexts/SaleContext";
import { listProducts } from "@/lib/data/repositories/productsRepo";
import type { Product } from "@/lib/domain/types";
import { colors, spacing, borderRadius } from "@/constants/theme";

function formatCents(c: number): string {
  return "$" + (c / 100).toFixed(2);
}

export default function NewSaleScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, addToCart, removeFromCart, updateQuantity, subtotalCents, totalCents, discountCents, setDiscountCents } = useSale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      listProducts().then((list) => {
        if (!cancelled) setProducts(list);
      }).finally(() => { if (!cancelled) setLoading(false); });
      return () => { cancelled = true; };
    }, [])
  );

  const onAddProduct = (p: Product) => {
    if (p.stock < 1) return;
    addToCart({
      productId: p.id,
      name: p.name,
      unitPriceCents: p.priceCents,
      quantity: 1,
    });
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Sale</Text>
      {loading ? (
        <Text style={styles.loading}>Loading products…</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.productCard, item.stock < 1 && styles.productCardDisabled]}
              onPress={() => onAddProduct(item)}
              disabled={item.stock < 1}
            >
              <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.productPrice}>{formatCents(item.priceCents)}</Text>
              <Text style={styles.productStock}>Stock: {item.stock}</Text>
            </TouchableOpacity>
          )}
          ListFooterComponent={<View style={{ height: 120 }} />}
        />
      )}

      <View style={styles.cartBar}>
        <View style={styles.cartRow}>
          <Text style={styles.cartLabel}>Cart ({cart.length} items)</Text>
          <Text style={styles.cartSubtotal}>{formatCents(subtotalCents)}</Text>
        </View>
        {cart.length > 0 && (
          <>
            <View style={styles.cartRow}>
              <Text style={styles.cartLabel}>Discount</Text>
              <Text style={styles.cartSubtotal}>-{formatCents(discountCents)}</Text>
            </View>
            <View style={styles.cartRow}>
              <Text style={styles.cartTotalLabel}>Total</Text>
              <Text style={styles.cartTotal}>{formatCents(totalCents)}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => router.push("/(main)/sale/payment")}
            >
              <Text style={styles.checkoutBtnText}>Checkout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, paddingTop: 48, backgroundColor: colors.light.background },
  title: { fontSize: 22, fontWeight: "700", color: colors.light.text, marginBottom: spacing.md },
  loading: { color: colors.light.textSecondary, marginTop: spacing.lg },
  row: { gap: spacing.sm, marginBottom: spacing.sm },
  productCard: {
    flex: 1,
    backgroundColor: colors.light.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  productCardDisabled: { opacity: 0.5 },
  productName: { fontSize: 14, fontWeight: "600", color: colors.light.text },
  productPrice: { fontSize: 16, color: colors.light.primary, marginTop: spacing.xs },
  productStock: { fontSize: 12, color: colors.light.textSecondary, marginTop: spacing.xs },
  cartBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.light.surface,
    borderTopWidth: 1,
    borderColor: colors.light.border,
    padding: spacing.md,
  },
  cartRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs },
  cartLabel: { fontSize: 14, color: colors.light.textSecondary },
  cartSubtotal: { fontSize: 14, color: colors.light.text },
  cartTotalLabel: { fontSize: 16, fontWeight: "600", color: colors.light.text },
  cartTotal: { fontSize: 18, fontWeight: "700", color: colors.light.text },
  checkoutBtn: {
    backgroundColor: colors.light.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  checkoutBtnText: { color: colors.light.primaryText, fontSize: 16, fontWeight: "600" },
});
