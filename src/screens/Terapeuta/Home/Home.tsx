import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import CustomButton from "../../../components/Button";
import ConexoesTerapeuta from "../../../components/ConexoesTerapeuta";

export default function HomeTerapeuta({navigation}) {

  const handleLogOut = async () => {
    logout();
    navigation.navigate("Login")
  }
  
  const { logout } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Terapeuta</Text>
      <ConexoesTerapeuta />
      <CustomButton onPress={handleLogOut} title="Log-Out"></CustomButton>
    </View>
  );
}