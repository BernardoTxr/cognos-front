// --- Jogo do Wisconsin (padrão Reflexo) ---
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import Svg, { Polygon, Circle, Path, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../themes';
import { registerPartidaJogoWisconsin } from '../../../services/partida';

// --- CONSTANTES DE ESTADO DO JOGO ---
const STATUS = {
  INSTRUCTIONS: 'instructions',
  PLAYING: 'playing',
  RESULT: 'result',
};

// --- CONFIGURAÇÕES DO JOGO ---
const STIMULUS_CARDS = [
  { id: 's1', color: 'R', shape: 'T', number: 1 },
  { id: 's2', color: 'G', shape: 'S', number: 2 },
  { id: 's3', color: 'Y', shape: 'C', number: 3 },
  { id: 's4', color: 'B', shape: 'O', number: 4 },
];

const RULES_SEQUENCE = ['color', 'shape', 'number'];
const DECK_SIZE = 64;
const CORRECT_TO_ADVANCE = 10;

// --- MAPAS VISUAIS ---
const COLOR_MAP = {
  R: '#EF4444',
  G: '#22C55E',
  Y: '#EAB308',
  B: '#3B82F6',
};

// --- FUNÇÕES AUXILIARES ---
const createDeck = () => {
  let deck = [];
  const colors = ['R', 'G', 'Y', 'B'];
  const shapes = ['T', 'S', 'C', 'O'];
  const numbers = [1, 2, 3, 4];

  for (const color of colors) {
    for (const shape of shapes) {
      for (const number of numbers) {
        deck.push({ color, shape, number });
      }
    }
  }

  // Embaralha o baralho
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

// --- FORMAS GEOMÉTRICAS ---
const ShapeIcon = ({ shape, color, size = 32 }) => {
  switch (shape) {
    case 'T':
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Polygon points="50,10 10,90 90,90" fill={color} />
        </Svg>
      );
    case 'S':
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path
            d="M50 5 L61 38 H95 L67 58 L78 91 L50 72 L22 91 L33 58 L5 38 H39 Z"
            fill={color}
          />
        </Svg>
      );
    case 'C':
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Rect x="40" y="10" width="20" height="80" fill={color} />
          <Rect x="10" y="40" width="80" height="20" fill={color} />
        </Svg>
      );
    case 'O':
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Circle cx="50" cy="50" r="40" fill={color} />
        </Svg>
      );
    default:
      return null;
  }
};

// --- COMPONENTE DE CARTA ---
const Card = ({ card, onPress }) => {
  const { color, shape, number } = card;
  const fillColor = COLOR_MAP[color];

  return (
    <TouchableOpacity
      style={[styles.card, !onPress && styles.disabledCard]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.shapeContainer}>
        {Array(number)
          .fill(0)
          .map((_, i) => (
            <ShapeIcon key={i} shape={shape} color={fillColor} size={30} />
          ))}
      </View>
    </TouchableOpacity>
  );
};

// --- COMPONENTE PRINCIPAL ---
const JogoDoWisconsinScreen = ({ navigation }) => {
  const [status, setStatus] = useState(STATUS.INSTRUCTIONS);
  const [deck, setDeck] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
  const [previousRule, setPreviousRule] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const feedbackTimerRef = useRef(null);
  const [correctInARow, setCorrectInARow] = useState(0);
  const [stats, setStats] = useState({});

  // --- INICIALIZAÇÃO ---
  const initializeGame = () => {
    setStats({
      totalPlays: 0,
      totalCorrect: 0,
      totalErrors: 0,
      perseverativeErrors: 0,
      nonPerseverativeErrors: 0,
      failureToMaintainSet: 0,
      categoriesCompleted: 0,
    });
    setDeck(createDeck());
    setCurrentCardIndex(0);
    setCurrentRuleIndex(0);
    setPreviousRule(null);
    setCorrectInARow(0);
    setFeedback(null);
    setStatus(STATUS.PLAYING);
  };

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  // --- LÓGICA DE COMBINAÇÃO ---
  const handleCardMatch = async (selectedStimulusCard) => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);

    const responseCard = deck[currentCardIndex];
    const currentRule = RULES_SEQUENCE[currentRuleIndex];

    let isCorrect = responseCard[currentRule] === selectedStimulusCard[currentRule];
    let newStats = { ...stats };
    let newCorrectInARow = correctInARow;
    let newRuleIndex = currentRuleIndex;
    let newPreviousRule = previousRule;

    newStats.totalPlays++;

    if (isCorrect) {
      setFeedback("Certo!");
      newStats.totalCorrect++;
      newCorrectInARow++;

      if (newCorrectInARow >= CORRECT_TO_ADVANCE) {
        newStats.categoriesCompleted++;
        newCorrectInARow = 0;
        newPreviousRule = currentRule;
        newRuleIndex = (currentRuleIndex + 1) % RULES_SEQUENCE.length;
      }
    } else {
      setFeedback("Errado!");
      newStats.totalErrors++;

      if (correctInARow > 0 && correctInARow < CORRECT_TO_ADVANCE) {
        newStats.failureToMaintainSet++;
      }

      newCorrectInARow = 0;

      if (
        newPreviousRule &&
        newPreviousRule !== currentRule &&
        responseCard[newPreviousRule] === selectedStimulusCard[newPreviousRule]
      ) {
        newStats.perseverativeErrors++;
      } else {
        newStats.nonPerseverativeErrors++;
      }
    }

    setStats(newStats);
    setCorrectInARow(newCorrectInARow);
    setCurrentRuleIndex(newRuleIndex);
    setPreviousRule(newPreviousRule);

    const nextCardIndex = currentCardIndex + 1;
    if (nextCardIndex >= DECK_SIZE || newStats.categoriesCompleted >= RULES_SEQUENCE.length * 2) {
      await registerPartidaJogoWisconsin({
        acertos: newStats.totalCorrect,
        erros_perseverativos: newStats.perseverativeErrors,
        erros_nonperseverativos: newStats.nonPerseverativeErrors,
        falha_manter_conjunto: newStats.failureToMaintainSet,
        categorias_completas: newStats.categoriesCompleted,
      });
      setStatus(STATUS.RESULT);
    } else {
      setCurrentCardIndex(nextCardIndex);
      feedbackTimerRef.current = setTimeout(() => setFeedback(null), 1000);
    }
  };

  // --- TELAS ---
  const renderInstructions = () => (
    <View style={styles.contentContainer}>
      <Ionicons name="layers-outline" size={80} color={Colors.primary} />
      <Text style={styles.instructionTitle}>Jogo de Wisconsin</Text>
      <Text style={styles.instructionText}>1. Combine a carta de baixo com uma das quatro cartas de cima.</Text>
      <Text style={styles.instructionText}>2. Você será informado apenas se está "Certo" ou "Errado".</Text>
      <Text style={styles.instructionText}>3. A regra (cor, forma ou número) mudará sem aviso.</Text>
      <TouchableOpacity 
        style={styles.startButton} 
        onPress={initializeGame}
      >
        <Text style={styles.startButtonText}>Iniciar Partida</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGameArea = () => {
    if (!deck.length || currentCardIndex >= deck.length) return null;
    const currentResponseCard = deck[currentCardIndex];

    return (
      <View style={styles.gameContainer}>
        <View style={styles.feedbackContainer}>
          {feedback && (
            <Text
              style={[
                styles.feedbackText,
                { color: feedback === "Certo!" ? Colors.colors.green : Colors.colors.red },
              ]}
            >
              {feedback}
            </Text>
          )}
        </View>

        <View style={styles.stimulusContainer}>
          {STIMULUS_CARDS.map((card) => (
            <Card key={card.id} card={card} onPress={() => handleCardMatch(card)} />
          ))}
        </View>

        <View style={styles.responseContainer}>
          <Text style={styles.instructionText}>
            Carta {currentCardIndex + 1} de {DECK_SIZE}
          </Text>
          <Card card={currentResponseCard} />
        </View>
      </View>
    );
  };

  const renderResults = () => (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text style={styles.resultLabel}>Fim de Jogo!</Text>
      <Text style={styles.instructionText}>Estatísticas Finais:</Text>

      <View style={styles.resultBox}>
          <Text style={styles.instructionText}>
            Acertos: {stats.totalCorrect}
          </Text>
          <Text style={styles.instructionText}>
            Total de Jogadas: {stats.totalPlays}
          </Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: Colors.background.dark }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="exit-outline" size={20} color={Colors.background.dark} />
          <Text style={styles.actionButtonText}>Sair</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={initializeGame}
        >
          <Ionicons name="refresh-outline" size={20} color={Colors.background.dark} />
          <Text style={styles.actionButtonText}>Nova Partida</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // --- RENDER PRINCIPAL ---
  if (status === STATUS.PLAYING) return renderGameArea();
  if (status === STATUS.RESULT) return renderResults();
  return renderInstructions();
};

// --- ESTILOS (mesmo padrão do Reflexo) ---
const styles = StyleSheet.create({
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
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 16,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: 8,
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
  gameContainer: {
    flex: 1,
    backgroundColor: Colors.background.dark,
    padding: 16,
    justifyContent: 'center',
  },
  feedbackContainer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  stimulusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 16,
  },
  responseContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.muted,
    paddingTop: 16,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '45%',
  },
  disabledCard: { opacity: 0.6 },
  shapeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  resultLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  resultBox: {
    backgroundColor: '#1F2937',
    borderRadius: 10,
    padding: 16,
    width: '100%',
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
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
});

export default JogoDoWisconsinScreen;
