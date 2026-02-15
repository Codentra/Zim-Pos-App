/**
 * Business registration. Collect business info, then continue to Plans.
 */
import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";

export default function RegisterBusinessScreen() {
  const router = useRouter();
  const theme = useColors();
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("Zimbabwe");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    setError("");
    if (!name.trim()) {
      setError("Enter business name");
      return;
    }
    if (!ownerName.trim()) {
      setError("Enter owner name");
      return;
    }
    if (!phone.trim()) {
      setError("Enter phone number");
      return;
    }
    router.push({
      pathname: "/(auth)/plans",
      params: {
        businessName: name.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        country: country.trim() || "Zimbabwe",
        city: city.trim(),
      },
    });
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
        backBtn: { alignSelf: "flex-start", marginBottom: spacing.md },
        backBtnText: { color: theme.textSecondary, fontSize: 16 },
        title: {
          fontSize: 24,
          fontWeight: "700",
          color: theme.text,
          marginBottom: spacing.xs,
        },
        subtitle: {
          fontSize: 16,
          color: theme.textSecondary,
          marginBottom: spacing.lg,
        },
        label: {
          fontSize: 14,
          fontWeight: "600",
          color: theme.text,
          marginTop: spacing.md,
          marginBottom: spacing.xs,
        },
        input: {
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          fontSize: 16,
          color: theme.text,
          backgroundColor: theme.surface,
        },
        error: { color: theme.error, marginTop: spacing.md },
        button: {
          backgroundColor: theme.primary,
          paddingVertical: spacing.md,
          borderRadius: borderRadius.md,
          alignItems: "center",
          marginTop: spacing.xl,
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Register Your Business</Text>
        <Text style={styles.subtitle}>Tell us about your business to get started.</Text>

        <Text style={styles.label}>Business name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Mama's Shop"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Owner name</Text>
        <TextInput
          style={styles.input}
          value={ownerName}
          onChangeText={setOwnerName}
          placeholder="Your full name"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Phone number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+263..."
          placeholderTextColor={theme.textSecondary}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email (optional)</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={theme.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Country</Text>
        <TextInput
          style={styles.input}
          value={country}
          onChangeText={setCountry}
          placeholder="Zimbabwe"
          placeholderTextColor={theme.textSecondary}
        />

        <Text style={styles.label}>City / Location (optional)</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Harare"
          placeholderTextColor={theme.textSecondary}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Continue to Plans</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
