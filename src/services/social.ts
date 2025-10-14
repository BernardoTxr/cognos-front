import api from "./api";

// Enviar pedido de amizade
export async function sendFriendRequest(username: string) {
  try {
    const response = await api.post("/social/friends/request", null, {
      params: { requested_username: username },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

// Aceitar pedido
export async function acceptFriendRequest(friendId: string) {
  try {
    const response = await api.post(`/social/friends/accept/${friendId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

// Deletar pedido de amizade (cancelar/rejeitar)
export async function deleteFriendRequest(friendId: string) {
  try {
    const response = await api.delete(`/social/friends/request/${friendId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}



// Remover amizade
export async function removeFriend(friendId: string) {
  try {
    const response = await api.delete(`/social/friends/${friendId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}
