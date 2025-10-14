import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { QuestionInterfaceApiData } from "../types/questions";

const fetchQuestionsByMesoarea = async (microareaId: number, quantity: number, nivel_associado: number) => {
    const response = await api.post<QuestionInterfaceApiData>(
        "/questions/by-microarea-and-quantity/",
        {
            microarea_id: microareaId,
            quantity: quantity,
            nivel_associado: nivel_associado,
        }
    );
    return response.data;
}

export function useQuestions(microareaId: number, quantity: number, nivel_associado: number) {
    const query = useQuery<QuestionInterfaceApiData, Error>({
        queryFn: () => fetchQuestionsByMesoarea(microareaId, quantity, nivel_associado),
        queryKey: ['questionsByMesoarea', microareaId],
        enabled: !!microareaId,
    });
    return query;
}