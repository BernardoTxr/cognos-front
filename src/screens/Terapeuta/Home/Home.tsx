import { View } from "react-native";
import ConexoesTerapeuta from "../../../components/ConexoesTerapeuta";

export default function HomeTerapeuta({navigation}) {

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ConexoesTerapeuta />
    </View>
  );
}