import api from "./api";

// Criar duelo
export async function createNewDuelo(uid2: string, id_mesoarea: number, rounds: number) {
  try {
    const response = await api.post("/duelo/create", {
      uid2,
      id_mesoarea,
      rounds,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}
