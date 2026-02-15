import { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { useColors } from "@/contexts/ThemeContext";
import { DEFAULT_PIN } from "@/constants/auth";
import { spacing, borderRadius } from "@/constants/theme";

export default function LoginScreen() {
  const theme = useColors();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();
  const { login } = useAuth();
  const { onboarded } = useBusiness();
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
      if (ok) {
        if (pin.trim() === DEFAULT_PIN) {
          router.replace("/(auth)/default-pin");
        } else if (!onboarded) {
          router.replace("/(auth)/onboarding");
        } else {
          router.replace("/(main)/dashboard");
        }
      } else {
        setError("Wrong PIN");
      }
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
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Signing in…" : "Sign in"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backLink}
        onPress={() => router.replace("/welcome")}
      >
        <Text style={styles.backLinkText}>← Back to Welcome</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

function createStyles(theme: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.lg,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: spacing.lg,
    },
    input: {
      width: "100%",
      maxWidth: 200,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      fontSize: 18,
      textAlign: "center",
      color: theme.text,
      marginBottom: spacing.md,
    },
    error: { color: theme.error, marginBottom: spacing.sm },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.md,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: {
      color: theme.primaryText,
      fontSize: 16,
      fontWeight: "600",
    },
    backLink: { marginTop: spacing.lg, alignItems: "center" },
    backLinkText: { color: theme.textSecondary, fontSize: 14 },
  });
}
