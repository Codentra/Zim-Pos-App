import { ViewStyle, TextStyle } from "react-native";
import { TouchableOpacity, Text, StyleSheet, ViewStyle as RNViewStyle } from "react-native";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";

const MIN_TAP_HEIGHT = 44;

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const theme = useColors();
  const styles = buildStyles(theme);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        { minHeight: MIN_TAP_HEIGHT },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, styles[`${variant}Text` as keyof typeof styles], textStyle]}>
        {loading ? "…" : title}
      </Text>
    </TouchableOpacity>
  );
}

function buildStyles(theme: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    base: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
      alignItems: "center",
      justifyContent: "center",
    },
    primary: {
      backgroundColor: theme.primary,
    },
    primaryText: {
      color: theme.primaryText,
      fontSize: 16,
      fontWeight: "600",
    },
    secondary: {
      backgroundColor: theme.muted,
    },
    secondaryText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "600",
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: theme.primary,
    },
    outlineText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: "600",
    },
    ghost: {
      backgroundColor: "transparent",
    },
    ghostText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: "600",
    },
    destructive: {
      backgroundColor: theme.destructive,
    },
    destructiveText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    disabled: {
      opacity: 0.6,
    },
  });
}
