import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useWiki from "../../hooks/useWiki";
import { Colors, Spacing, Fonts } from "../../themes";

export default function WikiScreen() {
  const { conceitos, isLoading } = useWiki();
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!conceitos) {
    return (
      <View style={styles.center}>
        <Text>Não foi possível carregar a Wiki.</Text>
      </View>
    );
  }

  // 🔥 Lista de categorias (dinâmica, funciona para qualquer estrutura)
  const categorias = Object.keys(conceitos);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wiki</Text>

      {categorias.map((categoria) => (
        <View key={categoria} style={styles.section}>
          {/* HEADER DO ACCORDION */}
          <TouchableOpacity
            style={styles.header}
            onPress={() =>
              setOpenSection(openSection === categoria ? null : categoria)
            }
          >
            <Text style={styles.headerText}>{categoria.toUpperCase()}</Text>

            <Ionicons
              name={openSection === categoria ? "chevron-up" : "chevron-down"}
              size={20}
              color="#000"
            />
          </TouchableOpacity>

          {/* LISTA EXPANSÍVEL */}
          {openSection === categoria && (
            <FlatList
              data={conceitos[categoria]}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.itemTitulo}>{item.titulo}</Text>
                  <Text style={styles.itemDescricao}>{item.descricao}</Text>
                </View>
              )}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.large,
    backgroundColor: Colors.background.ligth,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.size.large,
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 12,
    backgroundColor: Colors.background.medium,
    borderRadius: Spacing.boderRadius,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Spacing.medium,
    alignItems: "center",
  },
  headerText: {
    fontFamily: Fonts.medium,
    fontSize: Fonts.size.medium,
  },
  item: {
    padding: Spacing.medium,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  itemTitulo: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.size.medium,
  },
  itemDescricao: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.size.small,
    color: "#555",
  },
});
