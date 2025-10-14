import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DueloCardProps {
  duelo: {
    id: number;
    uid1: string;
    uid2: string;
    user1_username: string;
    user2_username: string;
    mesoarea_friendly_name: string;
    id_mesoarea: number;
    rounds: number;
    status: string;
    resultado: string;
  };
}

const DueloCard: React.FC<DueloCardProps> = ({ duelo }) => {
  const getStatusIcon = () => {
    switch (duelo.status) {
      case "waiting_u1":
      case "waiting_u2":
        return <Ionicons name="hourglass-outline" size={24} color="orange" />;
      case "show_results":
        return <Ionicons name="trophy-outline" size={24} color="gold" />;
      case "ended":
        return <Ionicons name="checkmark-circle-outline" size={24} color="green" />;
      default:
        return <Ionicons name="help-circle-outline" size={24} color="gray" />;
    }
  };

  return (
    <View style={styles.card}>
      {/* Header: mesoarea */}
      <Text style={styles.mesoarea}>{duelo.mesoarea_friendly_name}</Text>

      {/* Usuários lado a lado */}
      <View style={styles.usersRow}>
        <View style={styles.userBox}>
          <Ionicons name="person-circle-outline" size={40} color="gray" />
          <Text style={styles.username}>{duelo.user1_username}</Text>
        </View>

        <Text style={styles.vs}>vs</Text>

        <View style={styles.userBox}>
          <Ionicons name="person-circle-outline" size={40} color="gray" />
          <Text style={styles.username}>{duelo.user2_username}</Text>
        </View>
      </View>

      {/* Rounds e Status */}
      <View style={styles.footer}>
        <Text style={styles.rounds}>Rounds: {duelo.rounds}</Text>
        {getStatusIcon()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mesoarea: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  usersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  userBox: {
    alignItems: "center",
    width: 80,
  },
  username: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
  },
  vs: {
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rounds: {
    fontSize: 14,
    color: "#555",
  },
});

export default DueloCard;
