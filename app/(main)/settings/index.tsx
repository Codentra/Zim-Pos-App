import { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { useTheme, useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";

function SettingsRow({
  title,
  subtitle,
  onPress,
  theme,
}: {
  title: string;
  subtitle?: string;
  onPress: () => void;
  theme: ReturnType<typeof useColors>;
}) {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.surface,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: theme.border,
      }}
      onPress={onPress}
    >
      <View>
        <Text style={{ fontSize: 16, fontWeight: "600", color: theme.text }}>{title}</Text>
        {subtitle ? (
          <Text style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2 }}>{subtitle}</Text>
        ) : null}
      </View>
      <Text style={{ fontSize: 20, color: theme.textSecondary }}>›</Text>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useColors();
  const { user, logout } = useAuth();
  const { business } = useBusiness();
  const { isDark, toggleTheme } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
        profileCard: {
          backgroundColor: theme.surface,
          padding: spacing.lg,
          borderRadius: borderRadius.md,
          alignItems: "center",
          marginBottom: spacing.xl,
          borderWidth: 1,
          borderColor: theme.border,
        },
        avatar: {
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: theme.primary,
          alignItems: "center",
          justifyContent: "center",
        },
        avatarText: { fontSize: 24, fontWeight: "700", color: theme.primaryText },
        profileName: { fontSize: 20, fontWeight: "700", color: theme.text, marginTop: spacing.md },
        profileRole: { fontSize: 14, color: theme.textSecondary, marginTop: 2 },
        sectionTitle: {
          fontSize: 13,
          fontWeight: "600",
          color: theme.textSecondary,
          marginBottom: spacing.sm,
          marginTop: spacing.lg,
          textTransform: "uppercase",
        },
        footer: { marginTop: spacing.xl, alignItems: "center" },
        version: { fontSize: 12, color: theme.textSecondary, marginBottom: spacing.md },
        logout: { padding: spacing.md },
        logoutText: { color: theme.error, fontSize: 16, fontWeight: "600" },
        darkModeRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: spacing.md,
          backgroundColor: theme.surface,
          borderRadius: borderRadius.md,
          marginBottom: spacing.lg,
          borderWidth: 1,
          borderColor: theme.border,
        },
      }),
    [theme]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
          </Text>
        </View>
        <Text style={styles.profileName}>{user?.name ?? "—"}</Text>
        <Text style={styles.profileRole}>{user?.role ?? ""}</Text>
      </View>

      <View style={styles.darkModeRow}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: theme.text }}>Dark mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: theme.primary }} />
      </View>

      <Text style={styles.sectionTitle}>Account</Text>
      <SettingsRow
        title="User profile"
        subtitle="Edit name, email, phone"
        onPress={() => router.push("/(main)/settings/user-profile")}
        theme={theme}
      />
      <SettingsRow
        title="Security & PIN"
        subtitle="Change login PIN"
        onPress={() => router.push("/(main)/settings/security-pin")}
        theme={theme}
      />
      <SettingsRow
        title="Notifications"
        subtitle="Alerts and delivery"
        onPress={() => router.push("/(main)/settings/notifications")}
        theme={theme}
      />

      <Text style={styles.sectionTitle}>Business</Text>
      <SettingsRow
        title="Business details"
        subtitle={business?.name ?? "Update"}
        onPress={() => router.push("/(main)/settings/business-details")}
        theme={theme}
      />
      <SettingsRow
        title="Receipt settings"
        subtitle="Configure"
        onPress={() => router.push("/(main)/settings/receipt-settings")}
        theme={theme}
      />

      <Text style={styles.sectionTitle}>System & Hardware</Text>
      <SettingsRow
        title="System status"
        subtitle="Online"
        onPress={() => router.push("/(main)/system-status")}
        theme={theme}
      />
      <SettingsRow
        title="Activity logs"
        subtitle="View audit trail"
        onPress={() => router.push("/(main)/activity-logs")}
        theme={theme}
      />
      <SettingsRow
        title="Hardware setup"
        subtitle="Printer & Scanner"
        onPress={() => router.push("/(main)/hardware-setup")}
        theme={theme}
      />

      <Text style={styles.sectionTitle}>Data & Sync</Text>
      <SettingsRow
        title="Sync status"
        subtitle="Last sync, pending items"
        onPress={() => router.push("/(main)/settings/sync-status")}
        theme={theme}
      />
      <SettingsRow
        title="Backup data"
        subtitle="Export and restore"
        onPress={() => router.push("/(main)/settings/backup-data")}
        theme={theme}
      />

      <View style={styles.footer}>
        <Text style={styles.version}>ZimPOS v1.0.0</Text>
        <TouchableOpacity style={styles.logout} onPress={async () => {
          await logout();
          router.replace("/(auth)/login");
        }}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
