import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { createOwnerIfNone } from "@/lib/data/repositories/authRepo";
import { DEFAULT_PIN } from "@/constants/auth";
import { colors, spacing, borderRadius } from "@/constants/theme";

export default function OnboardingScreen() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    setError("");
    if (pin.trim() !== DEFAULT_PIN) {
      setError(`Enter the default PIN (${DEFAULT_PIN}) to continue`);
      return;
    }
    setLoading(true);
    try {
      await createOwnerIfNone("Owner", DEFAULT_PIN);
      router.replace("/login");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Welcome to ZimPOS</Text>
      <Text style={styles.subtitle}>
        Enter the default PIN ({DEFAULT_PIN}) below to set up your account. You can change it later in Settings.
      </Text>
      <TextInput
        style={styles.input}
        value={pin}
        onChangeText={setPin}
        placeholder={`PIN (default: ${DEFAULT_PIN})`}
        placeholderTextColor={colors.light.textSecondary}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={8}
        editable={!loading}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Setting up…" : "Continue"}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.light.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  input: {
    width: "100%",
    maxWidth: 200,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: 18,
    textAlign: "center",
    color: colors.light.text,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.light.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  error: {
    color: colors.light.error,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  buttonText: {
    color: colors.light.primaryText,
    fontSize: 16,
    fontWeight: "600",
  },
});
