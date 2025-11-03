// Importe este componente no AppPaciente
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../themes';

export const GamePlaceholderScreen = ({ route }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Tela do Jogo:</Text>
    <Text style={styles.gameName}>{route.params?.title || route.name}</Text>
    <Text style={styles.subText}>Em desenvolvimento...</Text>
  </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background.dark },
    title: { fontSize: 20, color: Colors.text, marginBottom: 10 },
    gameName: { fontSize: 28, fontWeight: 'bold', color: Colors.primary },
    subText: { fontSize: 16, color: Colors.muted, marginTop: 10 },
});

// Lembre-se de importar Colors se este código estiver em um arquivo separado.