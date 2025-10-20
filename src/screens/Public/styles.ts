import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Definição de Cores
const COLORS = {
  primary: '#0066cc',
  secondary: '#6c757d',
  background: '#FFFFFF',
  card: '#F8F9FA',
  text: '#212529',
  textLight: '#FFFFFF',
  border: '#E0E0E0',
};

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // --- Cabeçalho ---
  header: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  authContainer: {
    flexDirection: 'row',
  },
  authButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  authButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
  },
  registerButtonText: {
    color: COLORS.textLight,
  },

  // --- Conteúdo Rolável ---
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },

  // --- Seção Hero (Apresentação) ---
  heroSection: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  logo: {
    width: 400,
    height: 220,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 15,
    maxWidth: 600,
  },
  heroSubtitle: {
    fontSize: 18,
    color: COLORS.secondary,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 700,
  },

  // --- Estilo de Título de Seção (Reutilizável) ---
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 30,
  },

  // --- Seção Funcionalidades (NOVO) ---
  featuresSection: {
    width: '100%',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background, // Fundo branco (alterna com o cinza da equipe)
    alignItems: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 1200,
  },
  featureCard: {
    width: 300,
    minHeight: 160,
    backgroundColor: COLORS.card, // Fundo cinza claro
    borderRadius: 12,
    padding: 20,
    margin: 10,
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  featureDescription: {
    fontSize: 16,
    color: COLORS.secondary,
    lineHeight: 22,
  },
  // ------------------------------------

  // --- Seção Equipe ---
  teamSection: {
    width: '100%',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.card, // Fundo cinza claro
    alignItems: 'center',
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 1200,
  },
  teamCard: {
    width: 250,
    backgroundColor: COLORS.background, // Fundo branco
    borderRadius: 12,
    padding: 20,
    margin: 10,
    alignItems: 'center',
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    backgroundColor: COLORS.border,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  teamDescription: {
    fontSize: 14,
    color: COLORS.secondary,
    textAlign: 'center',
  },
});