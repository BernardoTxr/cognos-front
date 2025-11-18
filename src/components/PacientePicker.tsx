import React from "react";
import { View, StyleSheet } from "react-native";
import CustomInput from "../components/Input";
import { Colors, Spacing } from "../themes";

type GameKey = "jogodamem" | "jogodabola" | "jogoreac" | "jogodowisconsin";

interface Patient {
  user_id: string;
  nome_completo: string;
  email: string;
  sexo?: string;
  nivel_tea?: string;
}

interface Props {
  pacientes: Patient[];
  selectedPaciente: string | null;
  onSelectPaciente: (v: string) => void;
  selectedGame: GameKey;
  onSelectGame: (v: GameKey) => void;
}

export default function DashboardPickersRow({
  pacientes,
  selectedPaciente,
  onSelectPaciente,
  selectedGame,
  onSelectGame,
}: Props) {
  const pacienteOptions =
    pacientes.length > 0
      ? [{ label: "Selecione um paciente", value: "" }].concat(
          pacientes.map((p) => ({
            label: `${p.nome_completo} (${p.email})`,
            value: p.user_id,
          }))
        )
      : [{ label: "Nenhum paciente disponível", value: "" }];

  const gameOptions = [
    { label: "Jogo da Memória", value: "jogodamem" },
    { label: "Jogo da Bola", value: "jogodabola" },
    { label: "Jogo de Reação", value: "jogoreac" },
    { label: "Jogo Wisconsin", value: "jogodowisconsin" },
  ];

  return (
    <View style={styles.row}>
      <CustomInput
        label="Paciente"
        pickerOptions={pacienteOptions}
        selectedValue={selectedPaciente || ""}
        onValueChange={(v) => onSelectPaciente(v)}
        containerStyle={styles.inputHalf}
      />

      <CustomInput
        label="Jogo"
        pickerOptions={gameOptions}
        selectedValue={selectedGame}
        onValueChange={(v) => onSelectGame(v as GameKey)}
        containerStyle={styles.inputHalf}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "95%",
    alignSelf: "center",
  },
  inputHalf: {
    flex: 1,
    marginHorizontal: Spacing.xsmall,
  },
});
