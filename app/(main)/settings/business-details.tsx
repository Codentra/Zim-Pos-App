import { useState, useCallback, useMemo, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery, useMutation } from "convex/react";
import { useBusiness } from "@/contexts/BusinessContext";
import { useColors } from "@/contexts/ThemeContext";
import { getDb } from "@/lib/data/db";
import { getBusinessById } from "@/lib/data/repositories/businessRepo";
import { api } from "@/lib/convexApi";
import { spacing, borderRadius } from "@/constants/theme";

const CURRENCIES = ["USD ($)", "ZWL (Z$)", "ZAR (R)", "BWP (P)"];
const CURRENCY_CODES: Record<string, string> = { "USD ($)": "USD", "ZWL (Z$)": "ZWL", "ZAR (R)": "ZAR", "BWP (P)": "BWP" };
const CODE_TO_LABEL: Record<string, string> = { USD: "USD ($)", ZWL: "ZWL (Z$)", ZAR: "ZAR (R)", BWP: "BWP (P)" };
const RATE_CURRENCIES = ["ZWL", "ZAR", "BWP"] as const;

export default function BusinessDetailsScreen() {
  const theme = useColors();
  const router = useRouter();
  const { businessId } = useBusiness();
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [currency, setCurrency] = useState("USD ($)");
  const [baseCurrency, setBaseCurrency] = useState("USD ($)");
  const [rateZWL, setRateZWL] = useState("");
  const [rateZAR, setRateZAR] = useState("");
  const [rateBWP, setRateBWP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const exchangeRates = useQuery(api.currency.getExchangeRates, businessId ? { businessId } : "skip");
  const setExchangeRate = useMutation(api.currency.setExchangeRate);

  useFocusEffect(
    useCallback(() => {
      if (!businessId) return;
      (async () => {
        const b = await getBusinessById(businessId);
        if (b) {
          setName(b.name);
          setOwnerName(b.ownerName);
          setAddress((b as { address?: string }).address ?? "");
          setCity(b.city ?? "");
          setCountry(b.country ?? "");
          setPhone(b.phone ?? "");
          setEmail(b.email ?? "");
          setWebsite((b as { website?: string }).website ?? "");
          setBaseCurrency(CODE_TO_LABEL[(b as { baseCurrency?: string }).baseCurrency ?? "USD"] ?? "USD ($)");
        }
        const db = await getDb();
        const row = await db.getFirstAsync<{ value: string | null }>("SELECT value FROM app_meta WHERE key = ?", "defaultCurrency");
        if (row?.value) setCurrency(row.value);
      })();
    }, [businessId])
  );

  useEffect(() => {
    if (exchangeRates) {
      setRateZWL(exchangeRates.rates.ZWL != null ? String(exchangeRates.rates.ZWL) : "");
      setRateZAR(exchangeRates.rates.ZAR != null ? String(exchangeRates.rates.ZAR) : "");
      setRateBWP(exchangeRates.rates.BWP != null ? String(exchangeRates.rates.BWP) : "");
    }
  }, [exchangeRates]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
        sectionTitle: { fontSize: 13, fontWeight: "700" as const, color: theme.textSecondary, marginTop: spacing.lg, marginBottom: spacing.sm, letterSpacing: 0.5 },
        label: { fontSize: 14, fontWeight: "600" as const, color: theme.text, marginTop: spacing.md, marginBottom: spacing.xs },
        input: { borderWidth: 1, borderColor: theme.border, borderRadius: borderRadius.md, padding: spacing.md, fontSize: 16, color: theme.text, backgroundColor: theme.surface },
        error: { color: theme.error, marginTop: spacing.md },
        saveBtn: { backgroundColor: theme.primary, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: "center" as const, marginTop: spacing.xl },
        saveBtnDisabled: { opacity: 0.6 },
        saveBtnText: { color: theme.primaryText, fontSize: 16, fontWeight: "600" as const },
        currencyRow: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: spacing.sm },
        currencyBtn: {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: borderRadius.md,
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.surface,
        },
        currencyBtnActive: { borderColor: theme.primary, backgroundColor: theme.primary + "20" },
        currencyBtnText: { fontSize: 14, color: theme.text },
        currencyBtnTextActive: { color: theme.primary, fontWeight: "600" as const },
        rateRow: { flexDirection: "row" as const, alignItems: "center" as const, marginTop: spacing.sm, gap: spacing.sm },
        rateLabel: { fontSize: 14, color: theme.text },
        rateInput: { flex: 1, borderWidth: 1, borderColor: theme.border, borderRadius: borderRadius.md, padding: spacing.sm, fontSize: 16, color: theme.text, backgroundColor: theme.surface, minWidth: 80 },
      }),
    [theme]
  );

  const handleSave = async () => {
    setError("");
    if (!businessId) return;
    if (!name.trim()) {
      setError("Enter business name");
      return;
    }
    setLoading(true);
    try {
      const db = await getDb();
      const now = Date.now();
      await db.runAsync(
        `UPDATE businesses SET name = ?, ownerName = ?, phone = ?, email = ?, country = ?, city = ?, address = ?, website = ?, baseCurrency = ?, updatedAt = ?, syncStatus = 'PENDING' WHERE id = ?`,
        name.trim(),
        ownerName.trim(),
        phone.trim(),
        email.trim(),
        country.trim(),
        city.trim(),
        address.trim(),
        website.trim(),
        CURRENCY_CODES[baseCurrency] ?? "USD",
        now,
        businessId
      );
      await db.runAsync("INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)", "defaultCurrency", currency);
      if (businessId) {
        const z = parseFloat(rateZWL);
        if (!Number.isNaN(z) && z > 0) await setExchangeRate({ businessId, toCurrency: "ZWL", rate: z });
        const r = parseFloat(rateZAR);
        if (!Number.isNaN(r) && r > 0) await setExchangeRate({ businessId, toCurrency: "ZAR", rate: r });
        const b = parseFloat(rateBWP);
        if (!Number.isNaN(b) && b > 0) await setExchangeRate({ businessId, toCurrency: "BWP", rate: b });
      }
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>BUSINESS INFORMATION</Text>
        <Text style={styles.label}>Store Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Business name" placeholderTextColor={theme.textSecondary} />
        <Text style={styles.label}>Owner Name</Text>
        <TextInput style={styles.input} value={ownerName} onChangeText={setOwnerName} placeholder="Owner" placeholderTextColor={theme.textSecondary} />
        <Text style={styles.label}>Street Address</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="123 Samora Machel Ave, Harare" placeholderTextColor={theme.textSecondary} />
        <Text style={styles.label}>City</Text>
        <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Harare" placeholderTextColor={theme.textSecondary} />
        <Text style={styles.label}>Country</Text>
        <TextInput style={styles.input} value={country} onChangeText={setCountry} placeholder="Zimbabwe" placeholderTextColor={theme.textSecondary} />

        <Text style={styles.sectionTitle}>CONTACT INFORMATION</Text>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+263 77 123 4567" placeholderTextColor={theme.textSecondary} keyboardType="phone-pad" />
        <Text style={styles.label}>Email Address</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="info@store.co.zw" placeholderTextColor={theme.textSecondary} keyboardType="email-address" />
        <Text style={styles.label}>Website</Text>
        <TextInput style={styles.input} value={website} onChangeText={setWebsite} placeholder="www.store.co.zw" placeholderTextColor={theme.textSecondary} autoCapitalize="none" />

        <Text style={styles.sectionTitle}>REGIONAL SETTINGS</Text>
        <Text style={styles.label}>Default Currency (display)</Text>
        <View style={styles.currencyRow}>
          {CURRENCIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.currencyBtn, currency === c && styles.currencyBtnActive]}
              onPress={() => setCurrency(c)}
            >
              <Text style={[styles.currencyBtnText, currency === c && styles.currencyBtnTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Base Currency (for rates)</Text>
        <View style={styles.currencyRow}>
          {CURRENCIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.currencyBtn, baseCurrency === c && styles.currencyBtnActive]}
              onPress={() => setBaseCurrency(c)}
            >
              <Text style={[styles.currencyBtnText, baseCurrency === c && styles.currencyBtnTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Exchange rates (1 base = X)</Text>
        {RATE_CURRENCIES.map((code) => (
          <View key={code} style={styles.rateRow}>
            <Text style={styles.rateLabel}>1 {CURRENCY_CODES[baseCurrency] ?? "USD"} =</Text>
            <TextInput
              style={styles.rateInput}
              value={code === "ZWL" ? rateZWL : code === "ZAR" ? rateZAR : rateBWP}
              onChangeText={code === "ZWL" ? setRateZWL : code === "ZAR" ? setRateZAR : setRateBWP}
              placeholder={`${code} rate`}
              placeholderTextColor={theme.textSecondary}
              keyboardType="decimal-pad"
            />
            <Text style={styles.rateLabel}>{code}</Text>
          </View>
        ))}

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={[styles.saveBtn, loading && styles.saveBtnDisabled]} onPress={handleSave} disabled={loading}>
          <Text style={styles.saveBtnText}>{loading ? "Saving…" : "Save Business Details"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
