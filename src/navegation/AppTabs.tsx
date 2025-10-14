import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeStack from "./HomeStack";
import TrainingScreen from "../screens/Training/Training";
import StatisticsScreen from "../screens/Statistics/Statistics";
import ProfileScreen from "../screens/Profile/Profile";
import Colors from "../themes/colors";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { TrilhaProvider } from "../context/TrilhaContext";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <TrilhaProvider>
      <Tab.Navigator
        id={undefined}
        screenOptions={({ route }) => {
          const hiddenRoutes = ["Lesson", "DoneLesson"];

          return {
            headerShown: false,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.muted,
            tabBarShowLabel: false,
            tabBarStyle: (() => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? "";

              if (route.name === "Home" && hiddenRoutes.includes(routeName)) {
                return { display: "none" };
              }

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
                case "Training":
                  iconName = focused ? "barbell" : "barbell-outline";
                  break;
                case "Statistics":
                  iconName = focused ? "stats-chart" : "stats-chart-outline";
                  break;
                case "Profile":
                  iconName = focused ? "person" : "person-outline";
                  break;
                default:
                  iconName = "ellipse";
              }

              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
          };
        }}
        >

        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Training" component={TrainingScreen} />
        <Tab.Screen name="Statistics" component={StatisticsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </TrilhaProvider>
  );
}
