import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert, Text } from "react-native";
import { fetchGameData } from "../services/dashboard";
import TimeSeriesChart from "./TimeCharts";
import { Colors } from "../themes";

export default function GameCharts({ pacienteId, selectedGame }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pacienteId || !selectedGame) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchGameData(selectedGame, pacienteId);
        setData(res.data || []);
      } catch (e) {
        Alert.alert("Erro", "Falha ao carregar dados do jogo.");
      } finally {
        setLoading(false);
      }
    })();
  }, [pacienteId, selectedGame]);

  if (loading)
    return (
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );

  if (!data || data.length === 0)
    return <Text style={{ textAlign: "center", marginTop: 20 }}>Nenhum dado disponível</Text>;

  switch (selectedGame) {
    case "jogodamem":
      return (
        <View>
          <TimeSeriesChart
            title="Tempo por partida (segundos)"
            labels={data.map(d => new Date(d.played_at).toLocaleDateString())}
            values={data.map(d => d.duration / 1000)}
          />
          <TimeSeriesChart
            title="Cliques por partida"
            labels={data.map(d => new Date(d.played_at).toLocaleDateString())}
            values={data.map(d => d.clicks)}
          />
        </View>
      );

    case "jogodabola":
      return (
        <View>
          <TimeSeriesChart
            title="Taxa de acertos"
            labels={data.map(d => new Date(d.played_at).toLocaleDateString())}
            values={data.map(d => d.acertos)}
          />
          <TimeSeriesChart
            title="Duração por partida (segundos)"
            labels={data.map(d => new Date(d.played_at).toLocaleDateString())}
            values={data.map(d => d.duration / 1000)}
          />
        </View>
      );

    case "jogoreac":
      return (
        <View>
          <TimeSeriesChart
            title="Tempo de reação (ms)"
            labels={data.map(d => new Date(d.played_at).toLocaleDateString())}
            values={data.map(d => d.reacao)}
          />
        </View>
      );

    default:
      return null;
  }
}
