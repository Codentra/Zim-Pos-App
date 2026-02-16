/**
 * Default PIN notice. Figma: gradient, temp PIN card, show/hide, copy, security notice, CTA.
 */
import { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const DEFAULT_BG = "#0d9488";

export default function DefaultPinNoticeScreen() {
  const router = useRouter();
  const theme = useColors();
  const [showPIN, setShowPIN] = useState(false);
  const [copied, setCopied] = useState(false);

  const temporaryPIN = "1234";

  const handleCopy = async () => {
    await Clipboard.setStringAsync(temporaryPIN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: DEFAULT_BG,
          padding: spacing.lg,
          justifyContent: "center",
          alignItems: "center",
        },
        iconBox: {
          width: 88,
          height: 88,
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: 44,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.lg,
        },
        iconText: { fontSize: 40 },
        title: {
          fontSize: 24,
          fontWeight: "700",
          color: "#ffffff",
          textAlign: "center",
          marginBottom: spacing.sm,
        },
        sub: {
          fontSize: 16,
          color: "rgba(255,255,255,0.85)",
          textAlign: "center",
          marginBottom: spacing.xl,
          paddingHorizontal: spacing.md,
        },
        cardWrap: { width: "100%", maxWidth: 400, marginBottom: spacing.xl },
        notice: {
          flexDirection: "row",
          alignItems: "flex-start",
          backgroundColor: theme.warning + "20",
          borderWidth: 1,
          borderColor: theme.warning,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          marginBottom: spacing.lg,
        },
        noticeText: {
          flex: 1,
          fontSize: 14,
          color: theme.text,
          marginLeft: spacing.sm,
        },
        noticeTitle: { fontWeight: "600", marginBottom: 4 },
        pinLabel: {
          fontSize: 12,
          fontWeight: "600",
          color: theme.textSecondary,
          textAlign: "center",
          marginBottom: spacing.sm,
          letterSpacing: 1,
        },
        pinRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.lg,
        },
        pinValue: {
          fontSize: 36,
          fontWeight: "700",
          color: theme.text,
          letterSpacing: 8,
          marginRight: spacing.sm,
        },
        showBtn: {
          padding: spacing.sm,
          minWidth: 44,
          minHeight: 44,
          justifyContent: "center",
          alignItems: "center",
        },
        showBtnText: { fontSize: 14, color: theme.primary, fontWeight: "600" },
        copyBtn: {
          backgroundColor: theme.muted,
          paddingVertical: spacing.md,
          borderRadius: borderRadius.lg,
          alignItems: "center",
          marginBottom: spacing.md,
          minHeight: 44,
          justifyContent: "center",
        },
        copyBtnText: { fontSize: 16, fontWeight: "600", color: theme.text },
        continueBtn: { minHeight: 44 },
      }),
    [theme]
  );

  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={styles.iconText}>🔒</Text>
      </View>
      <Text style={styles.title}>Your Temporary PIN</Text>
      <Text style={styles.sub}>
        Save this PIN securely. You'll need it to login and will be required to change it on first login.
      </Text>

      <View style={styles.cardWrap}>
        <Card>
          <View style={styles.notice}>
            <Text style={styles.iconText}>🛡️</Text>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={[styles.noticeText, styles.noticeTitle]}>For Security</Text>
              <Text style={styles.noticeText}>
                This is a one-time temporary PIN. You must change it on your first login.
              </Text>
            </View>
          </View>

          <Text style={styles.pinLabel}>TEMPORARY PIN</Text>
          <View style={styles.pinRow}>
            <Text style={styles.pinValue} selectable>
              {showPIN ? temporaryPIN : "••••"}
            </Text>
            <TouchableOpacity
              style={styles.showBtn}
              onPress={() => setShowPIN(!showPIN)}
              activeOpacity={0.8}
            >
              <Text style={styles.showBtnText}>{showPIN ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.copyBtn}
            onPress={handleCopy}
            activeOpacity={0.8}
          >
            <Text style={styles.copyBtnText}>
              {copied ? "✓ Copied to Clipboard" : "Copy PIN"}
            </Text>
          </TouchableOpacity>

          <Button
            title="Continue to Change PIN"
            onPress={() => router.replace("/(auth)/set-pin")}
            style={styles.continueBtn}
          />
        </Card>
      </View>
    </View>
  );
}
