import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Declare Web Serial on Navigator for TypeScript so `navigator.serial` is recognized.
// This keeps the declaration local to this module and avoids changing global type files.
declare global {
  interface Navigator {
    serial?: {
      requestPort?: (...args: any[]) => Promise<any>;
      getPorts?: (...args: any[]) => Promise<any[]>;
      // add other methods/properties you need from the Web Serial API as optional
    };
  }
}

// Assumindo que Colors é um objeto global ou importado de um tema
const Colors = {
    primary: '#e94560', 
    muted: '#8e8e9e',
    text: '#ffffff',
    background: {
        dark: '#1a1a2e',
        light: '#35355e',
    }
};

// --- 1. DEFINIÇÕES DE STATUS E CONSTANTES WEB SERIAL ---
const STATUS = {
  INSTRUCTIONS: 'instructions',
  CONNECTING: 'connecting', // Solicitando permissão da Porta Serial
  ERROR: 'error',          // Erro na conexão Serial
  PLAYING: 'playing',      // Conexão Serial OK (Representa o estado 'Em Desenvolvimento')
};

// --- Variáveis Globais de Conexão Serial ---
let serialPort = null; // Armazena o objeto da porta serial
let reader = null;     // Para leitura contínua (se necessário)

// Configuração da porta serial (MUDANÇA: Adapte ao seu hardware)
const BAUD_RATE = 9600; 

// --- 2. COMPONENTE PRINCIPAL ---

const JogoDaMatematicaSerial = ({ navigation }) => {
  const [status, setStatus] = useState(STATUS.INSTRUCTIONS);
  const [errorMessage, setErrorMessage] = useState("");

  // =============================================================
  // LÓGICA DE COMUNICAÇÃO WEB SERIAL API
  // =============================================================

  // Inicia a leitura contínua de dados da porta serial (simplesmente loga o que recebe)
  const readData = useCallback(async () => {
      if (!serialPort || !serialPort.readable) return;

      const textDecoder = new TextDecoder(); 
      reader = serialPort.readable.getReader();
      
      try {
          while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              if (value) {
                  const data = textDecoder.decode(value, { stream: true });
                  console.log("Dados recebidos da FPGA via Serial:", data);
                  // 💡 A lógica do jogo (ex: receber 'RESPOSTA_CORRETA', 'ERRO') viria aqui.
              }
          }
      } catch (error) {
          console.error("Erro na leitura serial:", error);
          if (status !== STATUS.ERROR) { 
              setErrorMessage("Conexão serial perdida: " + error.message);
          }
      } finally {
          if (reader) reader.releaseLock();
      }
  }, [status]);
  
  // 1. SOLICITA A AUTORIZAÇÃO E CONEXÃO DA PORTA SERIAL
  const requestAndConnectPort = useCallback(async () => {
    // Verifica se a API Web Serial está disponível
    if (typeof navigator.serial === 'undefined') {
        setErrorMessage("Web Serial API não suportado neste navegador. Use Chrome/Edge e HTTPS.");
        setStatus(STATUS.ERROR);
        return;
    }
    
    setStatus(STATUS.CONNECTING);
    setErrorMessage("");

    // Fecha a porta se estiver aberta antes de tentar uma nova conexão
    await disconnectAndReset(); 
    
    try {
        // 1. Solicita a autorização ao usuário (abre a modal do navegador)
        const port = await navigator.serial.requestPort();
        serialPort = port;
        
        // 2. Abre a porta com o Baud Rate (Taxa de Transmissão)
        await serialPort.open({ baudRate: BAUD_RATE });
        
        console.log("Porta serial conectada:", serialPort);
        
        // 3. Sucesso: Transiciona para a tela de "Em Desenvolvimento"
        setStatus(STATUS.PLAYING);
        
        // 4. Inicia o loop de leitura de dados em segundo plano
        readData(); 

    } catch (error) {
        let message = "Falha na conexão serial.";
        if (error.name === 'NotFoundError') {
            message = "Nenhuma porta selecionada ou adaptador USB-Serial não detectado.";
        } else if (error.name === 'SecurityError') {
            message = "Erro de segurança: Web Serial exige HTTPS ou localhost.";
        } else {
            message = `Erro desconhecido: ${error.message}`;
        }
        console.error("Erro de Conexão Serial:", error);
        setErrorMessage(message);
        setStatus(STATUS.ERROR);
    }
  }, [readData]);
  
  // Função para desconectar a Porta Serial e voltar ao início
  const disconnectAndReset = async () => {
      // 1. Tenta cancelar o leitor
      if (reader) {
          try {
              await reader.cancel();
          } catch (e) {
              console.warn("Erro ao tentar cancelar o leitor:", e);
          }
          reader = null; 
      }
      
      // 2. Tenta fechar a porta
      if (serialPort && serialPort.readable) {
          await new Promise(resolve => setTimeout(resolve, 50)); 
          
          if (serialPort.opened) {
              try {
                  await serialPort.close();
                  console.log("Porta serial desconectada.");
              } catch (e) {
                  console.error("Erro ao fechar a porta:", e);
              }
          }
          serialPort = null;
      }
      
      // 3. Reseta o estado
      setStatus(STATUS.INSTRUCTIONS);
      setErrorMessage("");
  };

  // Transiciona da tela de instruções para o processo de conexão
  const startPlaying = () => {
      // Inicia a tentativa de conexão serial
      requestAndConnectPort();
  };
  
  // =============================================================
  // FUNÇÕES DE RENDERIZAÇÃO
  // =============================================================

  // --- FUNÇÃO DE INSTRUÇÕES ---
  const renderInstructions = () => (
    <View style={styles.contentContainer}>
      <Ionicons name="hardware-chip-outline" size={80} color={Colors.primary} />
      <Text style={styles.instructionTitle}>Cognos Math - Web Serial</Text>
      
      <View style={{ marginVertical: 30, width: '90%' }}>
        <Text style={styles.instructionListItem}>
          1. Conecte o Adaptador USB-Serial (TX/RX) ao computador.
        </Text>
        <Text style={styles.instructionListItem}>
          2. Selecione a dificuldade na alavanca do Cognos Math.
        </Text>
        <Text style={styles.instructionListItem}>
          3. Clique abaixo para autorizar o acesso à **Porta Serial**. (Aparecerá a janela do navegador).
        </Text>
        <Text style={styles.instructionListItem}>
          4. A lógica do jogo será implementada após a conexão bem-sucedida.
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.startButton} 
        onPress={startPlaying} // Inicia a conexão Web Serial
      >
        <Text style={styles.startButtonText}>Entendi, Iniciar Conexão</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
          style={styles.exitButton}
          onPress={disconnectAndReset} // Usamos o disconnectAndReset para voltar
      >
          <Ionicons name="arrow-back-outline" size={20} color={Colors.text} />
          <Text style={styles.exitButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );

  // --- FUNÇÃO DE STATUS INTERMEDIÁRIO (CONNECTING / ERROR) ---
  const renderConnectionStatus = () => {
      const isError = status === STATUS.ERROR;
      const iconName = isError ? "alert-circle-outline" : "share-outline";
      const iconColor = isError ? Colors.primary : Colors.muted;
      const title = isError ? "Falha na Conexão Serial" : "Conectando...";

      return (
        <View style={styles.contentContainer}>
            <Ionicons name={iconName} size={80} color={iconColor} style={isError ? {} : styles.pulsingIcon} />
            <Text style={styles.resultTitle}>{title}</Text>
            
            {isError ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>Motivo:</Text>
                    <Text style={styles.errorTextDetail}>{errorMessage}</Text>
                </View>
            ) : (
                <Text style={styles.instructionText}>
                    Aguarde a abertura da janela do navegador para selecionar a porta serial do seu adaptador (ex: CP210x, CH340).
                </Text>
            )}

            <TouchableOpacity 
                style={isError ? styles.startButton : [styles.startButton, { opacity: 0.5 }]} 
                onPress={isError ? startPlaying : () => {}} // Permite tentar de novo se houver erro
                disabled={!isError}
            >
                <Text style={styles.startButtonText}>{isError ? 'Tentar Novamente' : 'Aguardando...'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.exitButton} 
                onPress={disconnectAndReset}
            >
                <Ionicons name="close-circle-outline" size={20} color={Colors.text} />
                <Text style={styles.exitButtonText}>Cancelar e Voltar</Text>
            </TouchableOpacity>
        </View>
      );
  };

  // --- FUNÇÃO DE TELA 'EM DESENVOLVIMENTO' (Conexão OK) ---
  const renderEmDesenvolvimento = () => (
    <View style={styles.contentContainer}>
        <Ionicons name="hammer-outline" size={80} color={Colors.muted} />
        <Text style={styles.resultTitle}>Em Desenvolvimento</Text>
        <Text style={styles.instructionText}>
          Dispositivo Cognos Math conectado via **Web Serial API**.
        </Text>
        <Text style={styles.instructionText}>
          A lógica do jogo será implementada aqui, utilizando a porta serial para comunicação.
        </Text>
        
        <TouchableOpacity 
            style={styles.startButton} 
            onPress={disconnectAndReset}
        >
            <Text style={styles.startButtonText}>Desconectar e Sair</Text>
        </TouchableOpacity>
    </View>
  );


  // --- Renderiza o componente com base no status atual ---
  if (status === STATUS.INSTRUCTIONS) {
    return renderInstructions();
  }
  
  if (status === STATUS.CONNECTING || status === STATUS.ERROR) {
      return renderConnectionStatus();
  }
  
  // Se STATUS for PLAYING (Conexão OK)
  return renderEmDesenvolvimento();
};


const styles = StyleSheet.create({
  // --- INSTRUÇÕES E RESULTADO (APLICADO AO 'EM DESENVOLVIMENTO') ---
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
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: Colors.muted,
    textAlign: 'center',
    marginVertical: 4,
  },
  // Estilo específico para a lista de passos
  instructionListItem: { 
    fontSize: 16,
    color: Colors.text,
    textAlign: 'left',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 10,
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
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 10,
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: Colors.background.dark,
    borderWidth: 1,
    borderColor: Colors.muted,
  },
  exitButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  pulsingIcon: {
      // Animação básica de pulsação CSS (React Native Web deve suportar)
      transform: [{ scale: 1.0 }],
    },
  errorBox: {
      backgroundColor: Colors.background.light,
      padding: 15,
      borderRadius: 8,
      marginHorizontal: 20,
      marginTop: 10,
      width: '90%',
  },
  errorText: {
      fontSize: 16,
      color: Colors.text,
      fontWeight: 'bold',
      marginBottom: 5,
  },
  errorTextDetail: {
      fontSize: 14,
      color: Colors.muted,
  }
});

export default JogoDaMatematicaSerial;