import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../themes";
// --- 1. DADOS E LÓGICA DE CARTAS ---

// Adicione os estados do jogo (similar ao Jogo do Reflexo)
const STATUS = {
  INSTRUCTIONS: 'instructions',
  PLAYING: 'playing',
  RESULT: 'result',
};

// Formata o tempo de milissegundos para MM:SS
const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  const pad = (num: number) => num.toString().padStart(2, '0');
  
  return `${pad(minutes)}:${pad(seconds)}`;
};

interface CardData {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface CardProps {
  card: CardData;
  onPress: (card: CardData) => void;
}

// Conjunto de ícones para os pares. (3x4 = 12 cartas / 6 pares)
const ICON_SET = [
  'star', 'heart', 'cloud', 'sunny', 'bug', 'rocket',
];

// Função para embaralhar e duplicar as cartas
const initializeCards = () => {
  // Duplica os ícones para criar pares
  let cards = ICON_SET.flatMap((icon, index) => [
    { id: index * 2, icon, isFlipped: false, isMatched: false },
    { id: index * 2 + 1, icon, isFlipped: false, isMatched: false },
  ]);

  // Embaralha usando o algoritmo de Fisher-Yates
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
};

// --- 2. COMPONENTE INDIVIDUAL DE CARD ---

const Card = React.memo(({ card, onPress }: CardProps) => ( // 🚨 Tipagem aplicada
  <TouchableOpacity
    style={styles.cardContainer}
    onPress={() => onPress(card)}
    disabled={card.isFlipped || card.isMatched}
  >
    <View style={[styles.card, card.isFlipped || card.isMatched ? styles.cardFlipped : styles.cardBack]}>
      {(card.isFlipped || card.isMatched) ? (
        <Ionicons name={card.icon as any} size={40} color={card.isMatched ? Colors.colors.green : Colors.primary} />
      ) : (
        <Ionicons name="help-circle-outline" size={40} color={Colors.text} />
      )}
    </View>
  </TouchableOpacity>
));


// --- 3. COMPONENTE PRINCIPAL DO JOGO DA MEMÓRIA ---

const JogoDaMemoriaScreen = ({ navigation }) => {
  const [status, setStatus] = useState(STATUS.INSTRUCTIONS);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [cards, setCards] = useState(initializeCards);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchesFound, setMatchesFound] = useState(0);
  const [canFlip, setCanFlip] = useState(true);
  const totalPairs = ICON_SET.length;

  // temporizador
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (status === STATUS.PLAYING && startTime !== null) {
      timer = setInterval(() => {
        setTimeElapsed(performance.now() - startTime);
      }, 1000); // Atualiza o contador a cada segundo
    } else if (timer) {
      clearInterval(timer);
    }

    // Limpa o intervalo quando o componente desmonta ou o status muda
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status, startTime]);

  // Lógica principal: Verifica se as duas cartas viradas são um par
  useEffect(() => {
    if (flippedCards.length === 2) {
      setCanFlip(false); // Bloqueia novos cliques
      const [card1, card2] = flippedCards;

      if (card1.icon === card2.icon) {
        // PAR ENCONTRADO
        setCards(prevCards =>
          prevCards.map(c =>
            c.id === card1.id || c.id === card2.id
              ? { ...c, isMatched: true }
              : c
          )
        );
        setMatchesFound(prev => prev + 1);
        setFlippedCards([]);
        setCanFlip(true);
      } else {
        // PAR NÃO ENCONTRADO
        const timeout = setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === card1.id || c.id === card2.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
          setCanFlip(true);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [flippedCards]);

  // Lógica de FIM DE JOGO (Vitoria)
  useEffect(() => {
    if (matchesFound === totalPairs && status === STATUS.PLAYING) {
      setStatus(STATUS.RESULT); // Muda para o estado de resultado
      // O useEffect do timer será limpo automaticamente
    }
  }, [matchesFound, totalPairs, status]);


  // Lógica de clique no Card
  const handleCardPress = useCallback((card: CardData) => {
    if (!canFlip || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    // 🚨 REGISTRA O CLIQUE
    setClickCount(prev => prev + 1); 

    // 🚨 SE FOR O PRIMEIRO CLIQUE E O JOGO COMEÇAR AQUI, INICIA O TIMER
    if (startTime === null) {
        setStartTime(performance.now());
    }

    // Vira a carta
    setCards(prevCards =>
      prevCards.map(c =>
        c.id === card.id ? { ...c, isFlipped: true } : c
      )
    );

    // Adiciona a carta virada à lista
    setFlippedCards(prev => [...prev, card]);
  }, [canFlip, flippedCards, startTime]);


  // Reseta todos os estados para iniciar um novo jogo
  const restartGame = () => {
    setCards(initializeCards());
    setFlippedCards([]);
    setMatchesFound(0);
    setCanFlip(true);
    setClickCount(0);
    setTimeElapsed(0);
    setStartTime(null);
    setStatus(STATUS.PLAYING); // Inicia o jogo diretamente
  };
  
  const startPlaying = () => {
      setStatus(STATUS.PLAYING);
      setStartTime(null); // O timer será iniciado no primeiro clique
  };

  const renderInstructions = () => (
    <View style={styles.contentContainer}>
      <Ionicons name="grid-outline" size={80} color={Colors.primary} />
      <Text style={styles.instructionTitle}>Jogo da Memória</Text>
      <Text style={styles.instructionText}>
        Avalia Memória de Trabalho e Atenção Sustentada.
      </Text>
      <Text style={styles.instructionText}>
        Você deve virar as cartas para encontrar todos os {totalPairs} pares idênticos no menor tempo possível e com o mínimo de cliques.
      </Text>
      <TouchableOpacity 
        style={styles.startButton} 
        onPress={startPlaying}
      >
        <Text style={styles.startButtonText}>Iniciar Partida</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderResults = () => (
    <View style={styles.contentContainer}>
        <Ionicons name="trophy-outline" size={80} color={Colors.colors.green} />
        <Text style={styles.resultTitle}>Partida Concluída!</Text>
        
        <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Tempo Total:</Text>
            <Text style={styles.resultValue}>{formatTime(timeElapsed)}</Text>
        </View>

        <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Total de Cliques:</Text>
            <Text style={styles.resultValue}>{clickCount}</Text>
        </View>
      
        <View style={styles.buttonGroup}>
            <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: Colors.background.ligth }]}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="exit-outline" size={20} color={Colors.text} />
                <Text style={[styles.actionButtonText, { color: Colors.text }]}>Sair</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.actionButton}
                onPress={restartGame}
            >
                <Ionicons name="refresh-outline" size={20} color={Colors.background.dark} />
                <Text style={styles.actionButtonText}>Nova Partida</Text>
            </TouchableOpacity>
        </View>
    </View>
  );

  const renderGame = () => (
      <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.infoPill}>
                <Ionicons name="time-outline" size={16} color={Colors.primary} />
                <Text style={styles.infoText}>Tempo: {formatTime(timeElapsed)}</Text>
            </View>
            <View style={styles.infoPill}>
                <Ionicons name="radio-button-off-outline" size={16} color={Colors.primary} />
                <Text style={styles.infoText}>Cliques: {clickCount}</Text>
            </View>
            <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
                <Ionicons name="refresh-outline" size={24} color={Colors.background.dark} />
            </TouchableOpacity>
        </View>

        <FlatList
            data={cards}
            renderItem={({ item }: { item: CardData }) => <Card card={item} onPress={handleCardPress} />}
            keyExtractor={item => item.id.toString()}
            numColumns={4}
            contentContainerStyle={styles.grid}
            scrollEnabled={false}
        />
        
        <TouchableOpacity 
            style={styles.exitButton}
            onPress={() => navigation.goBack()} 
        >
            <Ionicons name="exit-outline" size={20} color={Colors.text} />
            <Text style={styles.exitButtonText}>Sair do Jogo</Text>
        </TouchableOpacity>
    </View>
  );


  // --- Renderiza o componente com base no status atual ---
  if (status === STATUS.INSTRUCTIONS) {
    return renderInstructions();
  }
  
  if (status === STATUS.RESULT) {
      return renderResults();
  }

  return renderGame();
};

// ... Mantenha o componente Card e as funções initializeCards e ICON_SET


// --- ESTILOS ADICIONAIS/MODIFICADOS ---

const styles = StyleSheet.create({
  // ... (manter estilos anteriores para container, grid, card, etc.)
  
  // --- INSTRUÇÕES E RESULTADO ---
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.dark,
  },
  instructionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.muted,
    textAlign: 'center',
    marginVertical: 4,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 30,
  },
  startButtonText: {
    color: Colors.background.dark,
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginVertical: 20,
  },
  resultBox: {
    backgroundColor: Colors.background.ligth,
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    color: Colors.muted,
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 30,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 150,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: Colors.background.dark,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // --- HEADER DO JOGO (Timer e Cliques) ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: Colors.background.dark, // Fundo escuro
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.ligth,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.muted,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 5,
  },
  restartButton: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 8,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  grid: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  cardContainer: {
    width: '25%', // 100% / 4 colunas
    aspectRatio: 1, // Quadrado
    padding: 5,
  },
  card: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  cardBack: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  cardFlipped: {
    backgroundColor: Colors.background.ligth,
    borderColor: Colors.muted,
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: Colors.background.ligth,
    borderWidth: 1,
    borderColor: Colors.muted,
  },
  exitButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  }
  // ... (outros estilos de card)
});

export default JogoDaMemoriaScreen;