/**
 * Security & PIN. Figma: PIN management card, current / new / confirm, Update PIN.
 */
import { useState, useMemo } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/contexts/ThemeContext";
import { updateUserPin } from "@/lib/data/repositories/authRepo";
import { spacing, borderRadius } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SecurityPinScreen() {
  const theme = useColors();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, padding: spacing.lg, backgroundColor: theme.background },
        title: { fontSize: 22, fontWeight: "700", color: theme.text, marginBottom: spacing.md },
        card: { marginBottom: spacing.lg },
        label: { fontSize: 14, fontWeight: "600", color: theme.text, marginTop: spacing.md, marginBottom: spacing.xs },
        input: {
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          fontSize: 18,
          textAlign: "center",
          color: theme.text,
          backgroundColor: theme.inputBackground,
        },
        error: { color: theme.error, marginTop: spacing.md },
        saveBtn: { marginTop: spacing.xl, minHeight: 48 },
      }),
    [theme]
  );

  const handleSave = async () => {
    setError("");
    if (!user) return;
    if (currentPin !== user.pinHash) {
      setError("Current PIN is incorrect");
      return;
    }
    if (newPin.length < 4) {
      setError("New PIN must be at least 4 digits");
      return;
    }
    if (newPin !== confirmPin) {
      setError("New PINs do not match");
      return;
    }
    setLoading(true);
    try {
      await updateUserPin(user.id, newPin);
      if (setUser) setUser({ ...user, pinHash: newPin });
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update PIN");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Text style={styles.title}>Security & PIN</Text>
      <Card style={styles.card}>
        <Text style={styles.label}>Current PIN</Text>
        <TextInput
          style={styles.input}
          value={currentPin}
          onChangeText={setCurrentPin}
          placeholder="••••"
          placeholderTextColor={theme.textSecondary}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={8}
        />
        <Text style={styles.label}>New PIN</Text>
        <TextInput
          style={styles.input}
          value={newPin}
          onChangeText={setNewPin}
          placeholder="••••"
          placeholderTextColor={theme.textSecondary}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={8}
        />
        <Text style={styles.label}>Confirm new PIN</Text>
        <TextInput
          style={styles.input}
          value={confirmPin}
          onChangeText={setConfirmPin}
          placeholder="••••"
          placeholderTextColor={theme.textSecondary}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={8}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title={loading ? "Updating…" : "Update PIN"}
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          style={styles.saveBtn}
        />
      </Card>
    </KeyboardAvoidingView>
  );
}
