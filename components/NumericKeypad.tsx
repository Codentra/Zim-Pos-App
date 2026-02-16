import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useColors } from "@/contexts/ThemeContext";
import { spacing, borderRadius } from "@/constants/theme";

const MIN_TAP = 48;

type NumericKeypadProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
};

export function NumericKeypad({ value, onChange, maxLength = 6 }: NumericKeypadProps) {
  const theme = useColors();

  const handlePress = (key: string) => {
    if (key === "⌫") {
      onChange(value.slice(0, -1));
      return;
    }
    if (value.length < maxLength) {
      onChange(value + key);
    }
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  return (
    <View style={styles.grid}>
      {keys.map((k, index) =>
        k === "" ? (
          <View key={index} style={[styles.key, { backgroundColor: "transparent", borderWidth: 0 }]} />
        ) : (
          <TouchableOpacity
            key={index}
            style={[
              styles.key,
              {
                backgroundColor: k === "⌫" ? theme.muted : theme.surface,
                borderColor: theme.border,
              },
            ]}
            onPress={() => handlePress(k)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.keyText,
                { color: k === "⌫" ? theme.textSecondary : theme.text },
              ]}
            >
              {k}
            </Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "center",
  },
  key: {
    width: "30%",
    minWidth: 72,
    maxWidth: 96,
    height: MIN_TAP,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: {
    fontSize: 20,
    fontWeight: "600",
  },
});
