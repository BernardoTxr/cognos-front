import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
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
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!conceitos) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Não foi possível carregar a Wiki.</Text>
      </View>
    );
  }

  const categorias = Object.keys(conceitos);

  return (
    <View style={styles.container}>
      {/* ScrollView adicionada para permitir rolagem da tela toda */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Cognos Wiki</Text>

        {categorias.map((categoria) => {
          const isOpen = openSection === categoria;

          return (
            <View key={categoria} style={styles.sectionContainer}>
              {/* HEADER DO ACCORDION */}
              <TouchableOpacity
                style={[
                  styles.header,
                  isOpen && styles.headerOpen, // Remove borda inferior se aberto
                ]}
                activeOpacity={0.7}
                onPress={() => setOpenSection(isOpen ? null : categoria)}
              >
                <Text style={styles.headerText}>{categoria}</Text>
                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={Colors.primary || "#333"}
                />
              </TouchableOpacity>

              {/* CONTEÚDO EXPANSÍVEL */}
              {/* Substituído FlatList por map para evitar conflito com ScrollView */}
              {isOpen && (
                <View style={styles.contentBody}>
                  {conceitos[categoria].map((item, index) => (
                    <View 
                      key={item.id.toString()} 
                      style={[
                        styles.item,
                        index === conceitos[categoria].length - 1 && styles.lastItem // Remove borda do último
                      ]}
                    >
                      <Text style={styles.itemTitulo}>{item.conceito}</Text>
                      <Text style={styles.itemDescricao}>{item.definicao}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.ligth,
  },
  scrollContent: {
    padding: Spacing.large,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontFamily: Fonts.medium,
    color: "#666",
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.size.large + 4, // Um pouco maior
    marginBottom: 24,
    textAlign: "center",
    color: Colors.primary || "#000",
  },
  // Estilo do Cartão (Section)
  sectionContainer: {
    marginBottom: 16,
    borderRadius: Spacing.boderRadius,
    backgroundColor: "#fff", // Ou Colors.background.paper
    // Sombras para dar destaque (elevation para Android, shadow para iOS)
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Spacing.medium,
    paddingVertical: 16, // Mais altura para toque
    alignItems: "center",
    backgroundColor: "#fff", // Fundo do header
    borderRadius: Spacing.boderRadius,
  },
  headerOpen: {
    // Quando aberto, remove o arredondamento inferior para colar no conteúdo
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerText: {
    fontFamily: Fonts.bold, // Destaque maior para a categoria
    fontSize: Fonts.size.medium,
    color: "#333",
    textTransform: "capitalize",
  },
  // Corpo do Accordion
  contentBody: {
    backgroundColor: "#fafafa", // Fundo levemente diferente para o conteúdo
    borderBottomLeftRadius: Spacing.boderRadius,
    borderBottomRightRadius: Spacing.boderRadius,
    paddingHorizontal: Spacing.medium,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  lastItem: {
    borderBottomWidth: 0, // Remove linha do último item
  },
  itemTitulo: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.size.medium,
    color: Colors.primary || "#007AFF", // Cor de destaque no título do item
    marginBottom: 4,
  },
  itemDescricao: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.size.small,
    color: "#555",
    lineHeight: 20, // Melhor leitura
  },
});