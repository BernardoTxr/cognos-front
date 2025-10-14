import React from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { useNivelMesoareas } from "../../hooks/useNivelMesoareas";

export default function Statistics() {
  const { data, isLoading, isError } = useNivelMesoareas();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Erro ao carregar os dados</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data} // array de mesoareas com nível do usuário
      renderItem={({ item }) => (
        <View style={{ padding: 16, borderBottomWidth: 1, borderColor: "#ccc" }}>
          <Text style={{ fontWeight: "bold" }}>{item.nome}</Text>
          <Text>Trilha: {item.mesoarea_friendly_name} - Nível: {item.nivel.toFixed(2)}</Text>
        </View>
      )}
    />
  );
}
