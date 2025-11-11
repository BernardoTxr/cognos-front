import React from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors} from "../../../themes";
import { JogoCard } from "../../../components/JogoCard";

// Dados dos Jogos (Seus 4 jogos com as avaliações)
const JOGOS_DATA = [
  {
    id: '5',
    title: 'Math Cognos',
    description: 'Resolva operações matemáticas o mais rápido possível usando blocos.',
    tests: 'Coordenação Motora, Agilidade Mental, Cálculo Mental',
    iconName: 'calculator-outline',
    route: 'JogoDaMatematica',
  },
  {
    id: '1',
    title: 'Jogo da Memória',
    description: 'Encontre os pares de cartas idênticas. Um clássico para trabalhar o resgate de informações.',
    tests: 'Memória de Trabalho, Atenção Sustentada',
    iconName: 'grid-outline',
    route: 'JogoDaMemoria',
  },
  {
    id: '2',
    title: 'Encontre o Copo',
    description: 'Siga a bola escondida enquanto os copos se movem rapidamente. Testa a percepção e o foco visual.',
    tests: 'Atenção Seletiva, Percepção Visual, Rastreio',
    iconName: 'repeat-outline',
    route: 'EncontreOCopo',
  },
  {
    id: '3',
    title: 'Wisconsin Card Game',
    description: 'Classifique as cartas mudando o critério (cor, forma ou número). Avalia a capacidade de se adaptar a novas regras.',
    tests: 'Funções Executivas, Flexibilidade Cognitiva, Raciocínio Abstrato',
    iconName: 'card-outline',
    route: 'WisconsinCardGame',
  },
  {
    id: '4',
    title: 'Jogo do Reflexo',
    description: 'Pressione o botão o mais rápido possível assim que ele mudar de cor. Mede o seu tempo de reação.',
    tests: 'Tempo de Reação (Reflexo), Velocidade de Processamento',
    iconName: 'watch-outline',
    route: 'JogoDoReflexo',
  },
];

export default function JogoScreen({ navigation }) {
  // Função que será chamada ao pressionar o botão Jogar
  const handlePlay = (gameRoute) => {
    navigation.navigate(gameRoute); // Isso fará a navegação
  };

  const renderItem = ({ item }) => (
    <JogoCard
      title={item.title}
      description={item.description}
      tests={item.tests}
      iconName={item.iconName as any}
      onPlay={() => handlePlay(item.route)}
    />
  );

  return (
    <View style={appStyles.container}>
      <Text style={appStyles.headerText}>Biblioteca de Jogos Cognos</Text>
      
      <FlatList
        data={JOGOS_DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={appStyles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// Estilos para a página
const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark, // Fundo escuro para destacar os cards
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  listContent: {
    paddingBottom: 20, // Espaço extra no final da lista
  },
});
