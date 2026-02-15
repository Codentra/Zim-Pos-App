/**
 * Theme tokens. Emerald→teal gradient palette.
 */
export const colors = {
  light: {
    background: "#f0fdf4",
    surface: "#ffffff",
    text: "#1a1a1a",
    textSecondary: "#525252",
    primary: "#0d9488",
    primaryText: "#ffffff",
    border: "#bbf7d0",
    error: "#dc2626",
    success: "#059669",
    emerald: "#10b981",
    teal: "#14b8a6",
  },
  dark: {
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f1f5f9",
    textSecondary: "#94a3b8",
    primary: "#14b8a6",
    primaryText: "#ffffff",
    border: "#334155",
    error: "#ef4444",
    success: "#22c55e",
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
  lg: 16,
  full: 9999,
} as const;
