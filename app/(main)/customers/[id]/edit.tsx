import { useState, useCallback, useMemo } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useColors } from "@/contexts/ThemeContext";
import { getCustomerById, updateCustomer } from "@/lib/data/repositories/customersRepo";
import type { Customer } from "@/lib/domain/types";
import { spacing, borderRadius } from "@/constants/theme";

function formatCentsForEdit(cents: number): string {
  return (cents / 100).toFixed(2);
}

export default function EditCustomerScreen() {
  const theme = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [isVip, setIsVip] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      getCustomerById(id).then((c) => {
        if (c) {
          setCustomer(c);
          setName(c.name);
          setPhone(c.phone || "");
          setEmail(c.email || "");
          setLocation(c.location || "");
          setCreditLimit(formatCentsForEdit(c.creditLimitCents));
          setIsVip(c.isVip === 1);
          setNotes(c.notes || "");
        }
      });
    }, [id])
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
        label: { fontSize: 14, fontWeight: "600" as const, color: theme.text, marginTop: spacing.md, marginBottom: spacing.xs },
        input: { borderWidth: 1, borderColor: theme.border, borderRadius: borderRadius.md, padding: spacing.md, fontSize: 16, color: theme.text, backgroundColor: theme.surface },
        notesInput: { minHeight: 80, textAlignVertical: "top" as const },
        checkRow: { flexDirection: "row" as const, alignItems: "center", justifyContent: "space-between", padding: spacing.md, marginTop: spacing.md, backgroundColor: theme.surface, borderRadius: borderRadius.md, borderWidth: 1, borderColor: theme.border },
        checkRowActive: { borderColor: theme.primary, backgroundColor: `${theme.primary}10` },
        checkText: { fontSize: 16, color: theme.text },
        checkMark: { fontSize: 18, color: theme.primary, fontWeight: "700" as const },
        error: { color: theme.error, marginTop: spacing.md },
        saveBtn: { backgroundColor: theme.primary, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: "center" as const, marginTop: spacing.xl },
        saveBtnDisabled: { opacity: 0.6 },
        saveBtnText: { color: theme.primaryText, fontSize: 16, fontWeight: "600" as const },
      }),
    [theme]
  );

  const handleSave = async () => {
    setError("");
    if (!customer) return;
    if (!name.trim()) {
      setError("Enter customer name");
      return;
    }
    setLoading(true);
    try {
      await updateCustomer(customer.id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        location: location.trim(),
        creditLimitCents: Math.round(parseFloat(creditLimit || "0") * 100),
        isVip,
        notes: notes.trim(),
      });
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Customer name"
          placeholderTextColor={theme.textSecondary}
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+263..."
          placeholderTextColor={theme.textSecondary}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          placeholderTextColor={theme.textSecondary}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Address or area"
          placeholderTextColor={theme.textSecondary}
        />

        <Text style={styles.label}>Credit limit ($)</Text>
        <TextInput
          style={styles.input}
          value={creditLimit}
          onChangeText={setCreditLimit}
          placeholder="0"
          placeholderTextColor={theme.textSecondary}
          keyboardType="decimal-pad"
        />

        <TouchableOpacity
          style={[styles.checkRow, isVip && styles.checkRowActive]}
          onPress={() => setIsVip(!isVip)}
        >
          <Text style={styles.checkText}>VIP customer</Text>
          <Text style={styles.checkMark}>{isVip ? "✓" : ""}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional notes"
          placeholderTextColor={theme.textSecondary}
          multiline
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveBtnText}>{loading ? "Saving…" : "Save changes"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

