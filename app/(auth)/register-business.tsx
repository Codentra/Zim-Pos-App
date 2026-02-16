/**
 * Business registration. Figma: form, trust badge, Continue to Plans.
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
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
        backBtn: { alignSelf: "flex-start", marginBottom: spacing.md, minHeight: 44, justifyContent: "center" },
        backBtnText: { color: theme.textSecondary, fontSize: 16, fontWeight: "600" },
        title: { fontSize: 24, fontWeight: "700", color: theme.text, marginBottom: spacing.xs },
        subtitle: { fontSize: 16, color: theme.textSecondary, marginBottom: spacing.lg },
        label: { fontSize: 14, fontWeight: "600", color: theme.text, marginTop: spacing.md, marginBottom: spacing.xs },
        input: {
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          fontSize: 16,
          color: theme.text,
          backgroundColor: theme.inputBackground,
        },
        trustBadge: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: theme.success + "18",
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          marginTop: spacing.lg,
          marginBottom: spacing.md,
          borderWidth: 1,
          borderColor: theme.success + "40",
        },
        trustIcon: { fontSize: 20, marginRight: spacing.sm },
        trustText: { flex: 1, fontSize: 14, color: theme.text },
        error: { color: theme.error, marginTop: spacing.sm },
        continueBtn: { marginTop: spacing.xl, minHeight: 48 },
      }),
    [theme]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Register Your Business</Text>
        <Text style={styles.subtitle}>Tell us about your business to get started.</Text>

        <Card style={{ marginBottom: 0 }}>
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
          <View style={styles.trustBadge}>
            <Text style={styles.trustIcon}>🔒</Text>
            <Text style={styles.trustText}>Your data is secure and encrypted end-to-end.</Text>
          </View>
        </Card>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Continue to Plans" onPress={handleContinue} style={styles.continueBtn} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
