import { useState, useCallback, useEffect, useMemo } from "react";
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/contexts/ThemeContext";
import { getDb } from "@/lib/data/db";
import { spacing, borderRadius } from "@/constants/theme";

async function getMeta(db: Awaited<ReturnType<typeof import("@/lib/data/db").getDb>>, key: string): Promise<string> {
  const row = await db.getFirstAsync<{ value: string | null }>("SELECT value FROM app_meta WHERE key = ?", key);
  return row?.value ?? "";
}

async function setMeta(db: Awaited<ReturnType<typeof import("@/lib/data/db").getDb>>, key: string, value: string): Promise<void> {
  await db.runAsync("INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)", key, value);
}

export default function NotificationsScreen() {
  const theme = useColors();
  const router = useRouter();
  const [salesCompleted, setSalesCompleted] = useState(true);
  const [lowStock, setLowStock] = useState(true);
  const [cashDrawer, setCashDrawer] = useState(true);
  const [dailyReports, setDailyReports] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [quietFrom, setQuietFrom] = useState("22:00");
  const [quietUntil, setQuietUntil] = useState("07:00");
  const [timeModal, setTimeModal] = useState<"from" | "until" | null>(null);
  const [timeInput, setTimeInput] = useState("");

  const load = useCallback(async () => {
    try {
      const db = await getDb();
      const [sales, low, cash, daily, sound, vib, qh, qf, qu] = await Promise.all([
        getMeta(db, "notifySalesCompleted"),
        getMeta(db, "notifyLowStock"),
        getMeta(db, "notifyCashDrawer"),
        getMeta(db, "notifyDailyReports"),
        getMeta(db, "notifySoundAlerts"),
        getMeta(db, "notifyVibration"),
        getMeta(db, "notifyQuietHours"),
        getMeta(db, "notifyQuietFrom"),
        getMeta(db, "notifyQuietUntil"),
      ]);
      setSalesCompleted(sales !== "0");
      setLowStock(low !== "0");
      setCashDrawer(cash !== "0");
      setDailyReports(daily === "1");
      setSoundAlerts(sound !== "0");
      setVibration(vib !== "0");
      setQuietHours(qh === "1");
      if (qf) setQuietFrom(qf);
      if (qu) setQuietUntil(qu);
    } catch {}
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (key: string, value: string) => {
    try {
      const db = await getDb();
      await setMeta(db, key, value);
    } catch {}
  };

  const openTimeModal = (which: "from" | "until") => {
    setTimeInput(which === "from" ? quietFrom : quietUntil);
    setTimeModal(which);
  };

  const applyTime = () => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(timeInput.trim());
    if (m) {
      const h = Math.min(23, Math.max(0, parseInt(m[1], 10)));
      const min = Math.min(59, Math.max(0, parseInt(m[2], 10)));
      const v = `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
      if (timeModal === "from") {
        setQuietFrom(v);
        save("notifyQuietFrom", v);
      } else {
        setQuietUntil(v);
        save("notifyQuietUntil", v);
      }
    }
    setTimeModal(null);
  };

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
        timeRow: { flexDirection: "row" as const, alignItems: "center", gap: spacing.md, marginTop: spacing.sm },
        timeBox: {
          flex: 1,
          flexDirection: "row" as const,
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: theme.surface,
          padding: spacing.md,
          borderRadius: borderRadius.md,
          borderWidth: 1,
          borderColor: theme.border,
        },
        timeLabel: { fontSize: 14, color: theme.textSecondary },
        timeValue: { fontSize: 16, fontWeight: "600" as const, color: theme.text },
        modalOverlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: spacing.lg,
        },
        modalContent: {
          width: "100%",
          maxWidth: 320,
          backgroundColor: theme.surface,
          borderRadius: borderRadius.lg,
          padding: spacing.xl,
          borderWidth: 1,
          borderColor: theme.border,
        },
        modalTitle: { fontSize: 18, fontWeight: "700" as const, color: theme.text, marginBottom: spacing.md },
        timeInput: {
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          fontSize: 18,
          color: theme.text,
          marginBottom: spacing.lg,
        },
        modalActions: { flexDirection: "row" as const, gap: spacing.md, justifyContent: "flex-end" },
        modalBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
        modalBtnCancel: { fontSize: 16, color: theme.textSecondary },
        modalBtnPrimary: { backgroundColor: theme.primary, borderRadius: borderRadius.md },
        modalBtnOk: { fontSize: 16, fontWeight: "600" as const, color: theme.primaryText },
      }),
    [theme]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.sectionTitle}>BUSINESS ALERTS</Text>
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>Sales Completed</Text>
          <Text style={styles.rowSub}>Alert when a sale is made</Text>
        </View>
        <Switch
          value={salesCompleted}
          onValueChange={(v) => {
            setSalesCompleted(v);
            save("notifySalesCompleted", v ? "1" : "0");
          }}
          trackColor={{ true: theme.primary }}
        />
      </View>
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>Low Stock Warnings</Text>
          <Text style={styles.rowSub}>When inventory is low</Text>
        </View>
        <Switch
          value={lowStock}
          onValueChange={(v) => {
            setLowStock(v);
            save("notifyLowStock", v ? "1" : "0");
          }}
          trackColor={{ true: theme.primary }}
        />
      </View>
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>Cash Drawer Events</Text>
          <Text style={styles.rowSub}>Open/close notifications</Text>
        </View>
        <Switch
          value={cashDrawer}
          onValueChange={(v) => {
            setCashDrawer(v);
            save("notifyCashDrawer", v ? "1" : "0");
          }}
          trackColor={{ true: theme.primary }}
        />
      </View>
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>Daily Reports</Text>
          <Text style={styles.rowSub}>End-of-day summary</Text>
        </View>
        <Switch
          value={dailyReports}
          onValueChange={(v) => {
            setDailyReports(v);
            save("notifyDailyReports", v ? "1" : "0");
          }}
          trackColor={{ true: theme.primary }}
        />
      </View>

      <Text style={styles.sectionTitle}>SOUND & HAPTICS</Text>
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>Sound Alerts</Text>
          <Text style={styles.rowSub}>Play sounds for events</Text>
        </View>
        <Switch
          value={soundAlerts}
          onValueChange={(v) => {
            setSoundAlerts(v);
            save("notifySoundAlerts", v ? "1" : "0");
          }}
          trackColor={{ true: theme.primary }}
        />
      </View>
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>Vibration</Text>
          <Text style={styles.rowSub}>Haptic feedback</Text>
        </View>
        <Switch
          value={vibration}
          onValueChange={(v) => {
            setVibration(v);
            save("notifyVibration", v ? "1" : "0");
          }}
          trackColor={{ true: theme.primary }}
        />
      </View>

      <Text style={styles.sectionTitle}>QUIET HOURS</Text>
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>Do Not Disturb</Text>
          <Text style={styles.rowSub}>Silence notifications</Text>
        </View>
        <Switch
          value={quietHours}
          onValueChange={(v) => {
            setQuietHours(v);
            save("notifyQuietHours", v ? "1" : "0");
          }}
          trackColor={{ true: theme.primary }}
        />
      </View>
      {quietHours && (
        <View style={styles.timeRow}>
          <TouchableOpacity style={styles.timeBox} onPress={() => openTimeModal("from")}>
            <Text style={styles.timeLabel}>From</Text>
            <Text style={styles.timeValue}>{quietFrom}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.timeBox} onPress={() => openTimeModal("until")}>
            <Text style={styles.timeLabel}>Until</Text>
            <Text style={styles.timeValue}>{quietUntil}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={!!timeModal} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set {timeModal === "from" ? "Start" : "End"} Time</Text>
            <TextInput
              style={styles.timeInput}
              value={timeInput}
              onChangeText={setTimeInput}
              placeholder="HH:MM"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setTimeModal(null)}>
                <Text style={styles.modalBtnCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={applyTime}>
                <Text style={styles.modalBtnOk}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}
