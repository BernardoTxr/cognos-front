import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { LessonInterfaceApiData } from "../types/lessons"

// Listar amigos
export async function listFriends() {
  const {data} = await api.get("/social/friends/details");
  return data;
}

export async function listFriendRequests() {
    const {data} = await api.get("/social/friends/requests/details");
    return data;
}

// create hook to query lessons by mesoarea
export function useListFriends() {
    const query = useQuery({
        queryFn: () => listFriends(),
        queryKey: ['listFriends'],
    });
    return query
}

// create hook to query friend requests
export function useListFriendRequests() {
    const query = useQuery({
        queryFn: () => listFriendRequests(),
        queryKey: ['listFriendRequests'],
    });
    return query
}