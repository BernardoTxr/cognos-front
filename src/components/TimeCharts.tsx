import React from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width - 120;

export default function TimeSeriesChart({ title, labels, values }) {
  return (
    <View style={{ marginVertical: 20, alignItems: "center" }}>
      <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 8 }}>{title}</Text>
      <LineChart
        data={{
          labels,
          datasets: [{ data: values }],
        }}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 150, 255, ${opacity})`,
          labelColor: () => "#444",
          style: { borderRadius: 16 },
          propsForDots: { r: "4" },
        }}
        style={{ borderRadius: 16 }}
      />
    </View>
  );
}
