import { useState } from "react";
import { View, Text, Modal, TouchableOpacity, Alert, Image } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import CustomButton from "../../../components/Button";
import CustomInput from "../../../components/Input";
import CustomTitle from "../../../components/Title";
import styles from "./styles";
import { loginAccount } from "../../../services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Logo from "../../../assets/images/logo_horizontal.png" ;


export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [emailToReset, setEmailToReset] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 const handleLogin = async () => {
  if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
  setLoading(true);
  try {
      const response = await loginAccount(email, password);
      await AsyncStorage.setItem("authToken", response.access_token);
      login(response);
    } catch (err: any) {
      Alert.alert("Erro", "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
};
  const handlePasswordReset = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={[styles.logo]} resizeMode="contain" />
      <View style={styles.mainContainer}>
      <CustomTitle
        title="Bem-vindo de volta!"
        subtitle="Pronto para mais uma sessão?"
      />

      <View style={styles.inputSpacing}>
        <CustomInput
          label="Email"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputSpacing}>
        <CustomInput
          label="Senha"
          placeholder="Digite sua senha"
          secure
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.linkText}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <View style={styles.buttonSpacing}>
        <CustomButton size="large" title={loading ? "Entrando..." : "Entrar"} fill onPress={handleLogin} />
      </View>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Não tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.linkText}> Cadastre-se</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <CustomTitle title="Redefinir Senha" subtitle="Uma mensagem será enviada para o seu email para a recuperação da senha" titleStyle={styles.modalTitle}></CustomTitle>
            <CustomInput
              label="E-mail de recuperação"
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              value={emailToReset}
              onChangeText={setEmailToReset}
            />
            <CustomButton title="Enviar" fill onPress={handlePasswordReset}/>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalCloseIcon}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
    </View>
  );
}
