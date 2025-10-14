import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Trilha from "../screens/Home/Trilha/Trilha";
import Lesson from "../screens/Home/Lesson/Lesson";
import DoneLesson from "../screens/Home/DoneLesson/DoneLesson";

export type HomeStackParams = {
  Trilha: undefined;
  Lesson: { microareaId?: number, atividadeId: number, nivel_associado: number, atividadeType: string };
  DoneLesson: { atividadeId: number, atividadeType: string };
};

const Stack = createNativeStackNavigator<HomeStackParams>();

export default function HomeStack() {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Trilha" component={Trilha} />
      <Stack.Screen name="Lesson" component={Lesson} />
      <Stack.Screen name="DoneLesson" component={DoneLesson} />
    </Stack.Navigator>
  );
}