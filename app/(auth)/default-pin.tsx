/**
 * Default PIN notice. Shown after first login with default PIN. CTA: Set New PIN.
 */
import { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";

export default function DefaultPinNoticeScreen() {
  const router = useRouter();
  const theme = useColors();
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
          marginBottom: spacing.md,
          textAlign: "center",
        },
        message: {
          fontSize: 16,
          color: theme.textSecondary,
          textAlign: "center",
          marginBottom: spacing.xl,
          lineHeight: 24,
        },
        button: {
          backgroundColor: theme.primary,
          paddingVertical: spacing.md,
          borderRadius: borderRadius.md,
          alignItems: "center",
        },
        buttonText: {
          color: theme.primaryText,
          fontSize: 16,
          fontWeight: "600",
        },
      }),
    [theme]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Security Notice</Text>
      <Text style={styles.message}>
        You're using the default PIN. For your security, please set a new PIN now.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/(auth)/set-pin")}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Set New PIN</Text>
      </TouchableOpacity>
    </View>
  );
}
