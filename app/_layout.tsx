import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { SaleProvider } from "@/contexts/SaleContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SaleProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SaleProvider>
    </AuthProvider>
  );
}
