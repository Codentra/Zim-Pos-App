import { useCallback, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthContext";
import { listProducts } from "@/lib/data/repositories/productsRepo";
import { createStockReceipt } from "@/lib/data/repositories/stockRepo";
import type { Product } from "@/lib/domain/types";
import { colors, spacing, borderRadius } from "@/constants/theme";

type ReceiptLine = { productId: string; name: string; quantity: number; unitCostCents: number };

function formatCents(c: number): string {
  return "$" + (c / 100).toFixed(2);
}

export default function StockReceivingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [supplierName, setSupplierName] = useState("");
  const [lines, setLines] = useState<ReceiptLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      listProducts().then(setProducts);
    }, [])
  );

  const addLine = (p: Product) => {
    const existing = lines.find((l) => l.productId === p.id);
    if (existing) {
      setLines(lines.map((l) => (l.productId === p.id ? { ...l, quantity: l.quantity + 1 } : l)));
    } else {
      setLines([...lines, { productId: p.id, name: p.name, quantity: 1, unitCostCents: p.costCents || 0 }]);
    }
  };

  const updateLine = (productId: string, updates: Partial<ReceiptLine>) => {
    setLines(lines.map((l) => (l.productId === productId ? { ...l, ...updates } : l)));
  };

  const removeLine = (productId: string) => {
    setLines(lines.filter((l) => l.productId !== productId));
  };

  const totalCents = lines.reduce((s, l) => s + l.quantity * l.unitCostCents, 0);

  const handleSave = async () => {
    if (!user || lines.length === 0) {
      setError("Add at least one product");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await createStockReceipt({
        supplierName: supplierName.trim() || "Supplier",
        items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity, unitCostCents: l.unitCostCents })),
        receivedByUserId: user.id,
      });
      setLines([]);
      setSupplierName("");
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Stock Receiving</Text>
      <Text style={styles.label}>Supplier</Text>
      <TextInput
        style={styles.input}
        value={supplierName}
        onChangeText={setSupplierName}
        placeholder="Supplier name"
        placeholderTextColor={colors.light.textSecondary}
      />
      <Text style={styles.label}>Add products</Text>
      {products.slice(0, 20).map((p) => (
        <TouchableOpacity key={p.id} style={styles.productRow} onPress={() => addLine(p)}>
          <Text style={styles.productName}>{p.name}</Text>
          <Text style={styles.productMeta}>Stock: {p.stock}</Text>
        </TouchableOpacity>
      ))}
      {lines.length > 0 && (
        <>
          <Text style={styles.label}>Receiving</Text>
          {lines.map((l) => (
            <View key={l.productId} style={styles.lineRow}>
              <Text style={styles.lineName}>{l.name}</Text>
              <TextInput
                style={styles.qtyInput}
                value={String(l.quantity)}
                onChangeText={(t) => updateLine(l.productId, { quantity: parseInt(t, 10) || 0 })}
                keyboardType="number-pad"
              />
              <TextInput
                style={styles.costInput}
                value={String(l.unitCostCents / 100)}
                onChangeText={(t) => updateLine(l.productId, { unitCostCents: Math.round(parseFloat(t || "0") * 100) })}
                keyboardType="decimal-pad"
              />
              <TouchableOpacity onPress={() => removeLine(l.productId)}>
                <Text style={styles.removeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <Text style={styles.total}>Total: {formatCents(totalCents)}</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSave} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Saving…" : "Save receipt"}</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  content: { padding: spacing.lg, paddingTop: 48, paddingBottom: spacing.xl * 2 },
  title: { fontSize: 22, fontWeight: "700", color: colors.light.text, marginBottom: spacing.lg },
  label: { fontSize: 14, fontWeight: "600", color: colors.light.text, marginTop: spacing.md, marginBottom: spacing.xs },
  input: { borderWidth: 1, borderColor: colors.light.border, borderRadius: borderRadius.md, padding: spacing.md, color: colors.light.text, marginBottom: spacing.sm },
  productRow: { flexDirection: "row", justifyContent: "space-between", padding: spacing.sm, backgroundColor: colors.light.surface, borderRadius: borderRadius.sm, marginBottom: spacing.xs },
  productName: { fontSize: 14, color: colors.light.text },
  productMeta: { fontSize: 12, color: colors.light.textSecondary },
  lineRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.sm },
  lineName: { flex: 1, fontSize: 14, color: colors.light.text },
  qtyInput: { width: 50, borderWidth: 1, borderColor: colors.light.border, borderRadius: borderRadius.sm, padding: spacing.xs, marginRight: spacing.xs, color: colors.light.text },
  costInput: { width: 70, borderWidth: 1, borderColor: colors.light.border, borderRadius: borderRadius.sm, padding: spacing.xs, marginRight: spacing.xs, color: colors.light.text },
  removeBtn: { color: colors.light.error, fontSize: 18 },
  total: { fontSize: 16, fontWeight: "700", color: colors.light.text, marginTop: spacing.md },
  error: { color: colors.light.error, marginTop: spacing.sm },
  button: { backgroundColor: colors.light.primary, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: "center", marginTop: spacing.lg },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.light.primaryText, fontSize: 16, fontWeight: "600" },
});
