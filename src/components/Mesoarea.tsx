import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { Colors, Fonts, Spacing } from "../themes";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";

interface MesoareaProps {
  nome: string;
  friendly_name: string;
  nivel: number;
  onPress?: () => void;
  description?: string;
}

const normalize = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const getAreaIcon = (
  nome: string
): { name: string; library: "Ionicons" | "MaterialCommunityIcons" } => {
  const normalized = normalize(nome);

  //Biologia
  switch (normalized) {
    case "bioquimica":
      return { name: "flask-outline", library: "Ionicons" };
    case "citologia":
      return { name: "beaker-outline", library: "MaterialCommunityIcons" };
    case "genetica":
      return { name: "dna", library: "MaterialCommunityIcons" };
    case "evolucao":
      return { name: "skull", library: "MaterialCommunityIcons" };
    case "microbiologia":
      return { name: "bacteria-outline", library: "MaterialCommunityIcons" };
    case "botanica":
      return { name: "leaf-outline", library: "Ionicons" };
    case "embriologia_e_zoologia":
      return { name: "cow", library: "MaterialCommunityIcons" };
    case "histologia_e_fisiologia_humana":
      return { name: "microscope", library: "MaterialCommunityIcons" };
    case "fisiologia_humana":
      return { name: "heart-pulse", library: "MaterialCommunityIcons" };
  }

  // História
  switch (normalized) {
    case "historia_do_brasil":
      return { name: "flag-variant", library: "MaterialCommunityIcons" };
    case "historia_geral":
      return { name: "book-open-page-variant", library: "MaterialCommunityIcons" };
    case "historia_da_america":
      return { name: "earth", library: "MaterialCommunityIcons" };
    case "cidadania_e_direitos":
      return { name: "scale-balance", library: "MaterialCommunityIcons" };

  }

  // Geografia
  switch (normalized) {
    case "geografia_fisica":
      return { name: "terrain", library: "MaterialCommunityIcons" };
    case "geografia_humana":
      return { name: "account-group", library: "MaterialCommunityIcons" };
    case "geografia_politica":
      return { name: "earth", library: "MaterialCommunityIcons" };
    case "geografia_do_brasil":
      return { name: "map-marker", library: "MaterialCommunityIcons" };
    case "meio_ambiente_e_sustentab":
      return { name: "leaf", library: "MaterialCommunityIcons" };
    case "cartografia_e_tecnologia":
      return { name: "map", library: "MaterialCommunityIcons" };
  
  }
  // Macroáreas gerais
  switch (normalized) {
    case "biologia":
      return { name: "leaf-outline", library: "Ionicons" };
    case "quimica":
      return { name: "flask-outline", library: "Ionicons" };
    case "fisica":
      return { name: "planet-outline", library: "Ionicons" };
    case "matematica":
      return { name: "calculator-outline", library: "Ionicons" };
    case "portugues":
      return { name: "document-text-outline", library: "Ionicons" };
    case "historia":
      return { name: "hourglass-outline", library: "Ionicons" };
    case "geografia":
      return { name: "earth-outline", library: "Ionicons" };
    case "filosofia":
      return { name: "library-outline", library: "Ionicons" };
    case "sociologia":
      return { name: "people-outline", library: "Ionicons" };
    case "ingles":
      return { name: "chatbubble-ellipses-outline", library: "Ionicons" };
    default:
      return { name: "list-outline", library: "Ionicons" };
  }
};

const Mesoarea: React.FC<MesoareaProps> = ({
  nome,
  friendly_name,
  nivel,
  onPress,
  description,
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const iconInfo = getAreaIcon(nome);  
  
  return (
    <View>
      <TouchableOpacity style={[styles.container]} onPress={onPress}>
        <View style={[styles.mainContainer]}>
          <View style={[styles.iconButton]}>
            {iconInfo.library === "Ionicons" ? (
              <Ionicons name={iconInfo.name as any} size={24} />
            ) : (
              <MaterialCommunityIcons name={iconInfo.name as any} size={24} />
            )}
          </View>

          <View style={[styles.innerContainer]}>
            <View style={[styles.titleContainer]}>
              <Text style={styles.titleText}>{friendly_name}</Text>
              {description && (
                <TouchableOpacity
                  onPress={() => setShowDescription(!showDescription)}
                >
                  <Ionicons
                    name={
                      showDescription
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    size={24}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Barra de progresso */}
            <View style={[styles.progressBar]}>
              <Text>{Math.floor(nivel)}</Text>
              <View style={[styles.innerProgressBar]}>
                <Progress.Bar
                  progress={nivel - Math.floor(nivel)}
                  height={6}
                  width={null}
                  color={Colors.primary}
                />
              </View>
              <Text>{Math.floor(nivel) + 1}</Text>
            </View>
          </View>
        </View>

        {showDescription && <Text>{description}</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default Mesoarea;

const styles = StyleSheet.create({
  container: {
    width: "95%",
    marginVertical: Spacing.small,
    margin: Spacing.small,
    justifyContent: "flex-start",
    flexDirection: "column",
    backgroundColor: Colors.background.medium,
    padding: Spacing.small,
    borderRadius: Spacing.boderRadius,
  },
  mainContainer: {
    flexDirection: "row",
  },
  titleText:{
    width: "80%"
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  innerProgressBar: {
    width: "80%",
  },
  progressBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  innerContainer: {
    marginVertical: Spacing.small,
    margin: Spacing.small,
    flexDirection: "column",
    justifyContent: "space-around",
    alignSelf: "center",
    width: "75%",
  },
  iconButton: {
    marginVertical: Spacing.small,
    backgroundColor: Colors.pink.ligth,
    padding: Spacing.small,
    borderRadius: Spacing.boderRadius,
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
    modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: Colors.background.ligth,
    padding: Spacing.xlarge,
    borderRadius: Spacing.boderRadius,
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  modalCloseButton: {
    position: "absolute",
    top: Spacing.small,
    left: Spacing.medium,
    zIndex: 1,
  },
  modalCloseIcon: {
    fontSize: 28,
    color: Colors.text,
    fontFamily: Fonts.bold,
  },
    scrollView: {
    maxHeight: "70%",
    width: "100%",
  },
});
