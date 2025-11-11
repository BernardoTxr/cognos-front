import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../themes";
import {registerPartidaJogoReac} from "../../../services/partida";

// --- CONSTANTES DE ESTADO DO JOGO ---
const STATUS = {
  INSTRUCTIONS: 'instructions', // Mostra as instruções e o botão de Iniciar
  WAITING: 'waiting',       // Esperando o tempo aleatório (Botão Vermelho)
  READY: 'ready',         // Pronto para clicar (Botão Verde)
  RESULT: 'result',         // Mostra o resultado do tempo de reação
};

const JogoDoReflexoScreen = ({ navigation }) => {
  const [status, setStatus] = useState(STATUS.INSTRUCTIONS);
  const [reactionTime, setReactionTime] = useState(null);
  
  // Refs para gerenciar timers e a hora de início
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);

  // --- FUNÇÕES DE LÓGICA DO JOGO ---

  /**
   * 1. Inicia o ciclo de espera. Define um tempo aleatório (1s a 10s).
   */
  const startWaitingPhase = () => {
    // Limpa qualquer timer anterior
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setStatus(STATUS.WAITING);

    // Tempo aleatório entre 1000ms (1s) e 10000ms (10s)
    const randomDelay = Math.random() * 9000 + 1000; 

    // Define o timer para a mudança de cor
    timeoutRef.current = setTimeout(startReadyPhase, randomDelay);
  };

  /**
   * 2. O botão fica verde. O jogo realmente começa aqui.
   */
  const startReadyPhase = () => {
    setStatus(STATUS.READY);
    // Guarda o momento exato em que o botão ficou verde (em milissegundos)
    startTimeRef.current = performance.now(); 
  };

  /**
   * 3. Lógica ao clicar no botão/tela.
   */
  const handleTap = async () => {
    const tapTime = performance.now();

    if (status === STATUS.WAITING) {
      // Clique antecipado: o botão ainda estava vermelho/esperando
      clearTimeout(timeoutRef.current);
      Alert.alert(
        "Antecipação!", 
        "Você clicou muito cedo. Espere o botão ficar verde.",
        [{ text: "Tentar Novamente", onPress: startWaitingPhase }]
      );
      // Retorna para o estado de instruções para recomeçar o ciclo de forma clara
      setStatus(STATUS.INSTRUCTIONS); 
    
    } else if (status === STATUS.READY) {
      // Clique correto: calcula e mostra o resultado
      const timeTaken = tapTime - startTimeRef.current;
      const roundedTime = Math.round(timeTaken)
      setReactionTime(roundedTime);
      setStatus(STATUS.RESULT);
      await registerPartidaJogoReac({reacao: roundedTime})

    }
  };

  /**
   * 4. Reseta o jogo e volta à tela de instruções (ou inicia uma nova partida).
   */
  const handleNewGame = () => {
    setReactionTime(null);
    setStatus(STATUS.INSTRUCTIONS); // Volta para as instruções para um novo ciclo
    startWaitingPhase(); // Inicia imediatamente a nova partida
  };

  // --- RENDERIZAÇÃO DE PARTES DO JOGO ---

  const renderInstructions = () => (
    <View style={styles.contentContainer}>
      <Ionicons name="flash-outline" size={80} color={Colors.primary} />
      <Text style={styles.instructionTitle}>Teste seu Reflexo</Text>
      <Text style={styles.instructionText}>
        1. Pressione "Iniciar Partida".
      </Text>
      <Text style={styles.instructionText}>
        2. A tela ficará vermelha.
      </Text>
      <Text style={styles.instructionText}>
        3. Espere até que a tela fique verde.
      </Text>
      <Text style={styles.instructionText}>
        4. Clique na tela o mais rápido possível assim que ela ficar verde!
      </Text>
      <TouchableOpacity 
        style={styles.startButton} 
        onPress={startWaitingPhase}
      >
        <Text style={styles.startButtonText}>Iniciar Partida</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGameArea = () => {
    // Define o estilo de fundo com base no status
    const backgroundColor = 
      status === STATUS.WAITING 
        ? Colors.colors.red // Vermelho/Esperando
        : Colors.colors.green; // Verde/Pronto

    const indicator = 
      status === STATUS.WAITING 
        ? <ActivityIndicator size="large" color={Colors.background.ligth} />
        : <Text style={styles.readyText}>CLIQUE AGORA!</Text>;

    return (
      <TouchableOpacity 
        style={[styles.gameArea, { backgroundColor: backgroundColor }]}
        onPress={handleTap}
        activeOpacity={1} // Garante que não haja feedback visual de toque
      >
        {indicator}
      </TouchableOpacity>
    );
  };

  const renderResults = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.resultLabel}>Seu Tempo de Reação:</Text>
      <Text style={styles.resultTime}>{reactionTime}ms</Text>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: Colors.background.dark }]}
          onPress={() => navigation.goBack()} // Volta para a lista de jogos
        >
          <Ionicons name="exit-outline" size={20} color={Colors.background.dark} />
          <Text style={styles.actionButtonText}>Sair</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleNewGame}
        >
          <Ionicons name="refresh-outline" size={20} color={Colors.background.dark} />
          <Text style={styles.actionButtonText}>Nova Partida</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- RENDERIZAÇÃO PRINCIPAL ---
  if (status === STATUS.WAITING || status === STATUS.READY) {
    return renderGameArea();
  }

  if (status === STATUS.RESULT) {
    return renderResults();
  }

  return renderInstructions();
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  // Telas de Instruções/Resultado
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

  // Tela de Jogo (Waiting/Ready)
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readyText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.background.ligth,
  },

  // Tela de Resultado
  resultLabel: {
    fontSize: 20,
    color: Colors.text,
    marginBottom: 10,
  },
  resultTime: {
    fontSize: 60,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 50,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
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

export default JogoDoReflexoScreen;