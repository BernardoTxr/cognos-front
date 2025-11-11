import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import CustomButton from "../../../components/Button";
import ConexoesPaciente from "../../../components/ConexoesPaciente";

export default function HomePaciente({navigation}) {

  const handleLogOut = async () => {
    logout();
    navigation.navigate("Login")
  }
  
  const { logout } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Paciente</Text>
      <ConexoesPaciente />
      <CustomButton onPress={handleLogOut} title="Log-Out"></CustomButton>
    </View>
  );
}