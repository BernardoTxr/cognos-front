import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import _ from "lodash";

export async function fetchNivelByMesoareas() {
  const { data } = await api.get("/stats/nivel/all");
  return data;
}

export function useNivelMesoareas() {
  const query = useQuery({
    queryKey: ["nivelMesoareas"],
    queryFn: fetchNivelByMesoareas,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  // transforma a lista em um objeto { mesoarea_id: nivel }
  const nivelMesoareaMap = query.data?.reduce((acc, item) => {
    acc[item.mesoarea_id] = item.nivel;
    return acc;
  }, {} as Record<number, number>) || {};

  const nivelMacroareaMap =
  _.mapValues(
    _.groupBy(query.data, "id_macroarea"),
    (items) => _.meanBy(items, "nivel")
  ) as Record<number, number>;

  return { ...query, nivelMesoareaMap, nivelMacroareaMap };
}

