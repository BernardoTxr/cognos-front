import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, Alert, FlatList } from "react-native";
import { useListFriends, useListFriendRequests } from "../hooks/useListFriends";
import {
  acceptFriendRequest,
  deleteFriendRequest,
  sendFriendRequest,
} from "../services/social";

export default function AddFriend({ onClose }) {
  const [newFriend, setNewFriend] = useState("");

  const {
      data: friendsData,
      isLoading: isLoadingFriendList,
      refetch: refetchFriends,
    } = useListFriends();
  
    const {
      data: requestsData,
      isLoading: isLoadingRequestList,
      refetch: refetchRequests,
    } = useListFriendRequests();

    const handleSendRequest = async () => {
      if (!newFriend.trim()) {
        Alert.alert("Erro", "Digite o username do amigo.");
        return;
      }
      try {
        const response = await sendFriendRequest(newFriend.trim());
        Alert.alert("Info", response.message || "Pedido enviado!");
        setNewFriend("");
        await refetchRequests();
      } catch (error: any) {
        Alert.alert("Erro", error.detail || "Não foi possível enviar o pedido.");
      }
    };

    const handleAccept = async (friendId: string) => {
        try {
          await acceptFriendRequest(friendId);
          await refetchFriends();
          await refetchRequests();
        } catch (error) {
          console.error("Erro ao aceitar:", error);
        }
    };
    
    const handleReject = async (friendId: string) => {
        try {
          await deleteFriendRequest(friendId);
          await refetchRequests();
        } catch (error) {
          console.error("Erro ao rejeitar:", error);
        }
    };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      {/* Botão Fechar */}
      <TouchableOpacity onPress={onClose} style={{ marginBottom: 20 }}>
        <Text style={{ color: "blue" }}>Fechar</Text>
      </TouchableOpacity>

      {/* Adicionar amigo */}
      <View>
        <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
          Adicionar amigo pelo username
        </Text>
        <TextInput
          value={newFriend}
          onChangeText={setNewFriend}
          placeholder="Digite o username"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 8,
            marginBottom: 10,
            borderRadius: 5,
          }}
        />
        <Button title="Enviar pedido" onPress={handleSendRequest} />
      </View>

      {/* Solicitações de amizade */}
      <Text style={{ marginTop: 20, fontSize: 16, fontWeight: "bold" }}>
        Solicitações de amizade
      </Text>
      <FlatList
        data={requestsData?.friend_requests_details || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: 5,
              }}
            >
              <Text>Pedido de {item.username}</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Button title="Aceitar" onPress={() => handleAccept(item.id)} />
                <Button title="Rejeitar" onPress={() => handleReject(item.id)} />
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text>Nenhuma solicitação</Text>}
      />
    </View>
  );
}
