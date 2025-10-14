import api from "./api";

// create service for register account
export async function registerAccount(email: string, username: string, password: string) {
  try {
    const response = await api.post("/auth/register", {
      email,
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// create service for login
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
