import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import AppTabs from "./AppTabs";
import { useAuth } from "../context/AuthContext";
import { useMainPreFetching } from "../hooks/useMainPreFetching";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isLoggedIn } = useAuth();

  // dispara o prefetch só quando logado
  useMainPreFetching(isLoggedIn);

  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="App" component={AppTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
