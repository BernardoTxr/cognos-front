// src/hooks/useMainPreFetching.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { fetchNivelByMesoareas } from "../hooks/useNivelMesoareas";

export function useMainPreFetching(isLoggedIn?: boolean) {
    const queryClient = useQueryClient();

    useEffect(() => {
        // só faz prefetch se estiver logado
        if (isLoggedIn === false) return;

        // pré-carrega o cálculo de nível
        queryClient.prefetchQuery({
        queryKey: ["nivelMesoareas"], 
        queryFn: fetchNivelByMesoareas,
        staleTime: 1000 * 60 * 5, // cache válido por 5 minutos
    });

    // adicionar outros prefetches conforme necessário
    // ex: queryClient.prefetchQuery({ queryKey: ["profile"], queryFn: fetchProfile })
  }, [queryClient, isLoggedIn]);
}
