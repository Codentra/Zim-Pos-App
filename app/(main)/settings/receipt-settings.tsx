import { useState, useCallback, useEffect, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/contexts/ThemeContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { useAuth } from "@/contexts/AuthContext";
import { getDb } from "@/lib/data/db";
import { getBusinessById } from "@/lib/data/repositories/businessRepo";
import { spacing, borderRadius } from "@/constants/theme";

const PAPER_SIZES = ["58mm", "80mm (Standard)"];

async function getMeta(db: Awaited<ReturnType<typeof import("@/lib/data/db").getDb>>, key: string): Promise<string> {
  const row = await db.getFirstAsync<{ value: string | null }>(
    "SELECT value FROM app_meta WHERE key = ?",
    key
  );
  return row?.value ?? "";
}

export default function ReceiptSettingsScreen() {
  const theme = useColors();
  const router = useRouter();
  const { businessId } = useBusiness();
  const { user } = useAuth();
  const [showLogo, setShowLogo] = useState(true);
  const [showTaxNumber, setShowTaxNumber] = useState(true);
  const [footer, setFooter] = useState("Thank you for your business!");
  const [paperSize, setPaperSize] = useState("80mm (Standard)");
  const [autoPrint, setAutoPrint] = useState(true);
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState<{ name: string; address?: string; phone: string; email: string; taxNumber?: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const db = await getDb();
      const [logo, tax, foot, paper, print, b] = await Promise.all([
        getMeta(db, "receiptShowLogo"),
        getMeta(db, "receiptShowTaxNumber"),
        getMeta(db, "receiptFooter"),
        getMeta(db, "receiptPaperSize"),
        getMeta(db, "receiptAutoPrint"),
        businessId ? getBusinessById(businessId) : null,
      ]);
      setShowLogo(logo !== "0");
      setShowTaxNumber(tax !== "0");
      setFooter(foot || "Thank you for your business!");
      setPaperSize(paper || "80mm (Standard)");
      setAutoPrint(print !== "0");
      if (b) setBusiness({ name: b.name, phone: b.phone, email: b.email });
    } catch {}
  }, [businessId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const db = await getDb();
      await db.runAsync("INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)", "receiptShowLogo", showLogo ? "1" : "0");
      await db.runAsync("INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)", "receiptShowTaxNumber", showTaxNumber ? "1" : "0");
      await db.runAsync("INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)", "receiptFooter", footer);
      await db.runAsync("INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)", "receiptPaperSize", paperSize);
      await db.runAsync("INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)", "receiptAutoPrint", autoPrint ? "1" : "0");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
        sectionTitle: { fontSize: 13, fontWeight: "700" as const, color: theme.textSecondary, marginTop: spacing.lg, marginBottom: spacing.sm, letterSpacing: 0.5 },
        row: {
          flexDirection: "row" as const,
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: theme.surface,
          padding: spacing.md,
          borderRadius: borderRadius.md,
          marginBottom: spacing.sm,
          borderWidth: 1,
          borderColor: theme.border,
        },
        rowContent: { flex: 1 },
        rowTitle: { fontSize: 16, fontWeight: "600" as const, color: theme.text },
        rowSub: { fontSize: 13, color: theme.textSecondary, marginTop: 2 },
        label: { fontSize: 14, fontWeight: "600" as const, color: theme.text, marginBottom: spacing.xs },
        input: {
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          fontSize: 16,
          color: theme.text,
          backgroundColor: theme.surface,
          minHeight: 80,
          textAlignVertical: "top" as const,
        },
        paperRow: {
          flexDirection: "row" as const,
          flexWrap: "wrap" as const,
          gap: spacing.sm,
        },
        paperBtn: {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: borderRadius.md,
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.surface,
        },
        paperBtnActive: { borderColor: theme.primary, backgroundColor: theme.primary + "20" },
        paperBtnText: { fontSize: 14, color: theme.text },
        paperBtnTextActive: { color: theme.primary, fontWeight: "600" as const },
        saveBtn: {
          backgroundColor: theme.primary,
          paddingVertical: spacing.md,
          borderRadius: borderRadius.md,
          alignItems: "center" as const,
          marginTop: spacing.xl,
        },
        saveBtnDisabled: { opacity: 0.6 },
        saveBtnText: { color: theme.primaryText, fontSize: 16, fontWeight: "600" as const },
        previewCard: {
          backgroundColor: theme.surface,
          padding: spacing.lg,
          borderRadius: borderRadius.md,
          borderWidth: 1,
          borderColor: theme.border,
          marginTop: spacing.md,
        },
        previewLine: { fontSize: 12, color: theme.text, marginBottom: 2 },
        previewDivider: { height: 1, backgroundColor: theme.border, marginVertical: spacing.sm },
      }),
    [theme]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.sectionTitle}>APPEARANCE</Text>
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>Show Logo</Text>
          <Text style={styles.rowSub}>Display store logo</Text>
        </View>
        <Switch value={showLogo} onValueChange={setShowLogo} trackColor={{ true: theme.primary }} />
      </View>
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>Show Tax Number</Text>
          <Text style={styles.rowSub}>Include tax ID</Text>
        </View>
        <Switch value={showTaxNumber} onValueChange={setShowTaxNumber} trackColor={{ true: theme.primary }} />
      </View>

      <Text style={styles.sectionTitle}>FOOTER MESSAGE</Text>
      <Text style={styles.label}>Custom Message</Text>
      <TextInput
        style={styles.input}
        value={footer}
        onChangeText={setFooter}
        placeholder="Thank you for your business!"
        placeholderTextColor={theme.textSecondary}
        multiline
      />

      <Text style={styles.sectionTitle}>PRINTER SETTINGS</Text>
      <Text style={styles.label}>Paper Size</Text>
      <View style={styles.paperRow}>
        {PAPER_SIZES.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.paperBtn, paperSize === p && styles.paperBtnActive]}
            onPress={() => setPaperSize(p)}
          >
            <Text style={[styles.paperBtnText, paperSize === p && styles.paperBtnTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[styles.row, { marginTop: spacing.md }]}>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>Auto Print</Text>
          <Text style={styles.rowSub}>Print after each sale</Text>
        </View>
        <Switch value={autoPrint} onValueChange={setAutoPrint} trackColor={{ true: theme.primary }} />
      </View>

      <View style={styles.previewCard}>
        <Text style={[styles.previewLine, { fontWeight: "700", fontSize: 14 }]}>{business?.name ?? "Store Name"}</Text>
        {business?.address ? <Text style={styles.previewLine}>{business.address}</Text> : null}
        <Text style={styles.previewLine}>{business?.phone || "+263..."}</Text>
        <Text style={styles.previewLine}>{business?.email || "info@store.co.zw"}</Text>
        {showTaxNumber ? <Text style={styles.previewLine}>Tax #: 12345678</Text> : null}
        <View style={styles.previewDivider} />
        <Text style={styles.previewLine}>Receipt #: RCP-001234</Text>
        <Text style={styles.previewLine}>Date: {new Date().toLocaleString()}</Text>
        <Text style={styles.previewLine}>Cashier: {user?.name ?? "—"}</Text>
        <View style={styles.previewDivider} />
        <Text style={styles.previewLine}>Coca Cola 500ml x2 — $2.00</Text>
        <Text style={styles.previewLine}>Bread Loaf x1 — $1.50</Text>
        <View style={styles.previewDivider} />
        <Text style={[styles.previewLine, { fontWeight: "700" }]}>TOTAL: $3.50</Text>
        <Text style={styles.previewLine}>Cash: $5.00 · Change: $1.50</Text>
        <View style={styles.previewDivider} />
        <Text style={styles.previewLine}>{footer}</Text>
      </View>

      <TouchableOpacity style={[styles.saveBtn, loading && styles.saveBtnDisabled]} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? "Saving…" : "Save Receipt Settings"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
