import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
} from "react-native";
import CustomInput from "../../../components/Input";
import CustomButton from "../../../components/Button";
import CustomTitle from "../../../components/Title";
import styles from "./styles";
import {
  loginAccount,
  registerAccount,
  registerPaciente,
  registerTerapeuta,
} from "../../../services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../context/AuthContext";


export function showAlert(title: string, message: string, onConfirm?: () => void) {
  if (Platform.OS === "web") {
    alert(`${title}\n\n${message}`);
    if (onConfirm) onConfirm();
  } else {
    Alert.alert(title, message, [{ text: "OK", onPress: onConfirm }]);
  }
}

const { height } = Dimensions.get("window");

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(""); // Tipo de conta
  const [isPaciente, setIsPaciente] = useState(false);

  const { login } = useAuth();

  // Campos adicionais para Paciente
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [sexo, setSexo] = useState("");
  const [nivelTea, setNivelTea] = useState(null);

  // Campos adicionais para Terapeuta
  const [documento, setDocumento] = useState("");

  const [error, setError] = useState("");
  const [errorConfirm, setErrorConfirm] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // Validação de senha
  const validatePassword = () => {
    if (password.length < 8 && password.length !== 0) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      setIsPasswordValid(false);
      return;
    }
    if (password !== confirmPassword && confirmPassword.length !== 0) {
      setErrorConfirm("As senhas não coincidem.");
      setIsPasswordValid(false);
      return;
    }
    setError("");
    setErrorConfirm("");
    setIsPasswordValid(true);
  };

  useEffect(() => {
    validatePassword();
  }, [password, confirmPassword]);

  const handleRoleChange = (value: string) => {
    setRole(value);
    setIsPaciente(value === "paciente");
    // Reset campos adicionais
    setNomeCompleto("");
    setDataNascimento("");
    setCpf("");
    setSexo("");
    setNivelTea("");
    setDocumento("");
  };

  const handleSignUp = async () => {
    if (!isPasswordValid) {
      Alert.alert("Erro", "As senhas devem coincidir");
      return;
    }

    if (!username || !email || !password || !role) {
      Alert.alert("Erro", "Todos os campos obrigatórios devem estar preenchidos");
      return;
    }

    if (isPaciente) {
      if (!nomeCompleto || !dataNascimento || !cpf || !sexo) {
        Alert.alert("Erro", "Todos os campos do paciente devem estar preenchidos");
        return;
      }
    } else {
      if (!nomeCompleto) {
        Alert.alert("Erro", "O nome completo do terapeuta é obrigatório");
        return;
      }
    }

    try {
      const userPayload = {
        email,
        username,
        password,
        is_patient: isPaciente,
      };
      const userResponse = await registerAccount(
        userPayload.email,
        userPayload.username,
        userPayload.password,
        userPayload.is_patient
      );

      const loginResponse = await loginAccount(email, password);
      await AsyncStorage.setItem("authToken", loginResponse.access_token);

      if (isPaciente) {
        await registerPaciente({
          nome_completo: nomeCompleto,
          data_de_nascimento: dataNascimento,
          cpf,
          sexo: sexo === "masc" ? "masc" : sexo === "fem" ? "fem" : "outro",
          nivel_tea: nivelTea,
        });
      } else {
        await registerTerapeuta({
          nome_completo: nomeCompleto,
          documento: documento || null,
        });
      }

      showAlert("Sucesso", "Conta criada com sucesso!", async () => {
        await login(loginResponse);
      });

    } catch (error: any) {
      if (error.response) {
        Alert.alert("Erro", error.response.data.detail);
      } else {
        Alert.alert("Erro", "Erro ao conectar com o servidor.");
      }
    }
  };

  return (
    <View>
      <TouchableWithoutFeedback>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <CustomTitle
              title="Crie sua conta"
              subtitle="Preencha os campos abaixo para começar"
            />

            {/* ScrollView com altura limitada */}
            <ScrollView
              style={[
                styles.scrollView,
                { maxHeight: height * 0.7 }, // ✅ máximo de 70% da tela
              ]}
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.inputSpacing}>
                <CustomInput
                  label="Nome de usuário"
                  placeholder="Digite seu nome de usuário"
                  value={username}
                  onChangeText={setUsername}
                  required
                />
              </View>

              <View style={styles.inputSpacing}>
                <CustomInput
                  label="Email"
                  placeholder="Digite seu e-mail"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  required
                />
              </View>

              <View style={styles.inputSpacing}>
                <CustomInput
                  label="Senha"
                  placeholder="Digite sua senha"
                  secure
                  value={password}
                  onChangeText={setPassword}
                  spanText={error}
                  required
                />
              </View>

              <View style={styles.inputSpacing}>
                <CustomInput
                  label="Confirmar senha"
                  placeholder="Digite a senha novamente"
                  secure
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  spanText={errorConfirm}
                  required
                />
              </View>

              <View style={styles.inputSpacing}>
                <CustomInput
                  label="Tipo de conta"
                  required
                  pickerOptions={[
                    { label: "Selecione...", value: "" },
                    { label: "Paciente", value: "paciente" },
                    { label: "Terapeuta", value: "terapeuta" },
                  ]}
                  selectedValue={role}
                  onValueChange={handleRoleChange}
                />
              </View>

              {role && (
                <>
                  <View style={styles.inputSpacing}>
                    <CustomInput
                      label="Nome completo"
                      placeholder="Digite seu nome completo"
                      value={nomeCompleto}
                      onChangeText={setNomeCompleto}
                      required
                    />
                  </View>

                  {isPaciente ? (
                    <>
                      <View style={styles.inputSpacing}>
                        <CustomInput
                          label="Data de nascimento"
                          placeholder="AAAA-MM-DD"
                          value={dataNascimento}
                          onChangeText={setDataNascimento}
                        />
                      </View>
                      <View style={styles.inputSpacing}>
                        <CustomInput
                          label="CPF"
                          placeholder="Digite seu CPF"
                          keyboardType="numeric"
                          value={cpf}
                          onChangeText={setCpf}
                        />
                      </View>
                      <View style={styles.inputSpacing}>
                        <CustomInput
                          label="Sexo"
                          pickerOptions={[
                            { label: "Selecione...", value: "" },
                            { label: "Masculino", value: "masc" },
                            { label: "Feminino", value: "fem" },
                            { label: "Outro", value: "outro" },
                          ]}
                          selectedValue={sexo}
                          onValueChange={setSexo}
                        />
                      </View>
                      <View style={styles.inputSpacing}>
                        <CustomInput
                          label="Nível TEA"
                          pickerOptions={[
                            { label: "Opcional", value: "" },
                            { label: "Nível 1", value: "nivel_1" },
                            { label: "Nível 2", value: "nivel_2" },
                            { label: "Nível 3", value: "nivel_3" },
                          ]}
                          selectedValue={nivelTea}
                          onValueChange={setNivelTea}
                        />
                      </View>
                    </>
                  ) : (
                    <View style={styles.inputSpacing}>
                      <CustomInput
                        label="Documento"
                        placeholder="Opcional"
                        value={documento}
                        onChangeText={setDocumento}
                      />
                    </View>
                  )}
                </>
              )}
            </ScrollView>

            {/* Botões fora do Scroll */}
            <View style={styles.buttonSpacing}>
              <CustomButton
                title="Cadastrar"
                fill
                size="large"
                onPress={handleSignUp}
              />
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já possui uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkText}>Log-In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
