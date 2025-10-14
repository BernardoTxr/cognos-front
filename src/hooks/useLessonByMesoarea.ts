import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { LessonInterfaceApiData } from "../types/lessons"

const fetchLessonsByMesoarea = async (mesoareaId: number) => {
    const response = await api.get<LessonInterfaceApiData>(`/lessons/by-mesoarea/${encodeURIComponent(mesoareaId)}`);
    return response.data;
}

// create hook to query lessons by mesoarea
export function useLessonsByMesoarea(mesoareaId: number) {
    const query = useQuery<LessonInterfaceApiData, Error>({
        queryFn: () => fetchLessonsByMesoarea(mesoareaId),
        queryKey: ['lessonsByMesoarea', mesoareaId],
        enabled: !!mesoareaId, // only run the query if mesoareaId is truthy
    });
    return query
}