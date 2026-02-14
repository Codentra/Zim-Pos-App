import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { colors, spacing, borderRadius } from "@/constants/theme";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!pin.trim()) {
      setError("Enter your PIN");
      return;
    }
    setLoading(true);
    try {
      const ok = await login(pin.trim());
      if (ok) router.replace("/(main)/dashboard");
      else setError("Wrong PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>ZimPOS</Text>
      <Text style={styles.subtitle}>Enter your PIN to continue</Text>
      <TextInput
        style={styles.input}
        value={pin}
        onChangeText={setPin}
        placeholder="PIN"
        placeholderTextColor={colors.light.textSecondary}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={8}
        editable={!loading}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Signing in…" : "Sign in"}</Text>
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
    fontSize: 28,
    fontWeight: "700",
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.light.textSecondary,
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
  error: {
    color: colors.light.error,
    marginBottom: spacing.sm,
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
  buttonText: {
    color: colors.light.primaryText,
    fontSize: 16,
    fontWeight: "600",
  },
});
