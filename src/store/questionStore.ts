import { create } from "zustand";
import {type DoneQuestion } from "../types/questions";

interface QuestionStore {
  doneQuestions: DoneQuestion[];
  addQuestion: (question: DoneQuestion) => void;
  clearQuestions: () => void;
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  doneQuestions: [],
  addQuestion: (question: DoneQuestion) => set((state) => ({
    doneQuestions: [...state.doneQuestions, question]
  })),
  clearQuestions: () => set({ doneQuestions: [] })
}));