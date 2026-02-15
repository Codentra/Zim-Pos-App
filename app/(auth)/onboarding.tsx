/**
 * Onboarding wizard. Add product, payment methods, opening cash, finish.
 */
import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { useColors } from "@/contexts/ThemeContext";
import { createProduct } from "@/lib/data/repositories/productsRepo";
import { openShift } from "@/lib/data/repositories/cashRepo";
import { getDb } from "@/lib/data/db";
import type { PaymentMethod } from "@/lib/domain/types";
import { spacing, borderRadius } from "@/constants/theme";

const PAYMENT_METHODS: PaymentMethod[] = ["CASH", "ECOCASH", "ONEMONEY", "ZIPIT"];

type Step = 1 | 2 | 3 | 4;

export default function OnboardingScreen() {
  const theme = useColors();
  const router = useRouter();
  const { user } = useAuth();
  const { setOnboarded } = useBusiness();
  const [step, setStep] = useState<Step>(1);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("10");
  const [selectedMethods, setSelectedMethods] = useState<Set<PaymentMethod>>(
    new Set(["CASH", "ECOCASH", "ONEMONEY", "ZIPIT"])
  );
  const [openingCash, setOpeningCash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        progress: { flexDirection: "row", justifyContent: "center", gap: spacing.sm, paddingTop: spacing.lg, paddingBottom: spacing.md },
        dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.border },
        dotActive: { backgroundColor: theme.primary },
        scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
        title: { fontSize: 24, fontWeight: "700", color: theme.text, marginBottom: spacing.xs },
        subtitle: { fontSize: 16, color: theme.textSecondary, marginBottom: spacing.lg },
        label: { fontSize: 14, fontWeight: "600", color: theme.text, marginTop: spacing.md, marginBottom: spacing.xs },
        input: {
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          fontSize: 16,
          color: theme.text,
          backgroundColor: theme.surface,
        },
        methodCard: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: spacing.md,
          backgroundColor: theme.surface,
          borderRadius: borderRadius.md,
          marginBottom: spacing.sm,
          borderWidth: 2,
          borderColor: theme.border,
        },
        methodCardSelected: { borderColor: theme.primary },
        methodText: { fontSize: 16, fontWeight: "600", color: theme.text },
        check: { fontSize: 18, color: theme.primary },
        error: { color: theme.error, marginTop: spacing.md },
        button: {
          backgroundColor: theme.primary,
          paddingVertical: spacing.md,
          borderRadius: borderRadius.md,
          alignItems: "center",
          marginTop: spacing.xl,
        },
        buttonDisabled: { opacity: 0.6 },
        buttonText: { color: theme.primaryText, fontSize: 16, fontWeight: "600" },
      }),
    [theme]
  );

  const toggleMethod = (m: PaymentMethod) => {
    setSelectedMethods((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  };

  const handleStep1 = async () => {
    setError("");
    if (!productName.trim()) {
      setError("Enter product name");
      return;
    }
    const priceCents = Math.round(parseFloat(productPrice || "0") * 100);
    if (priceCents <= 0) {
      setError("Enter a valid price");
      return;
    }
    const stock = parseInt(productStock || "0", 10);
    if (stock < 0) {
      setError("Stock cannot be negative");
      return;
    }
    setLoading(true);
    try {
      await createProduct({
        name: productName.trim(),
        priceCents,
        stock,
      });
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = () => {
    if (selectedMethods.size === 0) {
      setError("Select at least one payment method");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleStep3 = async () => {
    setError("");
    const cashCents = Math.round(parseFloat(openingCash || "0") * 100);
    if (cashCents < 0) {
      setError("Opening cash cannot be negative");
      return;
    }
    if (!user) {
      setError("Session expired");
      return;
    }
    setLoading(true);
    try {
      const db = await getDb();
      await db.runAsync(
        "INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)",
        "paymentMethods",
        Array.from(selectedMethods).join(",")
      );
      await openShift({ openingFloatCents: cashCents, userId: user.id });
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to set opening cash");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await setOnboarded(true);
      router.replace("/(main)/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to complete setup");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.progress}>
        {[1, 2, 3, 4].map((s) => (
          <View
            key={s}
            style={[
              styles.dot,
              step >= s && styles.dotActive,
            ]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {step === 1 && (
          <>
            <Text style={styles.title}>Add Your First Product</Text>
            <Text style={styles.subtitle}>Quick setup to get you selling.</Text>
            <Text style={styles.label}>Product name</Text>
            <TextInput
              style={styles.input}
              value={productName}
              onChangeText={setProductName}
              placeholder="e.g. Bread"
              placeholderTextColor={theme.textSecondary}
            />
            <Text style={styles.label}>Price ($)</Text>
            <TextInput
              style={styles.input}
              value={productPrice}
              onChangeText={setProductPrice}
              placeholder="1.50"
              placeholderTextColor={theme.textSecondary}
              keyboardType="decimal-pad"
            />
            <Text style={styles.label}>Initial stock</Text>
            <TextInput
              style={styles.input}
              value={productStock}
              onChangeText={setProductStock}
              placeholder="10"
              placeholderTextColor={theme.textSecondary}
              keyboardType="number-pad"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleStep1}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Next: Payment Methods</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Payment Methods</Text>
            <Text style={styles.subtitle}>Select the methods you accept.</Text>
            {PAYMENT_METHODS.map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.methodCard, selectedMethods.has(m) && styles.methodCardSelected]}
                onPress={() => toggleMethod(m)}
              >
                <Text style={styles.methodText}>{m}</Text>
                {selectedMethods.has(m) ? (
                  <Text style={styles.check}>✓</Text>
                ) : null}
              </TouchableOpacity>
            ))}
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleStep2}>
              <Text style={styles.buttonText}>Next: Opening Cash</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>Opening Cash Balance</Text>
            <Text style={styles.subtitle}>Optional. Amount in register at start of day.</Text>
            <TextInput
              style={styles.input}
              value={openingCash}
              onChangeText={setOpeningCash}
              placeholder="0.00"
              placeholderTextColor={theme.textSecondary}
              keyboardType="decimal-pad"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleStep3}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.title}>You're Ready!</Text>
            <Text style={styles.subtitle}>Your POS is set up. Start selling.</Text>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleFinish}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Finishing…" : "Go to Dashboard"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

