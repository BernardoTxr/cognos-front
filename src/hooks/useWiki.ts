import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { WikiConcept } from "../types/wiki";

type WikiGrouped = Record<string, WikiConcept[]>;

// Busca bruta da API
async function fetchWikiConcepts() {
  const { data } = await api.get<WikiConcept[]>("/wiki");
  return data;
}

// Agrupa por categoria (topico_rel.nome)
function groupByCategory(conceitos: WikiConcept[]): WikiGrouped {
  const grupos: WikiGrouped = {};

  conceitos.forEach((c) => {
    const categoria = c.topico_rel?.nome ?? "Outros";

    if (!grupos[categoria]) {
      grupos[categoria] = [];
    }

    grupos[categoria].push(c);
  });

  return grupos;
}

export default function useWiki() {
  const query = useQuery<WikiGrouped>({
    queryKey: ["wikiConcepts"],
    queryFn: async () => {
      const conceitos = await fetchWikiConcepts();
      return groupByCategory(conceitos);
    },
  });

  return {
    ...query,
    conceitos: query.data,
  };
}
