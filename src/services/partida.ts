import api from "./api";
import type {User} from "../types/auth";

export async function registerPartidaJogoDaMem(partidaData: {
  clicks: number;
  duration: number;
}) {
  try {
    const response = await api.post("/partidas/jogodamem", partidaData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function registerPartidaJogoWisconsin(partidaData: {
  acertos: number;
  erros_perseverativos: number;
  erros_nonperseverativos: number;
  falha_manter_conjunto: number;
  categorias_completas: number;
}) {
  try {
    const response = await api.post("/partidas/jogodowisconsin", partidaData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function registerPartidaJogoDaBola(partidaData: {
  acertos: number;
  duration: number;
}) {
  try {
    const response = await api.post("/partidas/jogodabola", partidaData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function registerPartidaJogoReac(partidaData: {
  reacao: number;
}) {
  try {
    const response = await api.post("/partidas/jogodoreac", partidaData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}