import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ConexoesPaciente from "../../../components/ConexoesPaciente";
import CustomTitle from "../../../components/Title";

export default function HomePaciente({navigation}) {
  
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ConexoesPaciente />
    </View>
  );
}