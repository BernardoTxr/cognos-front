import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

// Listar duelos
export async function listDuelos() {
  const {data} = await api.get("/duelo/my_duelos");
  return data;
}

export function useListDuelos() {
    const query = useQuery({
        queryFn: () => listDuelos(),
        queryKey: ['listDuelos'],
    });
    return query
}
