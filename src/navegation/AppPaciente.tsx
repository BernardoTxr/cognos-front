import React from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from "@expo/vector-icons";
import JogoScreen from "../screens/Paciente/Jogo/Jogo";
import HomeScreen from "../screens/Paciente/Home/Home";
import WikiScreen from "../screens/Wiki/Wiki";
import Colors from "../themes/colors";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { TrilhaProvider } from "../context/TrilhaContext";
import { GamePlaceholderScreen } from "../components/design/GamePlaceholderScreen";
import JogoDoReflexoScreen from "../screens/Jogos/JogoDoReflexo/Home";
import JogoDaMemoriaScreen from "../screens/Jogos/JogoDaMemoria/Home";
import JogoDaMatematicaScreen from "../screens/Jogos/JogoDaMatematica/Home";
import { DrawerContentComponentProps
, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";

const CognosLogo = require("../assets/images/logo_horizontal.png");

const Tab = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  
  const handleLogout = () => {
    // 🚨 Ação de Logout:
    console.log("Usuário deslogado do Cognos!");
    Alert.alert("Sair", "Você foi desconectado.", [{ text: "OK" }]);
    // Aqui você deve adicionar a lógica real de autenticação e navegação para a tela de Login.
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 1. SEÇÃO DE SCROLL (ITENS DE NAVEGAÇÃO) */}
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Adicione um cabeçalho customizado aqui, se quiser */}
        
        {/* Renderiza os itens de navegação (Home, Jogos, Wiki) */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* 2. SEÇÃO INFERIOR FIXA (LOGOUT E LOGO) */}
      <View style={styles.bottomSection}>
        {/* Botão de Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.colors.red} />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
        
        {/* Logo do Cognos */}
        <Image 
          source={CognosLogo} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  bottomSection: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.muted,
    paddingBottom: 30, // Espaço extra para visibilidade na base
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logoutText: {
    marginLeft: 15,
    fontSize: 16,
    color: Colors.colors.red,
    fontWeight: 'bold',
  },
  logo: {
    width: '100%', // Largura total
    height: 80,    // Altura fixa
    opacity: 1.0,  // Um pouco transparente para não competir com a navegação  
  }
});

export default function AppPaciente() {
  return (
    <TrilhaProvider>
      <Tab.Navigator
        id={undefined}
        drawerContent={props => <CustomDrawerContent {...props} />}
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
          name="Jogos" 
          component={JogoScreen} 
          options={{
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? "barbell" : "barbell-outline"} 
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
          name="JogoDaMemoria" 
          component={JogoDaMemoriaScreen} 
          options={{ 
            title: "Jogo da Memória", // Título da tela
            drawerItemStyle: { display: 'none' } 
          }}
        />
        <Tab.Screen 
          name="EncontreOCopo" 
          component={GamePlaceholderScreen} 
          options={{ 
            title: "Encontre o Copo",
            drawerItemStyle: { display: 'none' } 
          }}
        />
        <Tab.Screen 
          name="JogoDaMatematica" 
          component={JogoDaMatematicaScreen} 
          options={{ 
            title: "Jogo da Matemática",
            drawerItemStyle: { display: 'none' } 
          }}
        />
        <Tab.Screen 
          name="WisconsinCardGame" 
          component={GamePlaceholderScreen} 
          options={{ 
            title: "Wisconsin Card Game",
            drawerItemStyle: { display: 'none' } 
          }}
        />
        <Tab.Screen 
          name="JogoDoReflexo" 
          component={JogoDoReflexoScreen} 
          options={{ 
            title: "Jogo do Reflexo",
            drawerItemStyle: { display: 'none' } 
          }}
        />
      </Tab.Navigator>
    </TrilhaProvider>
  );
}
