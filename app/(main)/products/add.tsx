import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { createProduct } from "@/lib/data/repositories/productsRepo";
import { colors, spacing, borderRadius } from "@/constants/theme";

export default function AddProductScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [priceStr, setPriceStr] = useState("");
  const [stockStr, setStockStr] = useState("0");
  const [lowStockStr, setLowStockStr] = useState("0");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
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
      await createProduct({
        name: name.trim(),
        category: category.trim(),
        sku: sku.trim(),
        barcode: barcode.trim(),
        priceCents,
        costCents: 0,
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
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Saving…" : "Save product"}</Text>
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
