/**
 * Splash screen. Boot checks + routing. Figma: emerald–teal gradient, logo card.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { useColors } from "@/contexts/ThemeContext";
import { getDb } from "@/lib/data/db";
import { spacing, borderRadius } from "@/constants/theme";

const MIN_SPLASH_MS = 2000;
const SPLASH_BG = "#0d9488";

export default function SplashScreen() {
  const theme = useColors();
  const router = useRouter();
  const { user, isReady: authReady } = useAuth();
  const { businessId, onboarded, subscription, isReady: businessReady } = useBusiness();
  const [bootDone, setBootDone] = useState(false);
  const startRef = useRef(Date.now());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await getDb();
        if (!cancelled) setBootDone(true);
      } catch {
        if (!cancelled) setBootDone(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!authReady || !businessReady || !bootDone) return;

    const elapsed = Date.now() - startRef.current;
    const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);

    const t = setTimeout(() => {
      if (!businessId) {
        router.replace("/welcome");
        return;
      }
      if (!user) {
        router.replace("/(auth)/login");
        return;
      }
      if (!onboarded) {
        router.replace("/(auth)/onboarding");
        return;
      }
      const isExpired =
        subscription?.status === "EXPIRED" ||
        (subscription?.trialEndAt && subscription.trialEndAt < Date.now() && subscription.status === "TRIAL");
      if (isExpired) {
        router.replace("/(auth)/subscription-expired");
        return;
      }
      router.replace("/(main)/dashboard");
    }, remaining);

    return () => clearTimeout(t);
  }, [authReady, businessReady, bootDone, businessId, onboarded, user, subscription, router]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: SPLASH_BG,
          padding: spacing.lg,
        },
        card: {
          backgroundColor: "#ffffff",
          borderRadius: borderRadius.xl,
          padding: spacing.xl,
          marginBottom: spacing.xl,
          alignItems: "center",
          minWidth: 200,
        },
        logoChar: { fontSize: 40, marginBottom: spacing.xs },
        logo: {
          fontSize: 36,
          fontWeight: "800",
          color: "#047857",
          marginBottom: spacing.xs,
        },
        sub: { fontSize: 14, color: "#6b7280" },
        tagline: {
          fontSize: 14,
          color: "rgba(255,255,255,0.9)",
          marginTop: spacing.lg,
          textAlign: "center",
        },
        loader: { marginTop: spacing.lg },
      }),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logoChar}>💚</Text>
        <Text style={styles.logo}>ZimPOS</Text>
        <Text style={styles.sub}>Point of Sale</Text>
      </View>
      <Text style={styles.tagline}>Offline-first POS for growing businesses.</Text>
      <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
    </View>
  );
}
