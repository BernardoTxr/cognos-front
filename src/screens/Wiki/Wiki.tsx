import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useWiki from "../../hooks/useWiki";
import api from "../../services/api";
import { Colors, Spacing, Fonts } from "../../themes";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export default function WikiScreen() {
  const { conceitos, isLoading, pendentes } = useWiki();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const isSuperuser = user?.is_superuser || false;

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

  // SUPERADMIN — aprovar / rejeitar
  const handleAprovar = async (id: number) => {
    try {
      await api.post(`/wiki/${id}/approve`);
      queryClient.invalidateQueries({ queryKey: ["wikiConcepts"] });
      queryClient.invalidateQueries({ queryKey: ["wikiPending"] });
      Alert.alert("Aprovado!", "O item foi aprovado.");
    } catch {
      Alert.alert("Erro", "Não foi possível aprovar.");
    }
  };

  const handleRejeitar = async (id: number) => {
    try {
      await api.post(`/wiki/${id}/reject`);
      queryClient.invalidateQueries({ queryKey: ["wikiConcepts"] });
      queryClient.invalidateQueries({ queryKey: ["wikiPending"] });
      Alert.alert("Rejeitado!", "O item foi rejeitado.");
    } catch {
      Alert.alert("Erro", "Não foi possível rejeitar.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.title}>Cognos Wiki</Text>

        {isSuperuser && pendentes && pendentes.length > 0 && (
          <View style={styles.pendingBox}>
            <Text style={styles.pendingTitle}>Posts Pendentes</Text>

            {pendentes.map((item) => (
              <View key={item.id} style={styles.pendingItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitulo}>{item.conceito}</Text>
                  <Text style={styles.authorText}>Criado por: {item.autor_id}</Text>
                  <Text style={styles.itemDescricao}>{item.definicao}</Text>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.approve]}
                    onPress={() => handleAprovar(item.id)}
                  >
                    <Ionicons name="checkmark-outline" size={22} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.reject]}
                    onPress={() => handleRejeitar(item.id)}
                  >
                    <Ionicons name="close-outline" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {categorias.map((categoria) => {
          const isOpen = openSection === categoria;

          const itensVisiveis = isSuperuser
            ? conceitos[categoria]
            : conceitos[categoria].filter((c) => c.status === "approved");

          if (itensVisiveis.length === 0) return null;

          return (
            <View key={categoria} style={styles.sectionContainer}>
              <TouchableOpacity
                style={[styles.header, isOpen && styles.headerOpen]}
                onPress={() => setOpenSection(isOpen ? null : categoria)}
              >
                <Text style={styles.headerText}>{categoria}</Text>
                <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color={Colors.primary}/>
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.contentBody}>
                  {itensVisiveis.map((item) => (
                    <View key={item.id} style={styles.itemCard}>
                      <Text style={styles.itemTitulo}>{item.conceito}</Text>

                      <Text style={styles.authorText}>
                        Criado por: {item.autor_id}
                      </Text>

                      <Text style={styles.itemDescricao}>{item.definicao}</Text>

                      {isSuperuser && (
                        <Text style={styles.statusText}>
                          Status: {item.status}
                        </Text>
                      )}
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
    paddingBottom: 60,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    textAlign: "center",
    color: Colors.primary,
    marginBottom: 25,
  },
  pendingBox: {
    padding: 16,
    backgroundColor: "#FFF3CC",
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 5,
    borderLeftColor: "#FFB300",
  },
  pendingTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    marginBottom: 12,
    color: "#8A5A00",
  },
  pendingItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFE9A3",
    flexDirection: "row",
    gap: 10,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    padding: Spacing.xsmall,
    borderRadius: Spacing.boderRadius,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 40,
    marginHorizontal: Spacing.xsmall,
  },
  approve: { backgroundColor: Colors.colors.green},
  reject: { backgroundColor: Colors.colors.red },

  sectionContainer: {
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: Colors.background.medium,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 14,
  },
  headerOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: "#333",
    textTransform: "capitalize",
  },
  contentBody: {
    padding: 10,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  center: {
    flex: 1,
    justifyContent: "center",
  },
  errorText: {
    fontFamily: Fonts.medium,
  },
  itemCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  itemTitulo: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    color: Colors.primary,
    marginBottom: 4,
  },
  authorText: {
    fontSize: 12,
    color: "#777",
    marginBottom: 8,
  },
  itemDescricao: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  statusText: {
    marginTop: 8,
    fontSize: 12,
    color: "#999",
  },
});