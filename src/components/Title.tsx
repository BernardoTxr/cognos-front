import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Colors, Fonts, Spacing } from "../themes";

type TitleSize = "small" | "medium" | "large" | "xlarge";

interface CustomTitleProps {
  title: string;
  subtitle?: string;
  size?: TitleSize;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
}

const getTitleFontSize = (size?: TitleSize) => {
  switch (size) {
    case "small":
      return Fonts.size.small;
    case "large":
      return Fonts.size.xlarge;
    case "medium":
      return Fonts.size.medium;
    case "xlarge":
      return Fonts.size.xlarge;
    default:
      return Fonts.size.xlarge;
  }
};

const CustomTitle: React.FC<CustomTitleProps> = ({
  title,
  subtitle,
  size = "medium",
  containerStyle,
  titleStyle,
  subtitleStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, { fontSize: getTitleFontSize(size) }, titleStyle]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
      )}
    </View>
  );
};

export default CustomTitle;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginVertical: Spacing.small,
    marginHorizontal: Spacing.small,
  },
  title: {
    fontFamily: Fonts.bold,
    color: Colors.text,
  },
  subtitle: {
    marginTop: Spacing.xsmall,
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.regular,
    color: Colors.muted,
  },
});
