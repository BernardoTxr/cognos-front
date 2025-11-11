import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert, StyleSheet } from "react-native";
import PatientPicker from "../../components/PacientePicker";
import GamePicker from "../../components/JogoPicker";
import { fetchPacientes } from "../../services/dashboard";
import { Colors, Spacing, Fonts } from "../../themes";

export default function DashboardScreen({ route }) {
  const terapeutaId = route.params?.terapeutaId;
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<
    "jogodamem" | "jogodabola" | "jogoreac"
  >("jogodamem");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetchPacientes();
        setPacientes(res.data || []);
        if (res.data?.length > 0) {
          setSelectedPaciente(res.data[0].user_id);
        }
      } catch (e) {
        Alert.alert("Erro", "Não foi possível carregar os pacientes.");
      } finally {
        setLoading(false);
      }
    })();
  }, [terapeutaId]);

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.background.ligth,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );

  return (


    <View style={styles.rowContainer}>
  <View style={styles.pickerBox}>
    <PatientPicker 
      pacientes={pacientes}
      selectedPaciente={selectedPaciente}
      onSelectPaciente={setSelectedPaciente}
      selectedGame={selectedGame}
      onSelectGame={setSelectedGame}
   />
  </View>
</View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    padding: Spacing.small,
    borderRadius: Spacing.boderRadius,
    marginVertical: Spacing.small,
  },
  pickerBox: {
    flex: 1,
    backgroundColor: Colors.background.medium,
    borderRadius: Spacing.boderRadius,
    marginHorizontal: Spacing.xsmall,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.xsmall,
  },
});