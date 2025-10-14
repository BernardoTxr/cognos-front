import React from 'react';
import { Text } from "react-native";
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import MatchCardQuestion from './MatchCardQuestion';
import { Question, MultipleChoiceInterface, MatchCardInterface } from '../types/questions';

interface QuestionRendererProps {
  idQuestion: number,
  questionType: string;
  questionJson: Question;
  prova?: string;
  onAnswer: () => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
    idQuestion,
    questionType,
    questionJson,
    prova,
    onAnswer
 }) => {
  switch (questionType) {
    case 'cinco_alternativas':
      return <MultipleChoiceQuestion idQuestion={idQuestion} questionJson={questionJson as MultipleChoiceInterface} prova={prova} onAnswer={onAnswer}/>;
    case 'quatro_matchcard':
      return <MatchCardQuestion idQuestion={idQuestion} questionJson={questionJson as MatchCardInterface} onAnswer={onAnswer}/>;
    default:
      return <Text>Tipo de questão desconhecido.</Text>;
  }
};

export default QuestionRenderer;