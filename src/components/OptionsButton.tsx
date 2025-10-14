import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Fonts } from "../themes";

interface OptionsButtonProps {
  title: string;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
  onToggleDisable: () => void;
}

const OptionsButton: React.FC<OptionsButtonProps> = ({
  title,
  isSelected,
  isDisabled,
  onSelect,
  onToggleDisable,
}) => {
  const borderColor = isSelected ? Colors.primary : Colors.muted;
  const textDecorationLine = isDisabled ? "line-through" : "none";

  return (
    <TouchableOpacity
      disabled={isDisabled}
      onPress={onSelect}
      style={[styles.button, { borderColor, opacity: isDisabled ? 0.5 : 1 }]}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text
            style={[styles.text, { textDecorationLine }]}
            numberOfLines={0}
          >
            {title}
          </Text>
        </View>
        <TouchableOpacity onPress={onToggleDisable} style={styles.icon}>
          <Ionicons
            name="cut-outline"
            size={24}
            color={isDisabled ? Colors.danger : Colors.text}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default OptionsButton;

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderRadius: Spacing.boderRadius,
    padding: Spacing.small,
    marginVertical: Spacing.xsmall,
    backgroundColor: Colors.background.ligth,
    width: "95%",
    alignSelf: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    padding: Spacing.xsmall,
  },
  text: {
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.medium,
    color: Colors.text,
    flexWrap: "wrap",
  },
  icon: {
    padding: Spacing.xsmall,
  },
});
