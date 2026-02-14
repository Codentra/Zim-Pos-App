import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getProductById, updateProduct } from "@/lib/data/repositories/productsRepo";
import type { Product } from "@/lib/domain/types";
import { colors, spacing, borderRadius } from "@/constants/theme";

export default function EditProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [priceStr, setPriceStr] = useState("");
  const [stockStr, setStockStr] = useState("");
  const [lowStockStr, setLowStockStr] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const p = await getProductById(id);
      if (p) {
        setProduct(p);
        setName(p.name);
        setCategory(p.category);
        setSku(p.sku);
        setBarcode(p.barcode);
        setPriceStr((p.priceCents / 100).toFixed(2));
        setStockStr(String(p.stock));
        setLowStockStr(String(p.lowStockThreshold));
        setDescription(p.description);
      }
    })();
  }, [id]);

  const handleSave = async () => {
    if (!product || !id) return;
    setError("");
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    const priceCents = Math.round(parseFloat(priceStr || "0") * 100);
    if (isNaN(priceCents) || priceCents < 0) {
      setError("Enter a valid price");
      return;
    }
    const stock = parseInt(stockStr || "0", 10) || 0;
    const lowStockThreshold = parseInt(lowStockStr || "0", 10) || 0;
    setLoading(true);
    try {
      await updateProduct(id, {
        name: name.trim(),
        category: category.trim(),
        sku: sku.trim(),
        barcode: barcode.trim(),
        priceCents,
        stock,
        lowStockThreshold,
        description: description.trim(),
      });
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  if (!product && id) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading…</Text>
      </View>
    );
  }
  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Product name"
        placeholderTextColor={colors.light.textSecondary}
        editable={!loading}
      />
      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="e.g. Beverages"
        placeholderTextColor={colors.light.textSecondary}
        editable={!loading}
      />
      <Text style={styles.label}>SKU</Text>
      <TextInput
        style={styles.input}
        value={sku}
        onChangeText={setSku}
        placeholder="Stock keeping unit"
        placeholderTextColor={colors.light.textSecondary}
        editable={!loading}
      />
      <Text style={styles.label}>Barcode</Text>
      <TextInput
        style={styles.input}
        value={barcode}
        onChangeText={setBarcode}
        placeholder="Barcode"
        placeholderTextColor={colors.light.textSecondary}
        editable={!loading}
      />
      <Text style={styles.label}>Price *</Text>
      <TextInput
        style={styles.input}
        value={priceStr}
        onChangeText={setPriceStr}
        placeholder="0.00"
        keyboardType="decimal-pad"
        placeholderTextColor={colors.light.textSecondary}
        editable={!loading}
      />
      <Text style={styles.label}>Stock</Text>
      <TextInput
        style={styles.input}
        value={stockStr}
        onChangeText={setStockStr}
        placeholder="0"
        keyboardType="number-pad"
        placeholderTextColor={colors.light.textSecondary}
        editable={!loading}
      />
      <Text style={styles.label}>Low stock alert at</Text>
      <TextInput
        style={styles.input}
        value={lowStockStr}
        onChangeText={setLowStockStr}
        placeholder="0"
        keyboardType="number-pad"
        placeholderTextColor={colors.light.textSecondary}
        editable={!loading}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Optional"
        placeholderTextColor={colors.light.textSecondary}
        multiline
        editable={!loading}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Saving…" : "Save changes"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  loading: {
    color: colors.light.textSecondary,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.light.text,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.light.text,
    backgroundColor: colors.light.surface,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  error: {
    color: colors.light.error,
    marginTop: spacing.xl,
    textAlign: "center",
  },
  errorText: {
    color: colors.light.error,
    marginTop: spacing.sm,
  },
  button: {
    backgroundColor: colors.light.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginTop: spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.light.primaryText,
    fontSize: 16,
    fontWeight: "600",
  },
});
