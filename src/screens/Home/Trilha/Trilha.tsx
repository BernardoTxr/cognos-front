import { View, Text, Button } from "react-native";
import { useAuth } from "../../../context/AuthContext"
import { useState } from "react";
import MudarTrilha from "../../../components/MudarTrilha";
import CustomButton from "../../../components/Button";
import { useTrilha } from "../../../context/TrilhaContext";
import TreePrototype from "../../../components/design/TreePrototype";

export default function Home({navigation}) {
  const {
    selectedTrilha,
    selectedMacro,
  } = useTrilha();


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <MudarTrilha mesoarea={selectedTrilha.friendly_name} macroarea={selectedMacro.friendly_name} setSelectedTrilha={() => {}} setSelectedMacro={() => {}}></MudarTrilha>
      <TreePrototype></TreePrototype>
    </View>
  );
}