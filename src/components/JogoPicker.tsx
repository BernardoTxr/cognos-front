import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors, Fonts, Spacing } from "../themes";

type GameKey = "jogodamem" | "jogodabola" | "jogoreac";

interface Props {
  value: GameKey;
  onChange: (g: GameKey) => void;
}

export default function GamePicker({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
        <Text style={styles.label}>🎮 Jogo</Text>
        <Picker
          selectedValue={value}
          onValueChange={(v) => onChange(v as GameKey)}
          dropdownIconColor={Colors.primary}
          style={{ color: Colors.text }}
        >
          <Picker.Item label="Jogo da Memória" value="jogodamem" />
          <Picker.Item label="Jogo da Bola" value="jogodabola" />
          <Picker.Item label="Jogo de Reação" value="jogoreac" />
        </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: Spacing.medium },
  label: {
    fontFamily: Fonts.medium,
    fontSize: Fonts.size.medium,
    marginBottom: 4,
    color: Colors.text,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: Spacing.boderRadius * 1.5,
    backgroundColor: Colors.background.medium,
  },
});
