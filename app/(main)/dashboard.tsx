import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { colors, spacing, borderRadius } from "@/constants/theme";

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {user ? (
        <Text style={styles.subtitle}>Signed in as {user.name} ({user.role})</Text>
      ) : null}
      <TouchableOpacity style={styles.card} onPress={() => router.push("/(main)/products")}>
        <Text style={styles.cardTitle}>Products</Text>
        <Text style={styles.cardSubtitle}>Add and manage products</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => router.push("/(main)/sale")}>
        <Text style={styles.cardTitle}>New Sale</Text>
        <Text style={styles.cardSubtitle}>Start a sale</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => router.push("/(main)/cash")}>
        <Text style={styles.cardTitle}>Cash Management</Text>
        <Text style={styles.cardSubtitle}>Open / close shift</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => router.push("/(main)/refunds")}>
        <Text style={styles.cardTitle}>Refunds</Text>
        <Text style={styles.cardSubtitle}>Process refunds</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => router.push("/(main)/stock")}>
        <Text style={styles.cardTitle}>Stock Receiving</Text>
        <Text style={styles.cardSubtitle}>Receive stock</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => router.push("/(main)/reports")}>
        <Text style={styles.cardTitle}>Reports</Text>
        <Text style={styles.cardSubtitle}>Sales, top products, low stock</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => router.push("/(main)/system-status")}>
        <Text style={styles.cardTitle}>System status</Text>
        <Text style={styles.cardSubtitle}>Sync & pending uploads</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: 48,
    backgroundColor: colors.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.light.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.light.text,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginTop: spacing.xs,
  },
  logout: {
    marginTop: spacing.xl,
    padding: spacing.md,
    alignItems: "center",
  },
  logoutText: {
    color: colors.light.error,
    fontSize: 16,
  },
});
