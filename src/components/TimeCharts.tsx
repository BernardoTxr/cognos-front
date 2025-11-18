import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Checkbox from "expo-checkbox";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width - 100;

// ----------------------
// FUNÇÕES AUXILIARES
// ----------------------
function mean(values: number[]) {
  if (!values || values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function std(values: number[]) {
  if (!values || values.length === 0) return 0;
  const m = mean(values);
  const variance =
    values.reduce((acc, v) => acc + Math.pow(v - m, 2), 0) / values.length;
  return Math.sqrt(variance);
}

// Agrupa todos os valores do mesmo dia e retorna {labels, values}
function aggregateByDay(labels: string[], values: number[]) {
  const map: Record<string, number[]> = {};

  labels.forEach((label, i) => {
    const day = label.split(" ")[0];
    if (!map[day]) map[day] = [];
    map[day].push(values[i]);
  });

  const finalLabels = Object.keys(map);
  const finalValues = finalLabels.map((day) => mean(map[day]));

  return { finalLabels, finalValues };
}

// ----------------------
// COMPONENTE PRINCIPAL
// ----------------------
export default function TimeSeriesChart({
  title,
  labels,
  values,
}: {
  title: string;
  labels: string[];
  values: number[];
}) {
  const [showPoints, setShowPoints] = useState(true);
  const [showMean, setShowMean] = useState(false);
  const [showStd, setShowStd] = useState(false);
  const [aggregate, setAggregate] = useState(false);

  // -------- AGRUPAMENTO --------
  const { finalLabels, finalValues } = useMemo(() => {
  if (aggregate) {
    return aggregateByDay(labels, values); // Já retorna {finalLabels, finalValues}
  }

  // Retorno padronizado
  return {
    finalLabels: labels,
    finalValues: values,
  };
}, [aggregate, labels, values]);

  if (!finalValues || finalValues.length === 0)
    return (
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Text style={{ color: "#444" }}>Nenhum dado encontrado</Text>
      </View>
    );

  // -------- ESTATÍSTICAS --------
  const m = mean(finalValues);
  const s = std(finalValues);

  const meanLine = Array(finalValues.length).fill(m);
  const stdTopLine = Array(finalValues.length).fill(m + s);
  const stdBottomLine = Array(finalValues.length).fill(m - s);

  // -------- DATASETS --------
  const datasets: any[] = [];

  if (showPoints) {
    datasets.push({
      data: finalValues,
      color: (opacity = 1) => `rgba(0, 150, 255, ${opacity})`,
      strokeWidth: 2,
    });
  }

  if (showMean) {
    datasets.push({
      data: meanLine,
      color: () => "rgba(255, 165, 0, 1)", // laranja
      strokeWidth: 2,
    });
  }

  if (showStd) {
    datasets.push(
      {
        data: stdTopLine,
        color: () => "rgba(255, 0, 0, 0.6)",
        strokeWidth: 1,
      },
      {
        data: stdBottomLine,
        color: () => "rgba(255, 0, 0, 0.6)",
        strokeWidth: 1,
      }
    );
  }

  return (
    <View style={{ margin: 20, alignItems: "center", width: "95%" }}>
      <Text style={{ fontWeight: "600", fontSize: 18, marginBottom: 10 }}>
        {title}
      </Text>

      {/* CHECKBOX OPTIONS */}
      <View
        style={{
          flexDirection: "row",
          marginBottom: 16,
          gap: 25,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >

        {/* Média */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Checkbox value={showMean} onValueChange={setShowMean} />
          <Text style={{ marginLeft: 6 }}>Média</Text>
        </View>

        {/* Faixa de Desvio */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Checkbox value={showStd} onValueChange={setShowStd} />
          <Text style={{ marginLeft: 6 }}>Faixa de Desvio</Text>
        </View>
      </View>

      {/* BOTÃO DE AGRUPAMENTO */}
      <TouchableOpacity
        onPress={() => setAggregate((prev) => !prev)}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: aggregate ? "#ffa500" : "#0096ff",
          borderRadius: 12,
          marginBottom: 14,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          {aggregate ? "Ver Individual" : "Agregar por Sessão"}
        </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row" }}>
        {/* CHART */}
        <LineChart
          data={{ labels: finalLabels, datasets }}
          width={1200}
          height={220}
          withShadow={false}
          withDots={showPoints}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 150, 255, ${opacity})`,
            labelColor: () => "#444",
            propsForDots: { r: "4" },
          }}
          style={{ borderRadius: 16 }}
        />

        {/* BLOCO DE ESTATÍSTICAS */}
        <View
          style={{
            marginTop: 16,
            borderRadius: 12,
            padding: 10,
            backgroundColor: "#f5f5f5",
            width: 140,
            marginLeft: 10,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 6 }}>
            Estatísticas
          </Text>

          <Text style={{ fontSize: 13 }}>
            <Text style={{ fontWeight: "600" }}>Partidas:</Text>{" "}
            {finalValues.length}
          </Text>

          {showMean && (
            <Text style={{ fontSize: 13 }}>
              <Text style={{ fontWeight: "600" }}>Média:</Text>{" "}
              {m.toFixed(2)}
            </Text>
          )}

          {showStd && (
            <Text style={{ fontSize: 13 }}>
              <Text style={{ fontWeight: "600" }}>Desv. Pad.:</Text>{" "}
              {s.toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
