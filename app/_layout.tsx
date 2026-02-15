import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/contexts/AuthContext";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { SaleProvider } from "@/contexts/SaleContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { colors } from "@/constants/theme";

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
      <AuthProvider>
        <BusinessProvider>
          <SaleProvider>
            <LayoutContent />
          </SaleProvider>
        </BusinessProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
