/**
 * Set PIN. Figma: two-step flow, progress, PIN dots, numeric keypad, validation.
 */
import { useMemo, useState, useCallback } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { useColors } from "@/contexts/ThemeContext";
import { updateUserPin, getUserById } from "@/lib/data/repositories/authRepo";
import { spacing, borderRadius } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { NumericKeypad } from "@/components/NumericKeypad";

const PIN_LENGTH = 4;
const WEAK_PINS = ["1234", "0000", "1111", "2222", "1212"];

export default function SetPinScreen() {
  const router = useRouter();
  const theme = useColors();
  const { user, setUser } = useAuth();
  const { onboarded } = useBusiness();
  const [step, setStep] = useState<1 | 2>(1);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePinChange = useCallback(
    (newPin: string) => {
      setError("");
      if (step === 1) {
        setPin(newPin);
      } else {
        setConfirmPin(newPin);
      }
    },
    [step]
  );

  const canProceedStep1 = pin.length >= 4 && !WEAK_PINS.includes(pin);
  const handleStep1Next = () => {
    if (WEAK_PINS.includes(pin)) {
      setError("Choose a stronger PIN (avoid 1234, 0000, etc.)");
      return;
    }
    setError("");
    setStep(2);
    setConfirmPin("");
  };

  const handleSubmit = async () => {
    if (!user) {
      router.replace("/(auth)/login");
      return;
    }
    setError("");
    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }
    setLoading(true);
    try {
      await updateUserPin(user.id, pin);
      const updated = await getUserById(user.id);
      if (setUser && updated) setUser(updated);
      router.replace(onboarded ? "/(main)/dashboard" : "/(auth)/onboarding");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update PIN");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const value = step === 1 ? pin : confirmPin;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          padding: spacing.lg,
          backgroundColor: theme.background,
          justifyContent: "center",
        },
        cardWrap: { width: "100%", maxWidth: 400, marginBottom: spacing.lg },
        progress: {
          flexDirection: "row",
          marginBottom: spacing.lg,
          gap: spacing.sm,
        },
        progressDot: {
          flex: 1,
          height: 4,
          borderRadius: 2,
          backgroundColor: theme.muted,
        },
        progressDotActive: { backgroundColor: theme.primary },
        title: {
          fontSize: 22,
          fontWeight: "700",
          color: theme.text,
          marginBottom: spacing.xs,
        },
        subtitle: {
          fontSize: 16,
          color: theme.textSecondary,
          marginBottom: spacing.lg,
        },
        dotsRow: {
          flexDirection: "row",
          justifyContent: "center",
          gap: spacing.md,
          marginBottom: spacing.lg,
        },
        dot: {
          width: 14,
          height: 14,
          borderRadius: 7,
        },
        dotEmpty: { backgroundColor: theme.muted },
        dotFilled: { backgroundColor: theme.primary },
        errorBox: {
          backgroundColor: theme.error + "20",
          borderWidth: 1,
          borderColor: theme.error,
          borderRadius: borderRadius.lg,
          padding: spacing.sm,
          marginBottom: spacing.md,
        },
        errorText: { fontSize: 14, fontWeight: "600", color: theme.error, textAlign: "center" as const },
        row: { flexDirection: "row" as const, gap: spacing.md, marginTop: spacing.lg },
        btnWrap: { flex: 1 },
      }),
    [theme]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.cardWrap}>
        <Card>
          <View style={styles.progress}>
            <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
            <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
          </View>

          <Text style={styles.title}>
            {step === 1 ? "Enter new PIN" : "Confirm PIN"}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? "Choose 4–6 digits. Avoid 1234 or 0000."
              : "Enter the same PIN again."}
          </Text>

          <View style={styles.dotsRow}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  value.length > i ? styles.dotFilled : styles.dotEmpty,
                ]}
              />
            ))}
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <NumericKeypad value={value} onChange={handlePinChange} maxLength={PIN_LENGTH} />

          {step === 1 ? (
            <View style={styles.row}>
              <View style={styles.btnWrap}>
                <Button
                  title="Next"
                  onPress={handleStep1Next}
                  disabled={pin.length < 4}
                />
              </View>
            </View>
          ) : (
            <View style={styles.row}>
              <View style={styles.btnWrap}>
                <Button title="Back" onPress={() => setStep(1)} variant="outline" />
              </View>
              <View style={styles.btnWrap}>
                <Button
                  title={loading ? "Saving…" : "Save PIN"}
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={confirmPin.length < 4}
                />
              </View>
            </View>
          )}
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}
