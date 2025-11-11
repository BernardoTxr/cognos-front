import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import AppPaciente from "./AppPaciente";
import AppTerapeuta from "./AppTerapeuta";
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isLoggedIn, user } = useAuth();
  const isPaciente = user?.is_patient;

  console.log("user", JSON.stringify(user));


  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        isPaciente ? (
          <Stack.Screen name="AppPaciente" component={AppPaciente} />
        ) : (
          <Stack.Screen name="AppTerapeuta" component={AppTerapeuta} />
        )
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
