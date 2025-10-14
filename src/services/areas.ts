import api from "./api";
import {type DoneQuestion } from "../types/questions";

// get mesoareas for a given macroarea
export async function getMesoareaByMacroarea(macroarea_name: string) {
  try {
    const response = api.get(`/mesoareas/by-macroarea/${macroarea_name}`);
    return response;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

// get all macroarea
export async function getMacroareas(){
    try{
        const response = await api.get("/macroareas/");
        return response;
    } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function  postQuestions(questions: DoneQuestion[]){
    const response = await api.post<DoneQuestion[]>(
        "/questions/done-question/",
        questions
    );
    return response;
}

export async function postLessons(lesson: {id_atividade: number, foiAprovado: boolean, type: string}){
    const response = await api.post<{id_atividade: number, foiAprovado: boolean, type: string}>(
        "/lessons/done-lesson/",
        lesson
    );
    return response;
}
