import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Modal,
  ScrollView
} from "react-native";
import { Colors, Fonts, Spacing} from "../themes";
import { Ionicons } from '@expo/vector-icons'; 
import CustomTitle from "./Title";
import Mesoarea from "./Mesoarea";
import { useTrilha } from "../context/TrilhaContext";
import { AreaInterface } from "../types/lessons";
import { getMesoareaByMacroarea, getMacroareas } from "../services/areas"
import { useQueryClient } from "@tanstack/react-query";
import { useNivelMesoareas } from "../hooks/useNivelMesoareas";

interface MudarTrilhaProps {
  macroarea: string;
  mesoarea: string;
  setSelectedTrilha: (trilha: any) => void;
  setSelectedMacro: (macro: any) => void;
}

const MudarTrilha: React.FC<MudarTrilhaProps> = ({
  macroarea,
  mesoarea,
  setSelectedTrilha,
  setSelectedMacro,
}) => {

    const [isModalMacroVisible, setIsModalMacroVisible] = useState(false);
    const [isModalMesoVisible, setIsModalMesoVisible] = useState(false)
    const [macros, setMacros] = useState([]);

    const [selectedMacroModel, setselectedMacroModel] = useState<AreaInterface>({id: null, nome: null, friendly_name: null});

    const queryClient = useQueryClient();

    // get nivel mesoareas from react query
    const { nivelMesoareaMap, nivelMacroareaMap } = useNivelMesoareas();
    
    const handleMacroPress = async (macroName: AreaInterface) => {
      setselectedMacroModel(macroName);
      await fetchMesos(macroName);
      setIsModalMacroVisible(false);
      setIsModalMesoVisible(true);
    };

    const [mesos, setMesos] = useState([]);
  
  
    const fetchMesos = async (macroName: AreaInterface) => {
        try {
        const response = await getMesoareaByMacroarea(macroName.nome)
        setMesos(response.data);
        } catch (error) {
        console.error("Erro ao buscar mesoáreas:", error);
        }
    };
  
    useEffect(() => {
    const fetchMacros = async () => {
      try {
        const response = await getMacroareas();
        setMacros(response.data);
      } catch (error) {
        console.error("Erro ao buscar macroáreas:", error);
      }
    };

    fetchMacros();
  }, []);

    return (
        <View style={[styles.whole]}>
            <TouchableOpacity style={[styles.container]}>
                <View style={[styles.innerContainer]}>
                    <Text style={[styles.textTitle]}>{mesoarea}</Text>
                    <Text style={[styles.textSubtitle]}>{macroarea}</Text>
                </View>
                <TouchableOpacity style={[styles.iconButton]} onPress={() => setIsModalMacroVisible(true)}>
                    <Ionicons name="list-outline" size={24}></Ionicons>
                </TouchableOpacity>
            </TouchableOpacity>

            <Modal
                visible={isModalMacroVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsModalMacroVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <CustomTitle title="Selecione uma Matéria" subtitle="Escolha uma macroárea para continuar"/>
                        <ScrollView style={styles.scrollView} horizontal={false} showsHorizontalScrollIndicator={false}>
                        {macros.map((item) => (
                            <Mesoarea
                                key={item.id}
                                nome={item.nome}
                                friendly_name={item.friendly_name}
                                nivel={nivelMacroareaMap[item.id] ?? 0}
                                onPress={() => handleMacroPress(item)}
                            />
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                          style={styles.modalCloseButton}
                          onPress={() => setIsModalMacroVisible(false)}
                        >
                          <Ionicons name="chevron-back-outline" size={24}></Ionicons>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={isModalMesoVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsModalMesoVisible(false)}
                >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                    <CustomTitle title="Escolha uma trilha" subtitle={`Macroárea: ${selectedMacroModel.friendly_name}`} />
                    <ScrollView style={styles.scrollView}>
                        {mesos.map((item) => (
                        <Mesoarea
                            key={item.id}
                            nome={item.nome}
                            friendly_name={item.friendly_name}
                            nivel={nivelMesoareaMap[item.id] ?? 0}
                            description={item.descricao}
                            onPress={() => {setSelectedTrilha({ id: item.id, nome: item.nome, friendly_name: item.friendly_name }); setSelectedMacro({ id: selectedMacroModel.id, nome: selectedMacroModel.nome, friendly_name: selectedMacroModel.friendly_name }); setIsModalMesoVisible(false)}}
                        />
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={() => {setIsModalMesoVisible(false); setIsModalMacroVisible(true)}}
                    >
                        <Ionicons name="chevron-back-outline" size={24} />
                    </TouchableOpacity>
                    </View>
                </View>
                </Modal>
        </View>
    );
};

export default MudarTrilha;

const styles = StyleSheet.create({
  whole: {
    position: 'absolute',
    top: Spacing.xlarge * 2,
    left: Spacing.small,
  },
  container: {
    width: "90%",
    marginVertical: Spacing.xlarge,
    margin: Spacing.small,
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: Colors.background.medium,
    padding: Spacing.small,
    borderRadius: Spacing.boderRadius,
    zIndex: 10,
  },
  innerContainer: {
    marginVertical: Spacing.small,
    margin: Spacing.small,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  scrollView: {
    maxHeight: "70%",
    width: "100%",
  },
  iconButton: {
    marginVertical: Spacing.small,
    margin: Spacing.small,
    backgroundColor: Colors.pink.ligth,
    padding: Spacing.small,
    borderRadius: Spacing.boderRadius,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: Colors.background.ligth,
    padding: Spacing.small,
    borderRadius: Spacing.boderRadius,
    width: "85%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  modalCloseButton: {
    position: "absolute",
    top: Spacing.large,
    left: Spacing.large,
    zIndex: 1,
  },
  modalCloseIcon: {
    fontSize: 28,
    color: Colors.text,
    fontFamily: Fonts.bold,
  },
  textTitle:{
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.bold,
  },
  textSubtitle:{
    fontSize: Fonts.size.small,
    fontFamily: Fonts.regular,
  }
})