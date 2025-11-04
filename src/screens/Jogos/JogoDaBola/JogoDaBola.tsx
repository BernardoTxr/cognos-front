import React, { useState, useEffect, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { Colors, Fonts, Spacing } from "../../../themes";
import { Ionicons } from "@expo/vector-icons";

// --- CONSTANTES ---
const NUM_CUPS = 5;
const TOTAL_ROUNDS = 5;
const SHUFFLE_SWAPS = 5;
const SWAP_INTERVAL_MS = 600;
const REVEAL_DURATION_MS = 1000; // Duração para mostrar a bola no início

const STATUS = {
  INSTRUCTIONS: "INSTRUÇÕES",
  REVEAL_BALL: "REVELAR_BOLA", // Novo status para mostrar a bola inicial
  PLAYING: "JOGANDO", // Este status pode ser usado para agrupar SHUFFLING/GUESSING
  SHUFFLING: "EMBARALHANDO",
  GUESSING: "ADIVINHANDO",
  RESULT: "RESULTADO",
};

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  const pad = (num: number) => num.toString().padStart(2, '0');
  
  return `${pad(minutes)}:${pad(seconds)}`;
};

// --- INICIALIZAÇÃO DOS COPOS ---
const initializeCups = () => {
  const initialCups = Array.from({ length: NUM_CUPS }, (_, id) => ({
    id: id + 1,
    hasBall: false,
    positionIndex: id,
    isGuessed: false,
  }));
  const ballIndex = Math.floor(Math.random() * NUM_CUPS);
  initialCups[ballIndex].hasBall = true;
  return initialCups;
};

// --- COMPONENTE DE UM COPO ---
const Cup = memo(({ cup, status, onPress }) => {
  const translateY = useState(new Animated.Value(0))[0];
  const translateX = useState(new Animated.Value(cup.positionIndex * 70))[0];

  // Efeito para a animação de POSIÇÃO (Horizontal - Troca)
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: cup.positionIndex * 70,
      duration: SWAP_INTERVAL_MS,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [cup.positionIndex, translateX]);

  // Efeito para a animação de LEVANTAR/ABAIXAR (Vertical)
  useEffect(() => {
    let toValue = 0;
    let delay = 0;

    // Condição para levantar:
    // 1. No status REVEAL_BALL, se o copo tem a bola.
    // 2. No status RESULT, se o copo tem a bola OU foi o copo escolhido.
    const shouldLift =
      (status === STATUS.REVEAL_BALL && cup.hasBall) ||
      (status === STATUS.RESULT && (cup.hasBall || cup.isGuessed));

    if (shouldLift) {
      toValue = -40; // Levanta um pouco mais para a bola ficar mais visível
      delay = status === STATUS.RESULT ? 200 : 0; // Pequeno delay no resultado
    }

    Animated.timing(translateY, {
      toValue: toValue,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
      delay: delay,
    }).start();
  }, [status, cup.hasBall, cup.isGuessed, translateY]);

  const getColor = () => {
    if (status === STATUS.RESULT) {
      if (cup.isGuessed && cup.hasBall) return Colors.success;
      if (cup.isGuessed && !cup.hasBall) return Colors.danger;
      // Se a bola não foi adivinhada, mas está no copo, ele ainda é azul.
      if (cup.hasBall) return Colors.primary; 
    }
    // No status REVEAL_BALL, todos os copos são primários (azuis)
    return Colors.primary;
  };

  return (
    <Animated.View
      style={[
        styles.cupContainer,
        {
          transform: [
            { translateX: translateX },
            { translateY: translateY },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.cup, { backgroundColor: getColor() }]}
        disabled={status !== STATUS.GUESSING} // Desabilita o toque em REVEAL_BALL também
        onPress={() => onPress(cup.id)}
        activeOpacity={0.8}
      >
        {/* Mostra a bola nos status REVEAL_BALL ou RESULT */}
        {(cup.hasBall && status === STATUS.REVEAL_BALL) ||
        (cup.hasBall && status === STATUS.RESULT) ? (
          <Text style={styles.ball}>⚽</Text>
        ) : null}

        {status === STATUS.GUESSING && <Text style={styles.question}>?</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
});

// --- COMPONENTE PRINCIPAL ---
const JogoDaBolaScreen = ({navigation}) => {
  const [status, setStatus] = useState(STATUS.INSTRUCTIONS);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [cups, setCups] = useState(initializeCups);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Encontre a bola!");
  const [isShuffling, setIsShuffling] = useState(false);
  const [ballCupId, setBallCupId] = useState(cups.find((c) => c.hasBall).id);

  // Efeito para lidar com o REVEAL_BALL
  useEffect(() => {
    if (status === STATUS.REVEAL_BALL) {
      setMessage("Preste atenção! A bola está aqui...");
      setTimeout(() => {
        // Abaixa o copo e inicia o embaralhamento
        setMessage("Embaralhando! Preste atenção...");
        setStatus(STATUS.SHUFFLING);
      }, REVEAL_DURATION_MS); // Tempo para mostrar a bola
    }
  }, [status]);

  // --- EMBARALHAR ---
  const handleShuffle = useCallback(() => {
    setCups((prevCups) => {
      let idxA, idxB;
      do {
        idxA = Math.floor(Math.random() * NUM_CUPS);
        idxB = Math.floor(Math.random() * NUM_CUPS);
      } while (idxA === idxB);

      const cupA = prevCups.find((c) => c.positionIndex === idxA);
      const cupB = prevCups.find((c) => c.positionIndex === idxB);

      return prevCups.map((cup) => {
        if (cup.id === cupA.id) return { ...cup, positionIndex: idxB };
        if (cup.id === cupB.id) return { ...cup, positionIndex: idxA };
        return cup;
      });
    });
  }, []);

  useEffect(() => {
    if (status === STATUS.SHUFFLING) {
      setIsShuffling(true);

      let swapCount = 0;
      const interval = setInterval(() => {
        if (swapCount >= SHUFFLE_SWAPS) {
          clearInterval(interval);
          setTimeout(() => {
            setStatus(STATUS.GUESSING);
            setMessage("Onde está a bola? Escolha um copo!");
            setIsShuffling(false);
          }, SWAP_INTERVAL_MS);
        } else {
          handleShuffle();
          swapCount++;
        }
      }, SWAP_INTERVAL_MS);

      return () => clearInterval(interval);
    }
  }, [status, handleShuffle]);

  // --- PALPITE ---
  const handleCupPress = (cupId) => {
    if (status !== STATUS.GUESSING) return;

    setStatus(STATUS.RESULT);

    const guessedCup = cups.find((c) => c.id === cupId);
    setCups((prev) =>
      prev.map((c) => (c.id === cupId ? { ...c, isGuessed: true } : c))
    );

    if (guessedCup.hasBall) {
      setScore((prev) => prev + 1);
      setMessage("ACERTOU! 🎉 A bola estava lá.");
    } else {
      setMessage(`ERROU 😔 A bola estava no copo ${ballCupId}.`);
    }

    setTimeout(() => {
      if (round < TOTAL_ROUNDS) {
        startRound();
      } else {
        // Fim do jogo, o status já é RESULT e o "FIM DE JOGO" será exibido.
      }
    }, 1800);
  };

  // --- NOVA RODADA ---
  const startRound = () => {
    const newCups = initializeCups().map((c) => ({ ...c, isGuessed: false }));
    setCups(newCups);
    setBallCupId(newCups.find((c) => c.hasBall).id);
    
    // AQUI ESTÁ A CORREÇÃO: Incrementa a rodada em 1
    setRound((prev) => prev + 1); 
    
    setStatus(STATUS.REVEAL_BALL); // Começa revelando a bola
  };

  // --- REINICIAR ---
  const restartGame = () => {
    const initial = initializeCups();
    setCups(initial);
    setBallCupId(initial.find((c) => c.hasBall).id);
    setRound(1);
    setScore(0);
    setStatus(STATUS.INSTRUCTIONS); // Volta para as instruções
  };

  // --- TELAS ---
  if (status === STATUS.INSTRUCTIONS)
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Encontre a Bola! ⚽</Text>
        <Text style={styles.subtitle}>
          Teste sua Atenção e Rastreamento Visual.
        </Text>

        <View style={styles.instructionBox}>
          <Text style={styles.instructionTitle}>Como Jogar:</Text>
          <Text style={styles.instructionText}>
            • Existem 5 copos e 1 bola escondida.{"\n"}• Antes de cada rodada, você
            verá onde a bola está.{"\n"}• O copo com a bola será
            embaralhado {SHUFFLE_SWAPS} vezes por rodada.{"\n"}• Você terá {TOTAL_ROUNDS} rodadas.{"\n"}•
            Acerte o copo correto para ganhar 1 ponto!
          </Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setStatus(STATUS.REVEAL_BALL)} // Inicia revelando a bola
        >
          <Text style={styles.actionButtonText}>Iniciar Partida</Text>
        </TouchableOpacity>
      </View>
    );

  if (status === STATUS.RESULT && round === TOTAL_ROUNDS)
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.title}>FIM DE JOGO! 🏆</Text>
        <Text style={styles.subtitle}>
          Você completou todas as {TOTAL_ROUNDS} rodadas.
        </Text>

        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Sua Pontuação</Text>
          <Text style={styles.resultScore}>
            {score} / {TOTAL_ROUNDS}
          </Text>
        </View>

        <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Tempo Total:</Text>
            <Text style={styles.resultValue}>{formatTime(timeElapsed)}</Text>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={restartGame}>
          <Text style={styles.actionButtonText}>Jogar Novamente</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.contentContainer}>

        <View style={styles.header}>
            <View style={styles.infoPill}>
                <Ionicons name="time-outline" size={16} color={Colors.primary} />
                <Text style={styles.infoText}>Tempo: {formatTime(timeElapsed)}</Text>
            </View>
            <View style={styles.infoPill}>
                <Ionicons name="radio-button-off-outline" size={16} color={Colors.primary} />
                <Text style={styles.infoText}>Rodada: {round} / {TOTAL_ROUNDS}</Text>
            </View>
            <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
                <Ionicons name="refresh-outline" size={24} color={Colors.background.dark} />
            </TouchableOpacity>
        </View>
     

      <Text style={styles.message}>{message}</Text>

      <View style={styles.cupsAreaWrapper}>
        <View style={styles.cupsArea}>
            {cups.map((cup) => (
            <Cup key={cup.id} cup={cup} status={status} onPress={handleCupPress} />
            ))}
        </View>
      </View>

      {isShuffling && (
        <View style={styles.shuffleBox}>
          <ActivityIndicator color={Colors.warning} size="small" />
          <Text style={styles.shuffleText}>Embaralhando...</Text>
        </View>
      )}

       <TouchableOpacity 
          style={styles.exitButton}
          onPress={() => navigation.goBack()} 
      >
          <Ionicons name="exit-outline" size={20} color={Colors.text} />
          <Text style={styles.exitButtonText}>Sair do Jogo</Text>
      </TouchableOpacity>
    </View>

  );
};

export default JogoDaBolaScreen;

// --- STYLES ---
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.background.dark,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.large,
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginBottom: Spacing.medium,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: Colors.background.ligth,
    marginBottom: Spacing.large,
    textAlign: "center",
  },
  instructionBox: {
    backgroundColor: Colors.background.dark,
    padding: Spacing.large,
    borderRadius: Spacing.boderRadius,
    marginBottom: Spacing.large,
  },
  instructionTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.background.ligth,
    marginBottom: Spacing.small,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.muted,
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.xlarge,
    borderRadius: Spacing.boderRadius,
    marginTop: Spacing.large,
  },
  actionButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.background.ligth,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: Colors.background.dark,
    borderRadius: Spacing.boderRadius,
    padding: Spacing.medium,
    marginBottom: Spacing.medium,
    alignSelf: "center",
  },
  headerItem: { alignItems: "center" },
  headerLabel: { color: Colors.muted, fontSize: 14, fontFamily: Fonts.medium },
  headerValue: { color: Colors.primary, fontSize: 18, fontFamily: Fonts.bold },
  restartButton: {
    backgroundColor: Colors.danger,
    padding: Spacing.small,
    borderRadius: Spacing.boderRadius,
  },
  message: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: Colors.background.ligth,
    marginVertical: Spacing.large,
    textAlign: "center",
  },
  cupsAreaWrapper: {
        width: '100%',
        height: 140, // Mesma altura para manter o layout
        alignItems: 'center', // Garante que o cupsArea fique no centro horizontal
        alignSelf:"center",
        justifyContent: 'flex-end',
        position: 'relative',
        marginBottom: 20, // Adiciona um espaço abaixo se necessário
    },
  cupsArea: {
    // Usamos position: absolute para que os copos possam se sobrepor
        position: 'absolute',
        bottom: 0,
        // Centraliza o ponto inicial à 50% da tela
        left: '50%', 
        transform: [{ translateX: -170 }], 
        height: 140, 
        width: 340, // Definindo a largura exata para ajudar
  },
  cupContainer: {
    position: "absolute",
    bottom: 0,
    // Garante que a sombra apareça acima dos outros elementos
    zIndex: 1, 
  },
  cup: {
    width: 60,
    height: 75, 
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 25,   
    borderTopRightRadius: 25,  
    borderBottomLeftRadius: 5, // Borda inferior mais arredondada
    borderBottomRightRadius: 5, // Borda inferior mais arredondada
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  ball: { 
    fontSize: 28, // Bola um pouco maior
    position: "absolute", 
    bottom: -15, // Posição para a bola aparecer logo abaixo da borda
  },
  question: {
    fontSize: 28,
    color: Colors.background.ligth,
    fontFamily: Fonts.bold,
    opacity: 0.8,
  },
  shuffleBox: { flexDirection: "row", alignItems: "center", marginTop: Spacing.large },
  shuffleText: {
    marginLeft: Spacing.small,
    fontSize: 16,
    color: Colors.warning,
    fontFamily: Fonts.medium,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginVertical: 20,
  },
  resultBox: {
    backgroundColor: Colors.background.ligth,
    padding: 2,
    borderRadius: 10,
    marginVertical: 10,
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
  },   resultScore: {
    fontSize: 42,
    fontFamily: Fonts.bold,
    color: Colors.background.ligth,
  },   infoPill: {
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
  }, exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 10,
    marginTop: 250,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: Colors.background.ligth,
    borderWidth: 1,
    borderColor: Colors.muted,
    width: "100%",
  },
  exitButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  }
});