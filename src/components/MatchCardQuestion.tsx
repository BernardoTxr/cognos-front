import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Colors, Fonts, Spacing } from "../themes";
import CustomButton from "./Button";
import { useQuestionStore } from "../store/questionStore";
import { MatchCardPair } from "../types/questions";

interface MatchCardQuestionProps {
  idQuestion: number;
  questionJson: MatchCardPair[];
  onAnswer: () => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const MatchCardQuestion: React.FC<MatchCardQuestionProps> = ({
  idQuestion,
  questionJson,
  onAnswer,
}) => {
  const addQuestion = useQuestionStore((state) => state.addQuestion);

  const [conceitos, setConceitos] = useState<string[]>([]);
  const [definicoes, setDefinicoes] = useState<string[]>([]);
  const [selectedConceito, setSelectedConceito] = useState<string | null>(null);
  const [selectedDefinicao, setSelectedDefinicao] = useState<string | null>(null);
  const [disabledConceitos, setDisabledConceitos] = useState<string[]>([]);
  const [disabledDefinicoes, setDisabledDefinicoes] = useState<string[]>([]);
  const [feedbackColors, setFeedbackColors] = useState<Record<string, string>>({});
  const [anyError, setAnyError] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);

  useEffect(() => {
    setConceitos(shuffleArray(questionJson.map((p) => p.conceito)));
    setDefinicoes(shuffleArray(questionJson.map((p) => p.definicao)));
  }, [questionJson]);

  const handleSelectConceito = (c: string) => {
    if (disabledConceitos.includes(c)) return;
    setSelectedConceito(c);

    if (selectedDefinicao) {
      verificarPar(c, selectedDefinicao);
    }
  };

  const handleSelectDefinicao = (d: string) => {
    if (disabledDefinicoes.includes(d)) return;
    setSelectedDefinicao(d);

    if (selectedConceito) {
      verificarPar(selectedConceito, d);
    }
  };

  const verificarPar = (conceito: string, definicao: string) => {
    const isCorrect = questionJson.some(
      (p) => p.conceito === conceito && p.definicao === definicao
    );

    if (isCorrect) {
      setDisabledConceitos((prev) => [...prev, conceito]);
      setDisabledDefinicoes((prev) => [...prev, definicao]);
    } else {
      setAnyError(true);
    }

    // aplicar feedback visual (piscar verde/vermelho)
    setFeedbackColors({
      [conceito]: isCorrect ? Colors.success : Colors.danger,
      [definicao]: isCorrect ? Colors.success : Colors.danger,
    });

    // remover feedback após 500ms
    setTimeout(() => {
      setFeedbackColors({});
    }, 500);

    // reset seleção
    setSelectedConceito(null);
    setSelectedDefinicao(null);

    // verificar se acabou
    const totalAcertos = (disabledConceitos.length + (isCorrect ? 1 : 0));
    if (totalAcertos === questionJson.length) {
      setTimeout(() => {
        setShowFinalModal(true);
        addQuestion({ id_question: idQuestion, foiAcerto: !anyError && isCorrect });
      }, 600);
    }
  };

  const handleContinue = () => {
    setShowFinalModal(false);
    setAnyError(false);
    setSelectedConceito(null)
    setSelectedDefinicao(null);
    setDisabledConceitos([]);
    setDisabledDefinicoes([]);
    onAnswer();
  };

  return (
    <View style={styles.container}>
      <View style={styles.enunciadoView}>
        <Text style={styles.enunciado}>
          Associe os conceitos às suas definições:
        </Text>
      </View>

      <View style={styles.row}>
        {/* Conceitos */}
        <ScrollView style={styles.column}>
          <Text style={styles.columnTitle}>Conceitos</Text>
          {conceitos.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.card,
                selectedConceito === c && { backgroundColor: Colors.primary },
                disabledConceitos.includes(c) && { opacity: 0.4 },
                feedbackColors[c] && { backgroundColor: feedbackColors[c] },
              ]}
              onPress={() => handleSelectConceito(c)}
              disabled={disabledConceitos.includes(c)}
            >
              <Text style={styles.cardTextConceitos}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Definições */}
        <ScrollView style={styles.column}>
          <Text style={styles.columnTitle}>Definições</Text>
          {definicoes.map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.card,
                selectedDefinicao === d && { backgroundColor: Colors.secondary },
                disabledDefinicoes.includes(d) && { opacity: 0.4 },
                feedbackColors[d] && { backgroundColor: feedbackColors[d] },
              ]}
              onPress={() => handleSelectDefinicao(d)}
              disabled={disabledDefinicoes.includes(d)}
            >
              <Text style={styles.cardTextDefinicoes}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modal final */}
      {showFinalModal && (
        <View
          style={[
            styles.feedbackModal,
            { backgroundColor: !anyError ? Colors.success : Colors.danger },
          ]}
        >
          {!anyError ? (
            <View>
              <Text style={styles.feedbackText}>Perfeito!</Text>
              <Text style={styles.feedbackSubText}>Todas as associações feitas estavam corretas.</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.feedbackText}>Incorreto</Text>
              <Text style={styles.feedbackSubText}>Pelo menos uma das suas associações iniciais estava errada</Text>
            </View>
          )}
          <CustomButton title="CONTINUAR" fill onPress={handleContinue} />
        </View>
      )}
    </View>
  );
};

export default MatchCardQuestion;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: Spacing.small,
    flex: 1,
  },
  enunciadoView: {
    maxHeight: "20%",
    padding: Spacing.xsmall,
  },
  enunciado: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.size.large,
    color: Colors.text,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: Spacing.medium,
  },
  column: {
    flex: 1,
    marginHorizontal: Spacing.small,
  },
  columnTitle: {
    fontFamily: Fonts.bold,
    fontSize: Fonts.size.medium,
    marginBottom: Spacing.small,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.background.medium,
    borderRadius: Spacing.boderRadius,
    padding: Spacing.small,
    marginVertical: Spacing.xsmall,
    alignItems: "center",
  },
  cardTextConceitos: {
    fontFamily: Fonts.medium,
    color: Colors.text,
    fontSize: Fonts.size.medium,
    textAlign: "center",
  },
  cardTextDefinicoes: {
    fontFamily: Fonts.medium,
    color: Colors.text,
    fontSize: Fonts.size.small,
    textAlign: "center",
  },
  feedbackModal: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: Spacing.medium,
    alignItems: "center",
    alignSelf: "center",
    borderRadius: Spacing.boderRadius,
    elevation: 5,
  },
  feedbackText: {
    fontSize: Fonts.size.xlarge,
    fontFamily: Fonts.bold,
    color: Colors.background.ligth,
    marginBottom: Spacing.small,
    textAlign: "center",
  },
  feedbackSubText: {
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.bold,
    color: Colors.background.ligth,
    marginBottom: Spacing.small,
    alignSelf: "center"
  },
});
