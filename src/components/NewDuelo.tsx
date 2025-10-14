import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useListFriends } from "../hooks/useListFriends";
import { useListDuelos } from "../hooks/useListDuelos";
import { createNewDuelo } from "../services/duelo";
import MudarTrilha from "./MudarTrilha";
import { Colors } from "../themes";
import { Ionicons } from "@expo/vector-icons";

export default function NewDuelo({ onClose }) {
  const { data: friendsData, isLoading: isLoadingFriendList } = useListFriends();
  const { refetch: refetchRequests } = useListDuelos();

  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [selectedDueloTrilha, setSelectedDueloTrilha] = useState<any>(null);
  const [selectedDueloMacro, setSelectedDueloMacro] = useState<any>(null);

  const handleCreateDuelo = async () => {
    if (!selectedFriend || !selectedDueloTrilha) {
      Alert.alert("Atenção", "Selecione um amigo e uma trilha antes de continuar.");
      return;
    }
    try {
      await createNewDuelo(selectedFriend, selectedDueloTrilha.id, 1);
      Alert.alert("Info", `Duelo criado com o amigo ID: ${selectedFriend}`);
      refetchRequests();
      onClose();
    } catch (error) {
      console.error("Erro ao criar duelo:", error);
      Alert.alert("Erro", "Não foi possível criar o duelo.");
    }
  };

  if (isLoadingFriendList) {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
        </View>
    );
  }

  return (
    <View>
      <TouchableOpacity onPress={onClose}>
        <Text style={{ color: Colors.primary }}>Fechar</Text>
      </TouchableOpacity>

      <Text>Selecione um amigo:</Text>
      
      <FlatList
        data={friendsData?.friends_details || []}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={<Text>Nenhum amigo encontrado</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedFriend(item)}>
            <View
              style={{
                alignItems: "center",
                marginRight: 16,
                width: 70,
              }}
            >
              <Ionicons
                name="person-circle-outline"
                size={50}
                color="gray"
              style={{ marginBottom: 6 }}
            />
            <Text
              style={{
                fontSize: 12,
                textAlign: "center",
              }}
              numberOfLines={1}
            >
              {item.username}
            </Text>
            </View>
          </TouchableOpacity>
        )}
      />


      <Text>Selecione a trilha:</Text>
      <MudarTrilha
        macroarea={selectedDueloMacro?.friendly_name ?? "Biologia"}
        mesoarea={selectedDueloTrilha?.friendly_name ?? "Bioquímica"}
        setSelectedTrilha={setSelectedDueloTrilha}
        setSelectedMacro={setSelectedDueloMacro}
      />

      <TouchableOpacity onPress={handleCreateDuelo}>
        <Text style={{ color: "#fff" }}>Criar Duelo</Text>
      </TouchableOpacity>
    </View>
  );
}

