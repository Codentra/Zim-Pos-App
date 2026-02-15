/**
 * Welcome / Entry choice. Register New Business | Login to Existing Business.
 */
import { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: spacing.lg,
          backgroundColor: theme.background,
        },
        logo: {
          fontSize: 36,
          fontWeight: "800",
          color: theme.primary,
          marginBottom: spacing.xs,
        },
        tagline: {
          fontSize: 16,
          color: theme.textSecondary,
          marginBottom: spacing.xl * 2,
        },
        buttons: { width: "100%", maxWidth: 320, gap: spacing.md },
        primaryBtn: {
          backgroundColor: theme.primary,
          paddingVertical: spacing.lg,
          borderRadius: borderRadius.md,
          alignItems: "center",
        },
        primaryBtnText: {
          color: theme.primaryText,
          fontSize: 18,
          fontWeight: "600",
        },
        secondaryBtn: {
          borderWidth: 2,
          borderColor: theme.primary,
          paddingVertical: spacing.lg,
          borderRadius: borderRadius.md,
          alignItems: "center",
        },
        secondaryBtnText: {
          color: theme.primary,
          fontSize: 18,
          fontWeight: "600",
        },
      }),
    [theme]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ZimPOS</Text>
      <Text style={styles.tagline}>Offline-first POS for growing businesses.</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/(auth)/register-business")}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryBtnText}>Register New Business</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace("/(auth)/login")}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryBtnText}>Login to Existing Business</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
