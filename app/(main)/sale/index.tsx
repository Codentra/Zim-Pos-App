import { useCallback, useState, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthContext";
import { useSale } from "@/contexts/SaleContext";
import { useColors } from "@/contexts/ThemeContext";
import { useCurrencyFormatSafe } from "@/lib/currencyFormat";
import { listProducts } from "@/lib/data/repositories/productsRepo";
import type { Product } from "@/lib/domain/types";
import { spacing, borderRadius } from "@/constants/theme";

export default function NewSaleScreen() {
  const theme = useColors();
  const router = useRouter();
  const formatCents = useCurrencyFormatSafe();
  const { user } = useAuth();
  const { cart, addToCart, removeFromCart, updateQuantity, subtotalCents, totalCents, discountCents, setDiscountCents } = useSale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, padding: spacing.lg, paddingTop: 48, backgroundColor: theme.background },
        title: { fontSize: 22, fontWeight: "700", color: theme.text, marginBottom: spacing.md },
        loading: { color: theme.textSecondary, marginTop: spacing.lg },
        row: { gap: spacing.sm, marginBottom: spacing.sm },
        productCard: { flex: 1, backgroundColor: theme.surface, padding: spacing.md, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: theme.border },
        productCardDisabled: { opacity: 0.5 },
        productName: { fontSize: 14, fontWeight: "600", color: theme.text },
        productPrice: { fontSize: 16, color: theme.primary, marginTop: spacing.xs },
        productStock: { fontSize: 12, color: theme.textSecondary, marginTop: spacing.xs },
        cartBar: { position: "absolute" as const, bottom: 0, left: 0, right: 0, backgroundColor: theme.surface, borderTopWidth: 1, borderColor: theme.border, padding: spacing.md },
        cartRow: { flexDirection: "row" as const, justifyContent: "space-between", marginBottom: spacing.xs },
        cartLabel: { fontSize: 14, color: theme.textSecondary },
        cartSubtotal: { fontSize: 14, color: theme.text },
        cartTotalLabel: { fontSize: 16, fontWeight: "600", color: theme.text },
        cartTotal: { fontSize: 18, fontWeight: "700", color: theme.text },
        checkoutBtn: { backgroundColor: theme.primary, paddingVertical: spacing.md, borderRadius: borderRadius.xl, alignItems: "center", marginTop: spacing.sm, minHeight: 48 },
        checkoutBtnText: { color: theme.primaryText, fontSize: 16, fontWeight: "600" },
      }),
    [theme]
  );

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

