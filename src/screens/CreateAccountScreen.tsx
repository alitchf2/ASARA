import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useKeyboardScroll } from "../hooks/useKeyboardScroll";
import { globalStyles } from "../styles/globalStyles";
import { theme } from "../styles/theme";
import { BrandedButton } from "../components/BrandedButton";
import { AuthInput } from "../components/AuthInput";
import { PasswordRequirements } from "../components/PasswordRequirements";
import { validatePasswordStrength } from "../utils/validators";

export default function CreateAccountScreen({ navigation }: any) {
  const { translateY, setFocusedField } = useKeyboardScroll(65);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // NEW: Password Validation State
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const { isValid: isPasswordValid } = validatePasswordStrength(password);

  // Form logic: Everything must be filled and agreed to before submission is allowed.
  const isFormValid =
    username.trim().length > 0 && isPasswordValid && agreedToTerms;

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Sticky Header Layer */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color={theme.colors.companyBlack}
          />
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
          {/* Logo Section (Upper Third) */}
          <View style={[globalStyles.logoContainer, { marginTop: -60 }]}>
            <Image
              source={require("../../assets/ColorfindByASARALogo(Transparent).png")}
              style={globalStyles.logoImage}
              resizeMode="contain"
            />
          </View>
          {/* Form Section */}
          <View style={globalStyles.formContainer}>
            <Text style={globalStyles.screenTitle}>Create Account</Text>
            <AuthInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              onFocus={() => setFocusedField("username")}
            />
            <AuthInput
              isPassword
              containerStyle={{ marginBottom: 8 }}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              onFocus={() => {
                setFocusedField("password");
                setIsPasswordFocused(true);
              }}
              onBlur={() => setIsPasswordFocused(false)}
            />

            {/* Password Validation Section */}
            <PasswordRequirements password={password} isFocused={isPasswordFocused} />
            {/* Checkbox Section */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  agreedToTerms && styles.checkboxChecked,
                ]}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
              >
                {agreedToTerms && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxText}>
                I agree to the{" "}
                <Text
                  style={styles.linkText}
                  onPress={() => navigation.navigate("TermsOfService")}
                >
                  Terms of Service and Privacy Policy
                </Text>
              </Text>
            </View>
            {/* Create Account Button */}
            <BrandedButton
              title="Create Account"
              onPress={() => navigation.replace("MainTabs")}
              disabled={!isFormValid}
              style={{ marginTop: 10, marginBottom: 20 }}
            />
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60, // Gives enough vertical space for the arrow
    backgroundColor: "#F5F2F2", // Matches background so it blends normally but acts as a mask
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: 10, // Places the header in front of the scrolling animated view
  },
  backButton: {
    // Positioned inside the generic header layout
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: theme.colors.companyBlack,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#5A7ACD",
    borderColor: "#5A7ACD",
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.companyBlack,
  },
  linkText: {
    color: theme.colors.companyBlue,
    textDecorationLine: "underline",
  },
});
