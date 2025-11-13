import api from "./api";

export async function fetchPacientes() {
  try {
    console.log("🔍 Buscando pacientes do terapeuta...");
    const response = await api.get("/paciente_terapeuta/me/pacientes");
    return response; // retorna response completo (data = lista)
  } catch (error: any) {
    console.error("Erro ao buscar pacientes:", error);
    throw error.response?.data || error;
  }
}

export const fetchGameData = (game: string, pacienteId: string) =>
  api.get(`/dashboard/${game}?paciente_id=${pacienteId}`);
