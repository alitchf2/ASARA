import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";

interface AuthInputProps extends TextInputProps {
  isPassword?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  isPassword,
  containerStyle,
  style,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  if (isPassword) {
    return (
      <View style={[styles.passwordContainer, containerStyle]}>
        <TextInput
          style={[styles.passwordInput, style]}
          autoCapitalize="none"
          secureTextEntry={!isPasswordVisible}
          {...props}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color={theme.colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TextInput
      style={[styles.input, containerStyle, style]}
      autoCapitalize="none"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.companyBlack,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.companyBlack,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  eyeIcon: {
    marginLeft: 10,
  },
});
