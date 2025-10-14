import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Dimensions,
  View,
  ActivityIndicator,
  Image,
  Text,
  Animated,
} from "react-native";
import { useTrilha } from "../../context/TrilhaContext";
import { useLessonsByMesoarea } from "../../hooks/useLessonByMesoarea";
import { LessonIcon } from "./LessonIcon";

const { width, height: screenHeight } = Dimensions.get("window");

const TRUNK_HEIGHT = 140;
const TRUNK_WIDTH = 70;
const BRANCH_HEIGHT = 120;

export default function TreePrototype() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { selectedTrilha } = useTrilha();
  const { data: lessonData, isLoading } = useLessonsByMesoarea(
    selectedTrilha.id
  );

  const [isRendering, setIsRendering] = useState(true);
  const scrollRef = useRef<Animated.ScrollView | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setIsRendering(false), 50);
    return () => clearTimeout(timeout);
  }, []);

  const currentLessonIndex = useMemo(() => {
    return lessonData?.findIndex((l) => l.currentLesson) ?? 0;
  }, [lessonData]);

  useEffect(() => {
    if (!lessonData || lessonData.length === 0 || isRendering) return;

    const offsetY =
      (lessonData.length - 1 - currentLessonIndex) * TRUNK_HEIGHT;

    scrollRef.current?.scrollTo({
      y: Math.max(offsetY, 0),
      animated: false,
    });
  }, [lessonData, isRendering, currentLessonIndex]);

  if (isLoading || isRendering) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Parallax vertical
  const translateY = scrollY.interpolate({
    inputRange: [0, lessonData.length * TRUNK_HEIGHT],
    outputRange: [0, -lessonData.length * TRUNK_HEIGHT * 0.3],
    extrapolate: "clamp",
  });

  // Parallax horizontal
  const translateX = scrollY.interpolate({
    inputRange: [0, lessonData.length * TRUNK_HEIGHT],
    outputRange: [0, -width * 0.1],
    extrapolate: "clamp",
  });

  return (
    <View style={{ flex: 1, overflow: "hidden" }}>
      {/* Fundo parallax */}
      <Animated.Image
        source={require("../../assets/images/ceu_background.png")}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: width * 2, // largura maior para evitar corte
          height: screenHeight * 4,
          transform: [{ translateY }, { translateX }],
        }}
        resizeMode="repeat"
      />

      <Animated.ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          alignItems: "center",
          flexDirection: "column-reverse",
          paddingBottom: 50,
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Chão de grama */}
        <Image
          source={require("../../assets/images/grama.png")}
          style={{
            resizeMode: "cover",
            marginVertical: -50,
          }}
        />

        {/* Renderização das lições */}
        {lessonData.map((node, index) => {
          const isLeft = index % 2 === 0;
          const previousNode = lessonData[index - 1];
          const isNewLevel =
            index === 0 ||
            node.nivel_associado !== previousNode?.nivel_associado;

          return (
            <View
              key={`${node.id}-${node.type}`}
              style={{
                width,
                height: TRUNK_HEIGHT,
                justifyContent: "flex-end",
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* Separador de nível */}
              {isNewLevel && (
                <View
                  style={{
                    position: "absolute",
                    top: 10,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
              {/* Linha horizontal */}
                <View
                  style={{
                    height: 2,
                    width: width * 0.9,
                    backgroundColor: "#654321",
                    position: "absolute",
                    top: 64,
                  }}
                />
                {/* Círculo com número do nível */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#654321",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 2,
                    top: 48,
                  }}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {node.nivel_associado}
                    </Text>
                  </View>
                </View>
              )}

              {/* Tronco */}
              <Image
                source={require("../../assets/images/tronco.png")}
                style={{
                  width: TRUNK_WIDTH,
                  height: TRUNK_HEIGHT,
                  resizeMode: "contain",
                }}
              />

              {/* Galho */}
              <Image
                source={require("../../assets/images/galho.png")}
                style={{
                  width: 160,
                  height: BRANCH_HEIGHT,
                  resizeMode: "contain",
                  transform: [{ scaleX: isLeft ? -1 : 1 }],
                  position: "absolute",
                  left: isLeft ? width / 2 - 180 : width / 2 + 30,
                  bottom: TRUNK_HEIGHT / 2,
                }}
              />

              {/* Lição */}
              <LessonIcon
                isLeft={isLeft}
                type={node.type}
                foiFeito={node.foiFeito}
                y={TRUNK_HEIGHT + 50}
                branchX={isLeft ? width / 2 - 110 : width / 2 + 40}
                id_microarea={node.id_microarea}
                nome_microarea={node.nome_microarea}
                currentLesson={node.currentLesson}
                id_lesson={node.id}
                nivel_associado={node.nivel_associado}
              />
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}
