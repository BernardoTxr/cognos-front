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
import CustomInput from "./Input";
import CustomTitle from "./Title";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../services/api";

export default function ConexoesPaciente() {
  const [terapeutaId, setTerapeutaId] = useState("");

  const { data: terapeutas, isLoading: loadingTerapeutas, refetch: refetchTerapeutas } = useQuery({
    queryKey: ["terapeutas-conectados"],
    queryFn: async () => (await api.get("/paciente_terapeuta/me/terapeutas")).data,
  });

  const { data: solicitacoes, isLoading: loadingSolicitacoes, refetch: refetchSolicitacoes } =
    useQuery({
      queryKey: ["solicitacoes-paciente"],
      queryFn: async () => (await api.get("/paciente_terapeuta/solicitacoes/paciente")).data,
    });

  const enviarSolicitacao = useMutation({
    mutationFn: async () => {
      await api.post(`/paciente_terapeuta/conectar/${terapeutaId}`);
    },
    onSuccess: async () => {
      Alert.alert("Sucesso", "Solicitação enviada!");
      setTerapeutaId("");
      await refetchSolicitacoes();
    },
    onError: (err: any) => {
      Alert.alert("Erro", err.response?.data?.detail || "Não foi possível enviar.");
    },
  });

  const aceitarConexao = useMutation({
    mutationFn: async (conexaoId: number) => {
      await api.put(`/paciente_terapeuta/aceitar/${conexaoId}`);
    },
    onSuccess: async () => {
      Alert.alert("Conexão aceita!");
      await refetchTerapeutas();
      await refetchSolicitacoes();
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

      <CustomTitle title="Conectar terapeuta" size="medium" />
      <CustomInput
        placeholder="Digite o ID do terapeuta"
        value={terapeutaId}
        onChangeText={setTerapeutaId}
      />
      <TouchableOpacity
        onPress={() => enviarSolicitacao.mutate()}
        style={styles.searchItem}
        disabled={!terapeutaId}
      >
        <Ionicons name="add-outline" size={24} color={Colors.primary} />
        <Text style={styles.textFrienship}>Enviar solicitação</Text>
      </TouchableOpacity>

      <CustomTitle title="Meus terapeutas" size="medium" />
      {loadingTerapeutas ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={terapeutas || []}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.requestItem}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="person-circle-outline" size={32} color="gray" />
                <Text style={styles.textFrienship}>{item.nome_completo}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text>Nenhum terapeuta conectado.</Text>}
        />
      )}

      <CustomTitle title="Solicitações recebidas" size="medium" />
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
  modalCloseButton: { alignSelf: "flex-end" },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "25%",
    alignSelf:"center",
    backgroundColor: Colors.background.medium,
    padding: Spacing.small,
    borderRadius: Spacing.boderRadius,
    marginVertical: Spacing.small,
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
  buttonCheck: {
    padding: Spacing.xsmall,
    backgroundColor: Colors.colors.green,
    borderRadius: Spacing.boderRadius,
  },
  textFrienship: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.size.medium,
    marginLeft: Spacing.small,
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
