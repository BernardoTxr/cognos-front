import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./RootNavegator";

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}