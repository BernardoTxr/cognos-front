import api from "./api";
import type {User} from "../types/auth";

// --- Função para registrar a conta de usuário ---
export async function registerAccount(
  email: string,
  username: string,
  password: string,
  is_patient: boolean
) {
  try {
    const response = await api.post("/auth/register", {
      email,
      username,
      password,
      is_patient,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getMe() {
  try {
    const response = await api.get<User>("/users/me");
    return response.data;
  } catch (error) {
    throw error;
  }
}

// --- Função para login ---
export async function loginAccount(email: string, password: string) {
  try {
    const formData = new URLSearchParams();
    formData.append("username", email); // FastAPI Users ainda espera "username"
    formData.append("password", password);

    const response = await api.post("/auth/jwt/login", formData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

// --- Função para criar perfil de Paciente ---
export async function registerPaciente(pacienteData: {
  nome_completo: string;
  data_de_nascimento: string; // ou Date convertido para ISO
  cpf: string;
  sexo: "masc" | "fem" | "outro";
  nivel_tea?: "nivel_1" | "nivel_2" | "nivel_3";
}) {
  try {
    const response = await api.post("/preencher_dados/paciente", pacienteData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

// --- Função para criar perfil de Terapeuta ---
export async function registerTerapeuta(terapeutaData: {
  nome_completo: string;
  documento?: string | null;
}) {
  try {
    const response = await api.post("/preencher_dados/terapeuta", terapeutaData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}
