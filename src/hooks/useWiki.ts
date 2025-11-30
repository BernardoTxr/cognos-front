import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { WikiConcept } from "../types/wiki";
import { useAuth } from "../context/AuthContext";

type WikiGrouped = Record<string, WikiConcept[]>;

async function fetchWikiConcepts() {
  const { data } = await api.get<WikiConcept[]>("/wiki");
  return data;
}

async function fetchWikiConceptsPending() {
  const { data } = await api.get<WikiConcept[]>("/wiki/pending");
  console.log("data:", data)
  return data;
}

function groupByCategory(conceitos: WikiConcept[]): WikiGrouped {
  const grupos: WikiGrouped = {};

  conceitos.forEach((c) => {
    const categoria = c.topico_rel?.topico ?? "Outros";

    if (!grupos[categoria]) {
      grupos[categoria] = [];
    }

    grupos[categoria].push(c);
  });

  return grupos;
}

export default function useWiki() {

  const { user } = useAuth();
  const isSuperuser = user?.is_superuser || false;

  const conceitosQuery = useQuery({
    queryKey: ["wikiConcepts"],
    queryFn: async () => {
      const conceitos = await fetchWikiConcepts();
      return groupByCategory(conceitos);
    },
  });

  const pendentesQuery = useQuery({
    queryKey: ["wikiPending"],
    queryFn: fetchWikiConceptsPending,
    enabled: !!isSuperuser,
  });

  return {
    conceitos: conceitosQuery.data,
    pendentes: pendentesQuery.data ?? [],
    isLoading: conceitosQuery.isLoading || pendentesQuery.isLoading,
    refetch: () => {
      conceitosQuery.refetch();
      pendentesQuery.refetch();
    },
  };
}
