import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';

// --- Dados da Equipe ---
const teamData = [
  {
    id: '1',
    name: 'Bernardo Teixeira',
    role: 'CEO',
    photoUrl: require('../../assets/images/team/bernardo.jpeg'),
  },
  {
    id: '2',
    name: 'Beatriz Tavora',
    role: 'CTO',
    photoUrl: require('../../assets/images/team/bia.jpeg'),
  },
  {
    id: '3',
    name: 'Vinícius Rosa',
    role: 'Head de Design',
    photoUrl: require('../../assets/images/team/vini.jpeg'),
  },
  {
    id: '4',
    name: 'João Gallego',
    role: 'Head de Hardware',
    photoUrl: require('../../assets/images/team/gallego.jpeg'),
  },
  {
    id: '5',
    name: 'Caique Maia',
    role: 'Head de Software',
    photoUrl: require('../../assets/images/team/caique.jpeg'),
  },
  {
    id: '6',
    name: 'Hugo Spadete',
    role: 'Estagiário',
    photoUrl: require('../../assets/images/team/hugo.jpeg'),
  },
];

// --- Dados das Funcionalidades ---
const featuresData = [
  {
    id: '1',
    title: 'Gamificação Terapêutica',
    description: 'Engaje pacientes com jogos interativos...',
    iconName: 'brain', // Ícone do MaterialCommunityIcons
  },
  {
    id: '2',
    title: 'Métricas Comportamentais',
    description: 'Colete dados objetivos sobre foco...',
    iconName: 'chart-bar',
  },
  {
    id: '3',
    title: 'Relatórios para Terapeutas',
    description: 'Visualize o progresso do paciente...',
    iconName: 'clipboard-text-outline',
  },
];
// ------------------------------------

const logoPath = require('../../assets/images/logo_horizontal.png');

const Public = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Cabeçalho Fixo */}
      <View style={styles.header}>
        <View style={styles.authContainer}>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.authButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.authButton, styles.registerButton]}
            onPress={() => navigation.navigate('SignUp')} // Correção: onPress movido para cá
          >
            <Text style={[styles.authButtonText, styles.registerButtonText]}>
              Cadastro
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Conteúdo da Página (Rolável) */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* 2a. Seção de Apresentação (Hero) */}
        <View style={styles.heroSection}>
          <Image source={logoPath} style={styles.logo} />
          <Text style={styles.heroTitle}>
            Redefinindo a interação terapêutica.
          </Text>
          <Text style={styles.heroSubtitle}>
            O Cognos é uma plataforma gamificada que transforma a coleta de
            métricas comportamentais, ajudando psicólogos a entenderem e
            interagirem melhor com pacientes no espectro autista.
          </Text>
        </View>

        {/* 2b. Seção de Funcionalidades (NOVA) */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Funcionalidades</Text>
          <View style={styles.featuresGrid}>
            {featuresData.map((feature) => (
              <View key={feature.id} style={styles.featureCard}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 2c. Seção "Conheça a Equipe" */}
        <View style={styles.teamSection}>
          <Text style={styles.sectionTitle}>Conheça a Equipe</Text>
          <View style={styles.teamGrid}>
            {teamData.map((member) => (
              <View key={member.id} style={styles.teamCard}>
                <Image source={member.photoUrl} style={styles.teamPhoto} />
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamDescription}>{member.role}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Public;