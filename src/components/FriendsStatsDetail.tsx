import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FriendStatsDetail({ user, onClose }) {
  if (!user) return null;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
      {/* Avatar */}
      <Ionicons name="person-circle-outline" size={100} color="gray" style={{ marginBottom: 20 }} />

      {/* Retângulos com informações */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
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

      {/* Botão Fechar */}
      <TouchableOpacity onPress={onClose} style={{ marginTop: 30 }}>
        <Text style={{ color: "blue", fontSize: 16 }}>Fechar</Text>
      </TouchableOpacity>
    </View>
  );
}
