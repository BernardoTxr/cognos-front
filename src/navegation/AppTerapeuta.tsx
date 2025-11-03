import React from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from "@expo/vector-icons";
import WikiScreen from "../screens/Wiki/Wiki";
import HomeScreen from "../screens/Terapeuta/Home/Home";
import Colors from "../themes/colors";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { TrilhaProvider } from "../context/TrilhaContext";
import DashboardScreen from "../screens/Dashboard/Home";
const Tab = createDrawerNavigator();

export default function AppPaciente() {
  return (
    <TrilhaProvider>
      <Tab.Navigator
        id={undefined}
        // Opções aplicadas a todos os itens do menu de gaveta
        screenOptions={{
          // 1. IMPORTANTE: Remova headerShown: false, ou defina como true.
          // O botão de "hambúrguer" (para abrir a gaveta) aparece no cabeçalho.
          headerShown: true, 
          // 2. Opções visuais do Drawer (Gaveta)
          drawerActiveTintColor: Colors.primary, // Cor do texto/ícone ativo
          drawerInactiveTintColor: Colors.muted, // Cor do texto/ícone inativo
          drawerStyle: { // Estilo da gaveta em si (a barra lateral)
            backgroundColor: Colors.background.ligth,
            width: 240, // Largura da gaveta
          },
          // Opcional: Estilo do cabeçalho (Header)
          headerTintColor: Colors.primary,
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Wiki" 
          component={WikiScreen} 
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? "book" : "book-outline"} 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? "analytics" : "analytics-outline"} 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
      </Tab.Navigator>
    </TrilhaProvider>
  );
}
