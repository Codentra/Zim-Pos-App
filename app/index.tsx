import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getDb } from "@/lib/data/db";
import { hasAnyUser } from "@/lib/data/repositories/authRepo";

export default function IndexScreen() {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const [hasUsers, setHasUsers] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await getDb();
        const ok = await hasAnyUser();
        if (!cancelled) setHasUsers(ok);
      } catch {
        if (!cancelled) setHasUsers(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isReady || hasUsers === null) return;
    if (!hasUsers) {
      router.replace("/(auth)/onboarding");
      return;
    }
    if (!user) {
      router.replace("/(auth)/login");
      return;
    }
    router.replace("/(main)/dashboard");
  }, [isReady, hasUsers, user, router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 16 }}>Loading…</Text>
    </View>
  );
}
