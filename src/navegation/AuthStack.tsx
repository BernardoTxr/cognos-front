import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Auth/Login/Login";
import SignUp from "../screens/Auth/SignUp/SignUp"
import Public from "../screens/Public/Public";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Public" component={Public} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}