import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  FlatList,
  TextInput,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";
import api from "../../services/api";
import { useListFriends, useListFriendRequests } from "../../hooks/useListFriends";
import { Ionicons } from "@expo/vector-icons";
import FriendStatsDetail from "../../components/FriendsStatsDetail";
import AddFriend from "../../components/AddFriend";
import { useListDuelos } from "../../hooks/useListDuelos";
import DueloCard from "../../components/DueloCard";
import NewDuelo from "../../components/NewDuelo";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);
  const [addFriendVisible, setAddFriendVisible] = useState(false);
  const [newDueloVisible, setNewDueloVisible] = useState(false);

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

  const {
    data: duelosData,
    isLoading: isLoadingDuelos,
    refetch: refetchDuelos,
  } = useListDuelos();

  // Busca dados do usuário
  const fetchUser = async () => {
    try {
      const response = await api.get("/users/me");
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      setLoading(false);
    };
    init();
  }, []);

  if (isLoadingFriendList || isLoadingRequestList || isLoadingDuelos ||loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Nenhum usuário logado</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View
        style={{
          alignItems: "center",
          marginBottom: 20,
        }}
      >
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>Perfil</Text>

        <Ionicons
          name="person-circle-outline"
          size={100}
          color="gray"
          style={{ marginBottom: 20 }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Username */}
          <View
            style={{
              flex: 1,
              backgroundColor: "#f0f0f0",
              padding: 15,
              borderRadius: 10,
              marginRight: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>username:</Text>
            <Text>{user.username}</Text>
          </View>

          {/* Email */}
          <View
            style={{
              flex: 1,
              backgroundColor: "#f0f0f0",
              padding: 15,
              borderRadius: 10,
              marginLeft: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>email:</Text>
            <Text>{user.email}</Text>
          </View>
        </View>
      </View>


      {/* Cabeçalho Amigos + botão + */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >        
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Amigos</Text>
        <TouchableOpacity onPress={() => setAddFriendVisible(true)}>
          <Ionicons name="add-circle-outline" size={30} color="blue" />

          {/* Badge */}
          {requestsData?.friend_requests_details.length > 0 && (
            <View
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                backgroundColor: "red",
                borderRadius: 10,
                minWidth: 18,
                height: 18,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 3,
              }}
            >
              <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
                {requestsData.friend_requests_details.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Lista de Amigos */}
      <FlatList
        data={friendsData?.friends_details || []}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={<Text>Nenhum amigo encontrado</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedUserDetails(item)}>
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

      {/* Lista de duelos em aberto */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >        
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Duelos em Aberto</Text>
        <TouchableOpacity onPress={() => setNewDueloVisible(true)}>
          <Ionicons name="add-circle-outline" size={30} color="blue" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, padding: 20 }}>
        <FlatList
          data={duelosData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <DueloCard duelo={item} />}
        />
      </View>

    
      {/* Modal com detalhes do amigo */}
      <Modal
        visible={!!selectedUserDetails}
        animationType="slide"
        onRequestClose={() => setSelectedUserDetails(null)}
      >
        <FriendStatsDetail
          user={selectedUserDetails}
          onClose={() => setSelectedUserDetails(null)}
        />
      </Modal>

      {/* Modal de adicionar amigo */}
      <Modal
        visible={addFriendVisible}
        animationType="slide"
        onRequestClose={() => setAddFriendVisible(false)}
      >
        <AddFriend onClose={() => setAddFriendVisible(false)} />
      </Modal>

      {/* Modal de novo duelo */}
      <Modal
        visible={newDueloVisible}
        animationType="slide"
        onRequestClose={() => setNewDueloVisible(false)}
      >
        <NewDuelo onClose={() => setNewDueloVisible(false)} />
      </Modal>
    </View>
  );
}
