import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // 👈 Import necessário
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
  pickerOptions?: { label: string; value: string }[];
  selectedValue?: string;
  onValueChange?: (value: string) => void;
  type?: "text" | "password" | "date"; // 🔹 Novo
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  spanText,
  containerStyle,
  inputStyle,
  spanStyle,
  secure = false,
  required = false,
  pickerOptions,
  selectedValue,
  onValueChange,
  type = "text", // 🔹 default
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(!secure);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const isPicker = !!pickerOptions;
  const isDate = type === "date";

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
        {isPicker ? (
          <Picker
            selectedValue={selectedValue}
            onValueChange={(value) => onValueChange && onValueChange(value)}
            style={[styles.picker, inputStyle]}
            dropdownIconColor={Colors.primary}
          >
            {pickerOptions.map((option, index) => (
              <Picker.Item key={index} label={option.label} value={option.value} />
            ))}
          </Picker>
        ) : (
          <TextInput
            style={[styles.input, inputStyle]}
            placeholderTextColor={Colors.muted}
            secureTextEntry={type === "password" ? !isPasswordVisible : false}
            keyboardType={isDate ? "numeric" : rest.keyboardType}
            {...rest}
          />
        )}

        {secure && !isPicker && type === "password" && (
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
    alignSelf: "center"
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
  picker: {
    flex: 1,
    height: 48,
    color: Colors.text,
    fontFamily: Fonts.regular,
     borderWidth: 0,
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
