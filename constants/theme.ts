/**
 * Theme tokens for light/dark and layout.
 */
export const colors = {
  light: {
    background: "#f5f5f5",
    surface: "#ffffff",
    text: "#1a1a1a",
    textSecondary: "#666666",
    primary: "#2563eb",
    primaryText: "#ffffff",
    border: "#e5e5e5",
    error: "#dc2626",
    success: "#16a34a",
  },
  dark: {
    background: "#0f0f0f",
    surface: "#1a1a1a",
    text: "#f5f5f5",
    textSecondary: "#a3a3a3",
    primary: "#3b82f6",
    primaryText: "#ffffff",
    border: "#333333",
    error: "#ef4444",
    success: "#22c55e",
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
