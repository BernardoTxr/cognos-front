import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import { Colors, Fonts, Spacing } from "../themes";
import { Ionicons } from "@expo/vector-icons";

interface CustomInputProps extends TextInputProps {
  label?: string;
  spanText?: string;
  containerStyle?: object;
  inputStyle?: object;
  spanStyle?: object;
  secure?: boolean;
  required?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  spanText,
  containerStyle,
  inputStyle,
  spanStyle,
  secure = false,
  required = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(!secure);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <KeyboardAvoidingView style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
        </Text>
        )}
      <View
        style={[
          styles.inputWrapper,
          { borderColor: isFocused ? Colors.primary : Colors.muted },
        ]}
      >
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={Colors.muted}
          secureTextEntry={!isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        {secure && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
      {spanText && <Text style={[styles.spanText, spanStyle]}>{spanText}</Text>}
    </KeyboardAvoidingView>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginVertical: Spacing.small,
    margin: Spacing.small,
  },
  label: {
    fontSize: Fonts.size.medium,
    fontFamily: Fonts.medium,
    color: Colors.text,
    marginBottom: Spacing.xsmall,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: Spacing.boderRadius,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.background.ligth,
  },
  input: {
    flex: 1,
    height: 48,
    fontFamily: Fonts.regular,
    fontSize: Fonts.size.medium,
    color: Colors.text,
  },
  icon: {
    marginLeft: 8,
  },
  spanText: {
    marginTop: Spacing.xsmall,
    fontSize: Fonts.size.small,
    color: Colors.danger,
  },
  required: {
    color: Colors.danger,
    fontFamily: Fonts.medium,
  },
});

