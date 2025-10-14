import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView
} from "react-native";
import { Colors, Fonts, Spacing } from "../themes";
import CustomButton from "./Button";
import OptionsButton from "./OptionsButton";
import {MultipleChoiceInterface } from "../types/questions"
import { useQuestionStore } from "../store/questionStore";

interface MultipleChoiceQuestionProps {
  idQuestion: number,
  questionJson: MultipleChoiceInterface;
  prova?: string;
  onAnswer: () => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  idQuestion,
  questionJson,
  prova,
  onAnswer
}) => {
  const itens = questionJson.alternativas;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [disabledIndexes, setDisabledIndexes] = useState<number[]>([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const addQuestion = useQuestionStore((state) => state.addQuestion);

  useEffect(() => {
    const allDisabled = disabledIndexes.length === itens.length;
    setIsSubmitDisabled(selectedIndex === null || allDisabled);
  }, [selectedIndex, disabledIndexes]);

  const toggleDisabled = (index: number) => {
    if (disabledIndexes.includes(index)) {
      setDisabledIndexes(disabledIndexes.filter(i => i !== index));
    } else {
      setDisabledIndexes([...disabledIndexes, index]);
      if (index === selectedIndex) setSelectedIndex(null);
    }
  };

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelectedIndex(index);
  };

  const handleAnswer = () => {
    if (selectedIndex === null) return;
    const selectedLetter = itens[selectedIndex].letra;
    const correct = selectedLetter === questionJson.alternativa_correta;
    setIsCorrect(correct);
    setAnswered(true);
    setShowFeedback(true);
    addQuestion({id_question: idQuestion, foiAcerto: correct})
  };

  const handleContinue = () => {
    setAnswered(false);
    setShowFeedback(false);
    setSelectedIndex(null);
    setDisabledIndexes([]);
    onAnswer();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.enunciadoView}>
        <Text style={styles.enunciado}>
          {prova ? `${prova} - ` : ""}{questionJson.enunciado}
        </Text>
      </ScrollView>

      <ScrollView style={styles.itensContainer}>
        {itens.map((option, index) => {
          const isSelected = index === selectedIndex;
          const isDisabled = disabledIndexes.includes(index);

          return (
            <OptionsButton
              key={option.letra}
              title={`${option.letra}) ${option.texto}`}
              isSelected={isSelected}
              isDisabled={isDisabled}
              onSelect={() => {
                if (!answered && !isDisabled) handleSelect(index);
              }}
              onToggleDisable={() => toggleDisabled(index)}
            />
          );
        })}
      </ScrollView>

      {!answered && (
        <CustomButton
          title="SUBMETER RESPOSTA"
          fill
          onPress={handleAnswer}
        />
      )}

      {showFeedback && (
        <View
          style={[
            styles.feedbackModal,
            { backgroundColor: isCorrect ? Colors.success : Colors.danger },
          ]}
        >
          <Text style={styles.feedbackText}>
            {isCorrect ? "Certo!" : "Incorreto"}
          </Text>
          {!isCorrect && (
            <Text style={styles.correctAnswer}>
              Resposta correta:{" "}
              {
                itens.find(
                  alt => alt.letra === questionJson.alternativa_correta
                )?.texto
              }
            </Text>
          )}
          <CustomButton
            disabled={isSubmitDisabled}
            title="CONTINUAR"
            fill
            onPress={handleContinue}
          />
        </View>
      )}
    </View>
  );
};

export default MultipleChoiceQuestion;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
    padding: Spacing.small,
    borderRadius: Spacing.boderRadius,
    flexDirection: "column",
    flex: 1,
  },
  itensContainer: {
    maxHeight: "55%",
    backgroundColor: Colors.background.medium,
    borderRadius: Spacing.boderRadius,
    marginVertical: Spacing.xlarge,
    paddingVertical: Spacing.xsmall,
  },
  enunciadoView: {
    maxHeight: "25%",
    padding: Spacing.xsmall,
  },
  enunciado: {
    fontFamily: Fonts.bold,
    color: Colors.text,
    fontSize: Fonts.size.large,
  },
  feedbackModal: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: Spacing.medium,
    alignItems: "center",
    alignSelf: "center",
    borderRadius: Spacing.boderRadius,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  feedbackText: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.background.ligth,
    marginBottom: Spacing.small,
  },
  correctAnswer: {
    fontSize: 18,
    color: Colors.background.ligth,
    fontFamily: Fonts.medium,
    marginBottom: Spacing.medium,
  },
});
