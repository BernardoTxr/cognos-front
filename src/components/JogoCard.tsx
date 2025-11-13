import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts, Spacing} from "../themes";

// Componente para o Card de Jogo
export const JogoCard = ({ title, description, tests, iconName, onPlay }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      {/* Ícone de Exemplo */}
      <Ionicons name={iconName} size={40} color={Colors.primary} style={styles.icon} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.tests} numberOfLines={1}>
          🧠 Avalia: {tests}
        </Text>
      </View>
    </View>

    <Text style={styles.description}>{description}</Text>

    <TouchableOpacity style={styles.playButton} onPress={onPlay}>
      <Ionicons name="play-circle-outline" size={20} color={Colors.background.dark} />
      <Text style={styles.playButtonText}>JOGAR</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.ligth,
    borderRadius: Spacing.boderRadius,
    padding: Spacing.large,
    marginHorizontal: 10,
    marginBottom: 15,
    elevation: 4, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: "90%",
    alignSelf: "center",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: Fonts.size.large,
    fontWeight: 'bold',
    color: Colors.text,
  },
  tests: {
    fontSize: Fonts.size.medium,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  description: {
    fontSize: Fonts.size.medium,
    color: Colors.text,
    marginBottom: 15,
    lineHeight: 20,
  },
  playButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 5,
  },
  playButtonText: {
    color: Colors.background.dark,
    fontSize: Fonts.size.large,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});