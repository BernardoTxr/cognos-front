import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../services/api";
import { Colors, Spacing, Fonts } from "../../themes";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../../context/AuthContext";

export default function AdicionarPostScreen() {
    const { user } = useAuth();
    const isSuperuser = user?.is_superuser || false;

  const { data: topicos } = useQuery({
    queryKey: ["wikiTopics"],
    queryFn: async () => {
      const r = await api.get("/wiki/topics");
      return r.data;
    },
  });

  const [topico, setTopico] = useState("");
  const [conceito, setConceito] = useState("");
  const [definicao, setDefinicao] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!topico || !conceito || !definicao) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/wiki", {
        topico,
        conceito,
        definicao,
      });

      Alert.alert(
        "Sucesso!",
        isSuperuser ? "Post aprovado automaticamente!" : "Post criado e enviado para aprovação."
      );

      queryClient.invalidateQueries({ queryKey: ["wikiConcepts"] });
      queryClient.invalidateQueries({ queryKey: ["wikiPending"] });

      setTopico("");
      setConceito("");
      setDefinicao("");

    } catch (err) {
      Alert.alert("Erro", "Não foi possível criar o post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Adicionar Post na Wiki</Text>

      <Text style={styles.label}>Tópico</Text>

      {isSuperuser ? (
        // SUPERADMIN PODE CRIAR TÓPICO LIVREMENTE
        <TextInput
          value={topico}
          onChangeText={setTopico}
          placeholder="Digite um novo tópico..."
          style={styles.input}
        />
      ) : (
        // TERAPEUTA ESCOLHE ENTRE TÓPICOS EXISTENTES
        <Picker
          selectedValue={topico}
          onValueChange={setTopico}
          style={styles.input}
        >
          <Picker.Item label="Selecione um tópico" value="" />
          {topicos?.map((t) => (
            <Picker.Item key={t.id} label={t.topico} value={t.topico} />
          ))}
        </Picker>
      )}

      <Text style={styles.label}>Conceito</Text>
      <TextInput
        value={conceito}
        onChangeText={setConceito}
        placeholder="Escreva o conceito..."
        style={styles.input}
      />

      <Text style={styles.label}>Definição</Text>
      <TextInput
        value={definicao}
        onChangeText={setDefinicao}
        placeholder="Descreva a definição..."
        style={[styles.input, styles.textArea]}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Adicionar</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.large,
    backgroundColor: Colors.background.ligth,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.size.large,
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontFamily: Fonts.medium,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: Colors.background.medium,
    padding: Spacing.medium,
    borderRadius: Spacing.boderRadius,
  },
  textArea: {
    height: 140,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    padding: Spacing.medium,
    borderRadius: Spacing.boderRadius,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontFamily: Fonts.bold,
    fontSize: Fonts.size.medium,
  },
});
