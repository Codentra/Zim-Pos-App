import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { updateUserProfile } from "@/lib/data/repositories/authRepo";
import type { Role } from "@/lib/domain/types";
import { colors, spacing, borderRadius } from "@/constants/theme";

const ROLES: { value: Role; label: string }[] = [
  { value: "CASHIER", label: "Cashier" },
  { value: "MANAGER", label: "Manager" },
  { value: "OWNER", label: "Owner" },
];

export default function UserProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [role, setRole] = useState<Role>(user?.role ?? "CASHIER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email ?? "");
      setPhone(user.phone ?? "");
      setLocation(user.location ?? "");
      setRole(user.role);
    }
  }, [user]);

  const handleSave = async () => {
    setError("");
    if (!user) return;
    if (!name.trim()) {
      setError("Enter your name");
      return;
    }
    setLoading(true);
    try {
      await updateUserProfile(user.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim(),
        role,
      });
      if (setUser) {
        setUser({
          ...user,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          location: location.trim(),
          role,
        });
      }
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.rowLabel, { color: theme.text }]}>Dark mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ true: theme.primary }}
          />
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Name *</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={theme.textSecondary}
        />

        <Text style={[styles.label, { color: theme.text }]}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          placeholderTextColor={theme.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={[styles.label, { color: theme.text }]}>Phone</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
          value={phone}
          onChangeText={setPhone}
          placeholder="+263..."
          placeholderTextColor={theme.textSecondary}
          keyboardType="phone-pad"
        />

        <Text style={[styles.label, { color: theme.text }]}>Location</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
          value={location}
          onChangeText={setLocation}
          placeholder="City or area"
          placeholderTextColor={theme.textSecondary}
        />

        <Text style={[styles.label, { color: theme.text }]}>Role</Text>
        <View style={styles.roleRow}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r.value}
              style={[
                styles.roleBtn,
                {
                  backgroundColor: role === r.value ? theme.primary : theme.surface,
                  borderColor: role === r.value ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setRole(r.value)}
            >
              <Text
                style={[
                  styles.roleBtnText,
                  { color: role === r.value ? theme.primaryText : theme.text },
                ]}
              >
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: theme.primary }, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={[styles.saveBtnText, { color: theme.primaryText }]}>
            {loading ? "Saving…" : "Save"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  rowLabel: { fontSize: 16, fontWeight: "600" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  roleRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  roleBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    borderWidth: 1,
  },
  roleBtnText: { fontSize: 14, fontWeight: "600" },
  error: { marginBottom: spacing.md },
  saveBtn: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: 16, fontWeight: "600" },
});
