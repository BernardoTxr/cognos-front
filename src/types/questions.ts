export interface BaseQuestion {
  type: string;
  source: string;
  prova: string;
  question_json: Question;
}

export interface Alternativa {
  letra: string;
  texto: string;
}

export interface MultipleChoiceInterface extends BaseQuestion{
  enunciado: string;
  alternativas: Alternativa[];
  alternativa_correta: string;
}

export interface MatchCardPair {
  conceito: string;
  definicao: string;
}

export type MatchCardInterface = MatchCardPair[];

export type Question = MultipleChoiceInterface | MatchCardInterface;

export type TypeQuestion = 'cinco_alternativas' | 'quatro_matchcard'

export interface QuestionInterface {
  id_microarea: number;
  type: TypeQuestion;
  prova: string;
  difficulty: number;
  source: string;
  id: number;
  question_json: string;
  created_at: string;
}

export type QuestionInterfaceApiData = QuestionInterface[];

export type DoneQuestion = {
  id_question: number;
  foiAcerto: boolean;
};
