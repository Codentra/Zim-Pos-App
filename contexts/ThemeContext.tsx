import React, { createContext, useCallback, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "@/constants/theme";

const THEME_KEY = "@zimpos/theme";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  isDark: boolean;
  theme: "light" | "dark";
  setTheme: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");

  React.useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === "dark" || stored === "light") {
        setThemeState(stored);
      }
    });
  }, []);

  const setTheme = useCallback(async (mode: ThemeMode) => {
    setThemeState(mode);
    await AsyncStorage.setItem(THEME_KEY, mode);
  }, []);

  const toggleTheme = useCallback(async () => {
    const next = theme === "light" ? "dark" : "light";
    await setTheme(next);
  }, [theme, setTheme]);

  const value: ThemeContextValue = {
    isDark: theme === "dark",
    theme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function useColors() {
  const { isDark } = useTheme();
  return isDark ? colors.dark : colors.light;
}
