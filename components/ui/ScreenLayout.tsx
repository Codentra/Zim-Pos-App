import { View, ScrollView, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/contexts/ThemeContext";
import { spacing } from "@/constants/theme";

type ScreenLayoutProps = {
  children: React.ReactNode;
  scroll?: boolean;
  padding?: boolean;
  style?: ViewStyle;
};

export function ScreenLayout({
  children,
  scroll = false,
  padding = true,
  style,
}: ScreenLayoutProps) {
  const theme = useColors();
  const insets = useSafeAreaInsets();
  const containerStyle = {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: padding ? spacing.lg + insets.left : insets.left,
    paddingRight: padding ? spacing.lg + insets.right : insets.right,
  };

  if (scroll) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={[containerStyle, { paddingBottom: spacing.xl * 2 }, style]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }

  return <View style={[containerStyle, style]}>{children}</View>;
}
