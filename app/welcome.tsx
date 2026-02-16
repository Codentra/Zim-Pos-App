/**
 * Welcome / Entry. Figma: gradient hero, three features, Register | Login, trust footer.
 */
import { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";

const WELCOME_BG = "#0d9488";

const features = [
  { title: "Offline-First", description: "Works without internet" },
  { title: "Secure & Reliable", description: "Bank-grade encryption" },
  { title: "Grow Your Business", description: "Track sales & inventory" },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: WELCOME_BG,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl * 2,
          paddingBottom: spacing.xl,
        },
        hero: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        logoBox: {
          width: 96,
          height: 96,
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: borderRadius.xl,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.lg,
        },
        logoChar: { fontSize: 48 },
        brand: {
          fontSize: 40,
          fontWeight: "800",
          color: "#ffffff",
          marginBottom: spacing.xs,
        },
        tagline: {
          fontSize: 18,
          color: "rgba(255,255,255,0.9)",
          textAlign: "center",
          marginBottom: spacing.lg,
        },
        featureList: { width: "100%", maxWidth: 400, marginBottom: spacing.xl },
        featureCard: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.12)",
          borderRadius: borderRadius.xl,
          padding: spacing.md,
          marginBottom: spacing.sm,
        },
        featureIcon: {
          width: 48,
          height: 48,
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: borderRadius.md,
          alignItems: "center",
          justifyContent: "center",
          marginRight: spacing.md,
        },
        featureIconText: { fontSize: 24 },
        featureTitle: {
          fontSize: 16,
          fontWeight: "600",
          color: "#ffffff",
        },
        featureDesc: {
          fontSize: 14,
          color: "rgba(255,255,255,0.8)",
          marginTop: 2,
        },
        actions: { width: "100%", gap: spacing.md },
        primaryBtn: {
          backgroundColor: "#ffffff",
          paddingVertical: spacing.lg,
          borderRadius: borderRadius.xl,
          alignItems: "center",
          minHeight: 52,
          justifyContent: "center",
        },
        primaryBtnText: {
          color: "#047857",
          fontSize: 18,
          fontWeight: "700",
        },
        secondaryBtn: {
          backgroundColor: "rgba(255,255,255,0.2)",
          borderWidth: 2,
          borderColor: "rgba(255,255,255,0.4)",
          paddingVertical: spacing.lg,
          borderRadius: borderRadius.xl,
          alignItems: "center",
          minHeight: 52,
          justifyContent: "center",
        },
        secondaryBtnText: {
          color: "#ffffff",
          fontSize: 18,
          fontWeight: "700",
        },
        footer: {
          marginTop: spacing.lg,
          alignItems: "center",
        },
        footerText: {
          fontSize: 14,
          color: "rgba(255,255,255,0.7)",
        },
      }),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logoBox}>
          <Text style={styles.logoChar}>🏪</Text>
        </View>
        <Text style={styles.brand}>ZimPOS</Text>
        <Text style={styles.tagline}>Offline-first POS for{"\n"}growing businesses</Text>
        <View style={styles.featureList}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>
                  {f.title === "Offline-First" ? "📶" : f.title === "Secure & Reliable" ? "🔒" : "📈"}
                </Text>
              </View>
              <View>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/(auth)/register-business")}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Register Your Business</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace("/(auth)/login")}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryBtnText}>Login to Existing Account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Trusted by 10,000+ businesses across Africa</Text>
      </View>
    </View>
  );
}
