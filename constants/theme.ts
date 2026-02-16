/**
 * Theme tokens. Figma-aligned: Emerald→teal, 12–20px radius, 44px min tap.
 */
export const colors = {
  light: {
    background: "#f0fdf4",
    surface: "#ffffff",
    text: "#1a1a1a",
    textSecondary: "#525252",
    muted: "#ececf0",
    mutedForeground: "#717182",
    primary: "#10b981",
    primaryText: "#ffffff",
    border: "#e5e7eb",
    inputBackground: "#f3f3f5",
    error: "#dc2626",
    destructive: "#d4183d",
    success: "#059669",
    warning: "#d97706",
    emerald: "#10b981",
    teal: "#14b8a6",
  },
  dark: {
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f1f5f9",
    textSecondary: "#94a3b8",
    muted: "#334155",
    mutedForeground: "#94a3b8",
    primary: "#34d399",
    primaryText: "#0f172a",
    border: "#334155",
    inputBackground: "#1e293b",
    error: "#ef4444",
    destructive: "#f87171",
    success: "#22c55e",
    warning: "#fbbf24",
    emerald: "#34d399",
    teal: "#2dd4bf",
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 20,
  full: 9999,
} as const;
