/**
 * Mandatory Set PIN. Enter new PIN, confirm. Success -> onboarding or dashboard.
 */
import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { useColors } from "@/contexts/ThemeContext";
import { updateUserPin } from "@/lib/data/repositories/authRepo";
import { spacing, borderRadius } from "@/constants/theme";

export default function SetPinScreen() {
  const router = useRouter();
  const theme = useColors();
  const { user, setUser } = useAuth();
  const { onboarded } = useBusiness();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!user) {
      router.replace("/(auth)/login");
      return;
    }
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits");
      return;
    }
    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }
    setLoading(true);
    try {
      await updateUserPin(user.id, pin);
      if (setUser) setUser({ ...user, pinHash: pin });
      router.replace(onboarded ? "/(main)/dashboard" : "/(auth)/onboarding");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update PIN");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          padding: spacing.lg,
          backgroundColor: theme.background,
          justifyContent: "center",
        },
        title: {
          fontSize: 24,
          fontWeight: "700",
          color: theme.text,
          marginBottom: spacing.xs,
        },
        subtitle: {
          fontSize: 16,
          color: theme.textSecondary,
          marginBottom: spacing.lg,
        },
        label: {
          fontSize: 14,
          fontWeight: "600",
          color: theme.text,
          marginTop: spacing.md,
          marginBottom: spacing.xs,
        },
        input: {
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          fontSize: 18,
          textAlign: "center",
          color: theme.text,
          backgroundColor: theme.surface,
        },
        error: { color: theme.error, marginTop: spacing.md },
        button: {
          backgroundColor: theme.primary,
          paddingVertical: spacing.md,
          borderRadius: borderRadius.md,
          alignItems: "center",
          marginTop: spacing.xl,
        },
        buttonDisabled: { opacity: 0.6 },
        buttonText: {
          color: theme.primaryText,
          fontSize: 16,
          fontWeight: "600",
        },
      }),
    [theme]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Set Your PIN</Text>
      <Text style={styles.subtitle}>Choose a PIN you'll remember. At least 4 digits.</Text>

      <Text style={styles.label}>New PIN</Text>
      <TextInput
        style={styles.input}
        value={pin}
        onChangeText={setPin}
        placeholder="••••"
        placeholderTextColor={theme.textSecondary}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={8}
        editable={!loading}
      />

      <Text style={styles.label}>Confirm PIN</Text>
      <TextInput
        style={styles.input}
        value={confirmPin}
        onChangeText={setConfirmPin}
        placeholder="••••"
        placeholderTextColor={theme.textSecondary}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={8}
        editable={!loading}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading || pin.length < 4 || confirmPin.length < 4}
      >
        <Text style={styles.buttonText}>{loading ? "Saving…" : "Save PIN"}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
