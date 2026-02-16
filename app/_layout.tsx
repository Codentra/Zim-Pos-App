import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { SaleProvider } from "@/contexts/SaleContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/constants/theme";
import { SyncRunner } from "@/components/SyncRunner";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL ?? "";
const convex = new ConvexReactClient(convexUrl || "https://placeholder.convex.cloud", {
  unsavedChangesWarning: false,
});

function LayoutContent() {
  const { isDark } = useTheme();
  const theme = isDark ? colors.dark : colors.light;
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ConvexProvider client={convex}>
        <AuthProvider>
          <BusinessProvider>
            <SaleProvider>
              <SyncRunner />
              <LayoutContent />
            </SaleProvider>
          </BusinessProvider>
        </AuthProvider>
      </ConvexProvider>
    </ThemeProvider>
  );
}
