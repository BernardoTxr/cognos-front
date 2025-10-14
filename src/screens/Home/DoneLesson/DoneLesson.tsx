import React from "react";
import styles from "./styles";
import { View, Text, Image } from "react-native";
import CustomButton from "../../../components/Button";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { HomeStackParams } from "../../../navegation/HomeStack";
import { useQuestionStore } from "../../../store/questionStore";
import * as Progress from "react-native-progress";
import { postLessons, postQuestions } from "../../../services/areas";
import { useQueryClient } from "@tanstack/react-query";
import { useTrilha } from "../../../context/TrilhaContext";
import { Colors } from "../../../themes";

import MentucaFeliz from "../../../assets/images/mentuca_feliz.png";
import MentucaTriste from "../../../assets/images/mentuca_triste.png";

type DoneLessonProp = StackNavigationProp<
  HomeStackParams,
  "Lesson"
>;

export default function DoneLesson({ route }) {
  const navigation = useNavigation<DoneLessonProp>();

  const queryClient = useQueryClient();

  const doneQuestions = useQuestionStore((state) => state.doneQuestions);
  const clearQuestions = useQuestionStore((state) => state.clearQuestions);

  const { selectedTrilha } = useTrilha();

  const [total] = React.useState(() => doneQuestions.length);
  const [correct] = React.useState(() => doneQuestions.filter(q => q.foiAcerto).length);
  const [percent] = React.useState(() => (total > 0 ? correct / total : 0));
  const [aprovado] = React.useState(() => percent >= 0.7); 

  const {atividadeId, atividadeType} = route.params;

  let color = Colors.colors.red;
  if (percent >= 0.25 && percent < 0.5) color = Colors.colors.orange;
  else if (percent >= 0.5 && percent < 0.75) color = Colors.colors.yellow;
  else if (percent >= 0.75) color = Colors.colors.green;

  const mentucaImage = aprovado? MentucaFeliz : MentucaTriste;

  const handleContinue = async () => {
    await postLessons({id_atividade: atividadeId, foiAprovado: aprovado, type: atividadeType});
    postQuestions(doneQuestions);
    queryClient.invalidateQueries({ queryKey: ['lessonsByMesoarea', selectedTrilha.id]});
    queryClient.invalidateQueries({ queryKey: ['nivelMesoareas']});
    navigation.navigate("Trilha");
    clearQuestions();
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={[styles.titleText]}>Lição Concluída!</Text>
      <Image source={mentucaImage} style={[styles.mentuca]} resizeMode="contain" />
      {aprovado ? (
        <Text style={[styles.text]}>Você foi aprovado nessa lição. Sua próxima lição já esta disponível na sua trilha.</Text>
      ) : (
        <Text style={[styles.text]}>Você precisa de 70% de acertos para passar para próxima lição, tente novamente.</Text>
      )}
      <View style={[styles.progressBar]}>
        <View style={[styles.innerProgressBar]}>
          <Progress.Bar
            progress={percent}
            height={6}
            color={color}
            width={null}
          />
        </View>
        <Text style={[styles.percentText]}>{Math.floor(percent * 100)}%</Text>
      </View>
      <CustomButton title=" CONTINUAR" onPress={handleContinue}></CustomButton>
    </View>
  );
}