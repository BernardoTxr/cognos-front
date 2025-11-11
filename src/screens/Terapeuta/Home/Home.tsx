import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import CustomButton from "../../../components/Button";
import ConexoesTerapeuta from "../../../components/ConexoesTerapeuta";
import CustomTitle from "../../../components/Title";

export default function HomeTerapeuta({navigation}) {

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CustomTitle title="Home" size="xlarge" titleStyle={{ marginVertical: 24 }} /> 
      <ConexoesTerapeuta />
    </View>
  );
}