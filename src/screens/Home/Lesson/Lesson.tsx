
import { useState } from "react";
import { View, ActivityIndicator, TouchableOpacity } from "react-native";
import * as Progress from "react-native-progress";
import QuestionRenderer from "../../../components/QuestionRenderer";
import styles from "./styles";
import { Question } from "../../../types/questions";
import { Ionicons } from '@expo/vector-icons'; 
import {useQuestions} from "../../../hooks/useQuestions";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { HomeStackParams } from "../../../navegation/HomeStack";
import { useQuestionStore } from "../../../store/questionStore";
import { Colors } from "../../../themes";


type LessonProp = StackNavigationProp<
  HomeStackParams,
  "Lesson"
>;


export default function Lesson({route}) {
  const navigation = useNavigation<LessonProp>();

  const clearQuestions = useQuestionStore((state) => state.clearQuestions);
  

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(true);

  const { microareaId, atividadeId, nivel_associado, atividadeType } = route.params;
  const { data: questions, isLoading } = useQuestions(microareaId, 5, nivel_associado);

  if(isLoading || !questions || questions.length === 0){
          return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" />
            </View>
          );
    } else {
      const handleAnswer = () => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          navigation.navigate("DoneLesson", { atividadeId: atividadeId, atividadeType: atividadeType});
        }
      };

  return (
    <View style={[styles.container]}>
      <View style={[styles.upperBarContainer]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {navigation.navigate("Trilha"); clearQuestions();}}
        >
          <Ionicons name="chevron-back-outline" size={32}></Ionicons>
        </TouchableOpacity>
        <View style={[styles.innerProgressBar]}>
          <Progress.Bar
          progress={currentIndex / questions.length}
          height={6}
          width={null}
          color={Colors.primary}
          />
        </View>
        <Ionicons style={styles.closeButton} name="flash-outline" size={32}></Ionicons>
      </View>
      {showModal && (
        <QuestionRenderer
          idQuestion={questions[currentIndex].id}
          questionType={questions[currentIndex].type}
          questionJson={JSON.parse(questions[currentIndex].question_json) as Question}
          prova={questions[currentIndex].prova}
          onAnswer={handleAnswer}
        />
      )}
    </View>
  );
}
};