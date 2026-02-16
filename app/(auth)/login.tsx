/**
 * Login. Figma: card, role badge, offline badge, PIN dots, numeric keypad, Back to Welcome.
 */
import { useMemo, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { useColors } from "@/contexts/ThemeContext";
import { DEFAULT_PIN } from "@/constants/auth";
import { spacing, borderRadius } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { NumericKeypad } from "@/components/NumericKeypad";

const PIN_LENGTH = 4;

export default function LoginScreen() {
  const theme = useColors();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();
  const { login, user } = useAuth();
  const { onboarded } = useBusiness();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePinChange = useCallback(
    (newPin: string) => {
      setPin(newPin);
      setError("");
      if (newPin.length === PIN_LENGTH) {
        setLoading(true);
        login(newPin).then((ok) => {
          setLoading(false);
          if (ok) {
            if (newPin === DEFAULT_PIN) {
              router.replace("/(auth)/default-pin");
            } else if (!onboarded) {
              router.replace("/(auth)/onboarding");
            } else {
              router.replace("/(main)/dashboard");
            }
          } else {
            setError("Incorrect PIN");
            setPin("");
          }
        });
      }
    },
    [login, onboarded, router]
  );

  const roleLabel = user?.role ?? "Owner";

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>ZimPOS</Text>
          <Text style={styles.subtitle}>Point of Sale</Text>
        </View>
        <View style={styles.offlineBadge}>
          <Text style={styles.offlineText}>● Offline Mode</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{roleLabel}</Text>
            </View>
            <Text style={styles.pinHint}>Enter your 4-digit PIN</Text>
          </View>

          <View style={styles.dotsRow}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  pin.length > i ? styles.dotFilled : styles.dotEmpty,
                ]}
              />
            ))}
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <NumericKeypad value={pin} onChange={handlePinChange} maxLength={PIN_LENGTH} />

          <Text style={styles.demoHint}>Demo PIN: 1234</Text>
        </Card>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace("/welcome")}
          activeOpacity={0.8}
        >
          <Text style={styles.backBtnText}>← Back to Welcome</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function createStyles(theme: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.surface,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.primary,
    },
    subtitle: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    offlineBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: theme.muted,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    offlineText: {
      fontSize: 12,
      color: theme.text,
      fontWeight: "500",
    },
    form: {
      flex: 1,
      padding: spacing.lg,
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      width: "100%",
      maxWidth: 400,
      marginBottom: spacing.md,
    },
    cardHeader: {
      alignItems: "center",
      marginBottom: spacing.lg,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.md,
    },
    avatarText: { fontSize: 32 },
    welcomeText: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.text,
      marginBottom: spacing.sm,
    },
    roleBadge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      backgroundColor: theme.muted,
      borderRadius: borderRadius.full,
      marginBottom: spacing.sm,
    },
    roleText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.primary,
    },
    pinHint: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    dotsRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    dotEmpty: {
      backgroundColor: theme.muted,
    },
    dotFilled: {
      backgroundColor: theme.primary,
    },
    errorBox: {
      backgroundColor: theme.error + "20",
      borderWidth: 1,
      borderColor: theme.error,
      borderRadius: borderRadius.lg,
      padding: spacing.sm,
      marginBottom: spacing.md,
    },
    errorText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.error,
      textAlign: "center",
    },
    demoHint: {
      marginTop: spacing.md,
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: "center",
    },
    backBtn: {
      marginTop: spacing.lg,
      paddingVertical: spacing.md,
      minHeight: 44,
      justifyContent: "center",
    },
    backBtnText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textSecondary,
    },
  });
}
