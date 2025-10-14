import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import JogoScreen from "../screens/Paciente/Jogo/Jogo";
import HomeScreen from "../screens/Paciente/Home/Home";
import Colors from "../themes/colors";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { TrilhaProvider } from "../context/TrilhaContext";

const Tab = createBottomTabNavigator();

export default function AppPaciente() {
  return (
    <TrilhaProvider>
      <Tab.Navigator
        id={undefined}
        screenOptions={({ route }) => {

          return {
            headerShown: false,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.muted,
            tabBarShowLabel: false,
            tabBarStyle: (() => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? "";

              return {
                backgroundColor: Colors.background.ligth,
                borderTopWidth: 0.5,
                height: 64,
                paddingBottom: 5,
              };
            })(),
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: string;

              switch (route.name) {
                case "Home":
                  iconName = focused ? "home" : "home-outline";
                  break;
                case "Jogo":
                  iconName = focused ? "barbell" : "barbell-outline";
                  break;
                default:
                  iconName = "ellipse";
              }

              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
          };
        }}
        >

        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Jogo" component={JogoScreen} />
      </Tab.Navigator>
    </TrilhaProvider>
  );
}
