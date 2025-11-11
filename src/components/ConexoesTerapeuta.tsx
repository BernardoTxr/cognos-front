import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts, Spacing } from "../themes";
import CustomTitle from "./Title";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../services/api"; // axios configurado
import CustomInput from "../components/Input";

export default function ConexoesTerapeuta() {
  const [pacienteId, setPacienteId] = useState("");

  // 🧠 Buscar pacientes conectados
  const {
    data: pacientes,
    isLoading: loadingPacientes,
    refetch: refetchPacientes,
  } = useQuery({
    queryKey: ["pacientes-conectados"],
    queryFn: async () => {
      const res = await api.get("/paciente_terapeuta/me/pacientes");
      return res.data;
    },
  });

  // 🧠 Buscar solicitações pendentes (req_paciente)
  const {
    data: solicitacoes,
    isLoading: loadingSolicitacoes,
    refetch: refetchSolicitacoes,
  } = useQuery({
    queryKey: ["solicitacoes-terapeuta"],
    queryFn: async () => {
      const res = await api.get("/paciente_terapeuta/solicitacoes/terapeuta");
      return res.data;
    },
  });

  // 📤 Enviar solicitação
  const enviarSolicitacao = useMutation({
    mutationFn: async () => {
      await api.post(`/paciente_terapeuta/conectar/${pacienteId}`);
    },
    onSuccess: async () => {
      Alert.alert("Sucesso", "Solicitação enviada!");
      setPacienteId("");
      await refetchSolicitacoes();
    },
    onError: (err: any) => {
      Alert.alert("Erro", err.response?.data?.detail || "Não foi possível enviar.");
    },
  });

  // ✅ Aceitar conexão
  const aceitarConexao = useMutation({
    mutationFn: async (conexaoId: number) => {
      await api.put(`/paciente_terapeuta/aceitar/${conexaoId}`);
    },
    onSuccess: async () => {
      Alert.alert("Sucesso", "Conexão aceita!");
      await refetchSolicitacoes();
      await refetchPacientes();
    },
    onError: (err: any) => {
      Alert.alert("Erro", err.response?.data?.detail || "Não foi possível aceitar.");
    },
  });

  // ❌ Rejeitar conexão
  const rejeitarConexao = useMutation({
    mutationFn: async (conexaoId: number) => {
      await api.delete(`/paciente_terapeuta/rejeitar/${conexaoId}`);
    },
    onSuccess: async () => {
      Alert.alert("Solicitação rejeitada!");
      await refetchSolicitacoes();
    },
    onError: (err: any) => {
      Alert.alert("Erro", err.response?.data?.detail || "Não foi possível rejeitar.");
    },
  });

  return (
    <View style={styles.container}>
      {/* Enviar solicitação */}
      <CustomTitle title="Conectar paciente" size="medium" />
      <CustomInput
        placeholder="Digite o ID do paciente"
        value={pacienteId}
        onChangeText={setPacienteId}
      />
      <TouchableOpacity
        onPress={() => enviarSolicitacao.mutate()}
        style={styles.searchItem}
        disabled={!pacienteId}
      >
        <Ionicons name="add-outline" size={24} color={Colors.primary} />
        <Text style={styles.textFrienship}>Enviar solicitação</Text>
      </TouchableOpacity>

      {/* Pacientes conectados */}
      <CustomTitle title="Meus pacientes" size="medium" />
      {loadingPacientes ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={pacientes || []}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.requestItem}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="person-circle-outline" size={32} color="gray" />
                <Text style={styles.textFrienship}>{item.nome_completo}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text>Nenhum paciente conectado.</Text>}
        />
      )}

      {/* Solicitações pendentes */}
      <CustomTitle title="Solicitações de conexão" size="medium" />
      {loadingSolicitacoes ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={solicitacoes || []}
          keyExtractor={(item) => item.conexao_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.requestItem}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="person-circle-outline" size={32} color="gray" />
                <Text style={styles.textFrienship}>{item.nome_usuario}</Text>
              </View>

              {/* Botões Aceitar e Rejeitar */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => aceitarConexao.mutate(item.conexao_id)}
                  style={[styles.button, { backgroundColor: Colors.colors.green }]}
                >
                  <Ionicons name="checkmark-outline" size={22} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => rejeitarConexao.mutate(item.conexao_id)}
                  style={[styles.button, { backgroundColor: Colors.colors.red }]}
                >
                  <Ionicons name="close-outline" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text>Nenhuma solicitação.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.ligth,
    padding: Spacing.large,
    borderRadius: Spacing.boderRadius,
    width: "85%",
    alignSelf: "center",
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background.medium,
    width: "95%",
    padding: Spacing.small,
    borderRadius: Spacing.boderRadius,
    alignSelf: "center",
    marginVertical: Spacing.xsmall,
  },
  textFrienship: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.size.medium,
    marginLeft: Spacing.small,
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "25%",
    alignSelf:"center",
    backgroundColor: Colors.background.medium,
    padding: Spacing.small,
    borderRadius: Spacing.boderRadius,
    marginVertical: Spacing.small,
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.xsmall,
  },
  button: {
    padding: Spacing.xsmall,
    borderRadius: Spacing.boderRadius,
    alignItems: "center",
    justifyContent: "center",
  },
});
