import { useState, useMemo } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/contexts/ThemeContext";
import { updateUserPin } from "@/lib/data/repositories/authRepo";
import { spacing, borderRadius } from "@/constants/theme";

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
        label: { fontSize: 14, fontWeight: "600" as const, color: theme.text, marginTop: spacing.md, marginBottom: spacing.xs },
        input: { borderWidth: 1, borderColor: theme.border, borderRadius: borderRadius.md, padding: spacing.md, fontSize: 18, textAlign: "center" as const, color: theme.text, backgroundColor: theme.surface },
        error: { color: theme.error, marginTop: spacing.md },
        saveBtn: { backgroundColor: theme.primary, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: "center" as const, marginTop: spacing.xl },
        saveBtnDisabled: { opacity: 0.6 },
        saveBtnText: { color: theme.primaryText, fontSize: 16, fontWeight: "600" as const },
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
      <TouchableOpacity style={[styles.saveBtn, loading && styles.saveBtnDisabled]} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? "Updating…" : "Update PIN"}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

