// LessonIcon.tsx
import React, { useState, useMemo } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Modal,
  Text,
  Image,
} from "react-native";
import { Colors, Fonts, Spacing } from "../../themes";
import { TypeLesson } from "../../types/lessons";
import CustomButton from "../../components/Button";
import { Ionicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

import type { StackNavigationProp } from "@react-navigation/stack";
import type { HomeStackParams } from "../../navegation/HomeStack";

import LicaoLocked from "../../assets/images/licao_locked.png";
import LicaoUnlocked from "../../assets/images/licao_unlocked.png";
import LicaoCurrent from "../../assets/images/licao_current.png";
import SimuladoLocked from "../../assets/images/simulado_locked.png";
import SimuladoUnlocked from "../../assets/images/simulado_unlocked.png";
import SimuladoCurrent from "../../assets/images/simulado_current.png";

type TrilhaProp = StackNavigationProp<HomeStackParams, "Trilha">;

interface LessonIconProps {
  isLeft: boolean;
  type: TypeLesson;
  foiFeito: boolean;
  y: number;
  branchX: number;
  id_microarea: number;
  nome_microarea: string;
  currentLesson: boolean;
  id_lesson: number;
  nivel_associado: number;
}

export const LessonIcon: React.FC<LessonIconProps> = ({
  isLeft,
  type,
  foiFeito,
  y,
  branchX,
  id_microarea,
  nome_microarea,
  currentLesson,
  id_lesson,
  nivel_associado,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalLockedVisible, setIsModalLockedVisible] = useState(false);
  const navigation = useNavigation<TrilhaProp>();

  const positionStyle = {
    position: "absolute" as const,
    left: isLeft ? branchX - 48 : branchX + 48,
    bottom: y - 90,
  };

  const handleNavigate = () => {
    setIsModalVisible(false);
    navigation.navigate("Lesson", { microareaId: id_microarea, atividadeId: id_lesson, nivel_associado: nivel_associado, atividadeType: type});
  };

  const handleModal = () => {
    if (foiFeito || currentLesson) setIsModalVisible(true)
      else setIsModalLockedVisible(true)
  }

  const iconSource = useMemo(() => {
    if (foiFeito) {
      return type === "simulado" ? SimuladoUnlocked : LicaoUnlocked;
    }
    if (currentLesson) {
      return type === "simulado" ? SimuladoCurrent : LicaoCurrent;
    }
    return type === "simulado" ? SimuladoLocked : LicaoLocked;
  }, [foiFeito, currentLesson, type]);

  const iconSize = currentLesson ? { width: 85, height: 72 } : { width: 72, height: 59 };

  return (
    <>
      <TouchableOpacity
        onPress={handleModal}
        style={positionStyle}
      >
        <Image source={iconSource} style={[iconSize]} resizeMode="contain" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.text}>{nome_microarea}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Ionicons name="chevron-back-outline" size={24} />
            </TouchableOpacity>

            <CustomButton title="INICIAR LIÇÃO" onPress={handleNavigate} />
          </View>
        </View>
      </Modal>

      <Modal
        visible={isModalLockedVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalLockedVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainerLocked}>
            <Text style={styles.text}>{nome_microarea}</Text>
            <Text style={styles.textLockedDesc}>Complete as lições anteriores para desbloquear esta!</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsModalLockedVisible(false)}
            >
              <Ionicons name="chevron-back-outline" size={24} />
            </TouchableOpacity>

            <CustomButton disabled={true} title="BLOQUEADA" style={styles.buttonStyles} textStyle={styles.textLocked}/>
          </View>
        </View>
      </Modal>
      
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: Spacing.boderRadius,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    margin: Spacing.small,
  },
  text: {
    fontFamily: Fonts.medium,
    fontSize: Fonts.size.medium,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
    modalContainerLocked: {
    backgroundColor: Colors.background.medium,
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  buttonStyles:{
    borderColor: Colors.mutedPlus,
  }, textLocked:{
    color: Colors.mutedPlus,
  }, textLockedDesc: {
    fontFamily: Fonts.light,
    fontSize: Fonts.size.medium,
    textAlign: "center",
    margin: Spacing.small,
    color: Colors.mutedPlus,
    }
});
