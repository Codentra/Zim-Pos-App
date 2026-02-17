import { Stack } from "expo-router";
import { CurrencyFormatProvider } from "@/lib/currencyFormat";

export default function MainLayout() {
  return (
    <CurrencyFormatProvider>
      <Stack screenOptions={{ headerShown: true, headerBackTitle: "Back" }} />
    </CurrencyFormatProvider>
  );
}
