import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors, Fonts, Spacing } from "../themes";

type ButtonSize = "small" | "medium" | "large";

interface CustomButtonProps {
  title: string;
  size?: ButtonSize;
  fill?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  size,
  fill = false,
  disabled = false,
  onPress,
  style,
  textStyle,
}) => {
  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return { paddingVertical: 12, paddingHorizontal: 24 };
      case "large":
        return { paddingVertical: 12, paddingHorizontal: 80 };
      case "medium":
      default:
        return { paddingVertical: 12, paddingHorizontal: 64 };
    }
  };

  const backgroundColor = fill ? Colors.primary : "transparent";
  const textColor = fill ? Colors.background.ligth : Colors.primary;
  const borderColor = Colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        getSizeStyle(),
        {
          backgroundColor,
          borderColor,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: Spacing.boderRadius,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    margin: Spacing.small,
  },
  text: {
    fontFamily: Fonts.medium,
    fontSize: Fonts.size.medium,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
