export type AreaInterface = {
  id: number;
  nome?: string;
  friendly_name: string;
};

export type TrilhaContextType = {
  selectedTrilha: AreaInterface;
  setSelectedTrilha: (trilha: AreaInterface) => void;

  selectedMacro: AreaInterface;
  setSelectedMacro: (macro: AreaInterface) => void;
};

export type TypeLesson = "simulado" | "licao";

export interface LessonInterface {
  id: number;
  id_microarea: number;
  nome_microarea: string;
  nivel_associado: number;
  ordem_no_nivel: number;
  type: TypeLesson; 
  foiFeito: boolean;
  currentLesson: boolean;
}

export type LessonInterfaceApiData = LessonInterface[];