/**
 * Payment setup: business owner enters their own PayNow and EcoCash credentials.
 * Saved to Convex for this business only.
 */
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/lib/convexApi";
import { useBusiness } from "@/contexts/BusinessContext";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";

export default function PaymentSetupScreen() {
  const theme = useColors();
  const router = useRouter();
  const { businessId } = useBusiness();

  const [paynowIntegrationId, setPaynowIntegrationId] = useState("");
  const [paynowIntegrationKey, setPaynowIntegrationKey] = useState("");
  const [ecocashMerchantId, setEcocashMerchantId] = useState("");
  const [ecocashMerchantPin, setEcocashMerchantPin] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const config = useQuery(
    api.admin.getPaymentConfigForAdmin,
    businessId ? { businessId } : "skip"
  );
  const saveMutation = useMutation(api.admin.saveMyPaymentConfig);

  const didPrefill = useRef(false);
  useEffect(() => {
    if (!config || didPrefill.current) return;
    didPrefill.current = true;
    setPaynowIntegrationId(config.paynowIntegrationId ?? "");
    setEcocashMerchantId(config.ecocashMerchantId ?? "");
  }, [config]);

  const handleSave = useCallback(async () => {
    if (!businessId) return;
    setMessage(null);
    try {
      await saveMutation({
        businessId,
        paynowIntegrationId: paynowIntegrationId.trim() || undefined,
        paynowIntegrationKey: paynowIntegrationKey.trim() || undefined,
        ecocashMerchantId: ecocashMerchantId.trim() || undefined,
        ecocashMerchantPin: ecocashMerchantPin.trim() || undefined,
      });
      setMessage({ type: "ok", text: "Saved. You can receive PayNow and EcoCash payments." });
      setPaynowIntegrationKey("");
      setEcocashMerchantPin("");
    } catch (e) {
      setMessage({
        type: "error",
        text: e instanceof Error ? e.message : "Failed to save",
      });
    }
  }, [
    businessId,
    paynowIntegrationId,
    paynowIntegrationKey,
    ecocashMerchantId,
    ecocashMerchantPin,
    saveMutation,
  ]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
        sectionTitle: {
          fontSize: 13,
          fontWeight: "700" as const,
          color: theme.textSecondary,
          marginTop: spacing.lg,
          marginBottom: spacing.sm,
          letterSpacing: 0.5,
        },
        label: {
          fontSize: 14,
          fontWeight: "600" as const,
          color: theme.text,
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
          marginBottom: spacing.md,
        },
        saveBtn: {
          backgroundColor: theme.primary,
          paddingVertical: spacing.md,
          borderRadius: borderRadius.md,
          alignItems: "center" as const,
          marginTop: spacing.lg,
        },
        saveBtnText: { color: theme.primaryText, fontSize: 16, fontWeight: "600" as const },
        messageOk: { color: theme.success ?? "#22c55e", marginTop: spacing.md },
        messageError: { color: theme.error, marginTop: spacing.md },
      }),
    [theme]
  );

  if (!businessId) {
    return (
      <View style={styles.container}>
        <Text style={{ padding: spacing.lg, color: theme.textSecondary }}>No business selected.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Payment setup" }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.sectionTitle}>PayNow</Text>
      <Text style={styles.label}>Integration ID</Text>
      <TextInput
        style={styles.input}
        value={paynowIntegrationId}
        onChangeText={setPaynowIntegrationId}
        placeholder="From PayNow merchant dashboard"
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
      />
      <Text style={styles.label}>Integration Key</Text>
      <TextInput
        style={styles.input}
        value={paynowIntegrationKey}
        onChangeText={setPaynowIntegrationKey}
        placeholder={config?.paynowConfigured ? "Leave blank to keep current" : "From PayNow email"}
        placeholderTextColor={theme.textSecondary}
        secureTextEntry
        autoCapitalize="none"
      />

      <Text style={styles.sectionTitle}>EcoCash</Text>
      <Text style={styles.label}>Merchant ID</Text>
      <TextInput
        style={styles.input}
        value={ecocashMerchantId}
        onChangeText={setEcocashMerchantId}
        placeholder="From EcoCash merchant account"
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
      />
      <Text style={styles.label}>Merchant PIN / API key</Text>
      <TextInput
        style={styles.input}
        value={ecocashMerchantPin}
        onChangeText={setEcocashMerchantPin}
        placeholder={config?.ecocashConfigured ? "Leave blank to keep current" : "From EcoCash"}
        placeholderTextColor={theme.textSecondary}
        secureTextEntry
        autoCapitalize="none"
      />

      {message && (
        <Text style={message.type === "ok" ? styles.messageOk : styles.messageError}>
          {message.text}
        </Text>
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
    </>
  );
}
