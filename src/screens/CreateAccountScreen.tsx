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

export default function CreateAccountScreen({ navigation }: any) {
  const { translateY, setFocusedField } = useKeyboardScroll(65);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // NEW: Password Validation State
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const hasLength = password.length >= 8;
  const hasUpperLower = /[A-Z]/.test(password) && /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9\s]/.test(password);

  const isPasswordValid = hasLength && hasUpperLower && hasNumber && hasSpecial;

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
            {(isPasswordFocused ||
              (password.length > 0 && !isPasswordValid) ||
              isPasswordValid) && (
              <View style={styles.validationContainer}>
                <View style={styles.validationSummary}>
                  <Ionicons
                    name={
                      isPasswordValid
                        ? "checkmark-circle"
                        : "close-circle-outline"
                    }
                    size={20}
                    color={
                      isPasswordValid
                        ? theme.colors.companyBlue
                        : theme.colors.textMuted
                    }
                  />
                  <Text
                    style={[
                      styles.validationSummaryText,
                      isPasswordValid && { color: theme.colors.companyBlue },
                    ]}
                  >
                    {isPasswordValid
                      ? "password is valid"
                      : "password is not valid"}
                  </Text>
                </View>

                {(!isPasswordValid || isPasswordFocused) && (
                  <View style={styles.validationDetails}>
                    <View style={styles.validationBranchLine} />
                    <View style={styles.validationRows}>
                      <View style={styles.validationRow}>
                        {hasLength && (
                          <View style={styles.activeInitialTrunk} />
                        )}
                        <View
                          style={[
                            styles.curvedBranch,
                            hasLength && {
                              borderColor: theme.colors.companyBlue,
                            },
                          ]}
                        />
                        {hasLength && hasUpperLower && (
                          <View style={styles.activeBottomTrunk} />
                        )}
                        <Ionicons
                          name={
                            hasLength ? "checkmark-circle" : "ellipse-outline"
                          }
                          size={16}
                          color={
                            hasLength
                              ? theme.colors.companyBlue
                              : theme.colors.textMuted
                          }
                          style={styles.validationIcon}
                        />
                        <Text
                          style={[
                            styles.validationRowText,
                            hasLength && { color: theme.colors.companyBlue },
                          ]}
                        >
                          Must be at least 8 characters long
                        </Text>
                      </View>
                      <View style={styles.validationRow}>
                        <View
                          style={[
                            styles.curvedBranch,
                            hasUpperLower && {
                              borderColor: theme.colors.companyBlue,
                            },
                          ]}
                        />
                        {hasUpperLower && hasNumber && (
                          <View style={styles.activeBottomTrunk} />
                        )}
                        <Ionicons
                          name={
                            hasUpperLower
                              ? "checkmark-circle"
                              : "ellipse-outline"
                          }
                          size={16}
                          color={
                            hasUpperLower
                              ? theme.colors.companyBlue
                              : theme.colors.textMuted
                          }
                          style={styles.validationIcon}
                        />
                        <Text
                          style={[
                            styles.validationRowText,
                            hasUpperLower && {
                              color: theme.colors.companyBlue,
                            },
                          ]}
                        >
                          Must contain an uppercase and lowercase letter (A, z)
                        </Text>
                      </View>
                      <View style={styles.validationRow}>
                        <View
                          style={[
                            styles.curvedBranch,
                            hasNumber && {
                              borderColor: theme.colors.companyBlue,
                            },
                          ]}
                        />
                        {hasNumber && hasSpecial && (
                          <View style={styles.activeBottomTrunk} />
                        )}
                        <Ionicons
                          name={
                            hasNumber ? "checkmark-circle" : "ellipse-outline"
                          }
                          size={16}
                          color={
                            hasNumber
                              ? theme.colors.companyBlue
                              : theme.colors.textMuted
                          }
                          style={styles.validationIcon}
                        />
                        <Text
                          style={[
                            styles.validationRowText,
                            hasNumber && { color: theme.colors.companyBlue },
                          ]}
                        >
                          Must contain a number
                        </Text>
                      </View>
                      <View style={styles.validationRow}>
                        <View
                          style={[
                            styles.curvedBranch,
                            hasSpecial && {
                              borderColor: theme.colors.companyBlue,
                            },
                          ]}
                        />
                        <Ionicons
                          name={
                            hasSpecial ? "checkmark-circle" : "ellipse-outline"
                          }
                          size={16}
                          color={
                            hasSpecial
                              ? theme.colors.companyBlue
                              : theme.colors.textMuted
                          }
                          style={styles.validationIcon}
                        />
                        <Text
                          style={[
                            styles.validationRowText,
                            hasSpecial && { color: theme.colors.companyBlue },
                          ]}
                        >
                          Must contain a special character (!, %, @, #, etc.)
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            )}
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
  validationContainer: {
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  validationSummary: {
    flexDirection: "row",
    alignItems: "center",
  },
  validationSummaryText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#767676",
  },
  validationDetails: {
    position: "relative",
    marginTop: 6,
    paddingBottom: 4,
  },
  validationBranchLine: {
    position: "absolute",
    top: -6,
    bottom: 15, // Stops slightly above the bottom to not poke past the last curve
    left: 9,
    width: 2,
    backgroundColor: "#D3D3D3",
  },
  validationRows: {
    paddingLeft: 22,
    gap: 0,
  },
  validationRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    paddingVertical: 5,
  },
  curvedBranch: {
    position: "absolute",
    left: -13,
    width: 13,
    top: 0,
    bottom: "50%",
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: "#D3D3D3",
    borderBottomLeftRadius: 6,
  },
  activeBottomTrunk: {
    position: "absolute",
    left: -13,
    width: 2,
    top: "50%",
    bottom: 0,
    backgroundColor: "#5A7ACD",
  },
  activeInitialTrunk: {
    position: "absolute",
    left: -13,
    width: 2,
    top: -6,
    bottom: "100%",
    backgroundColor: "#5A7ACD",
  },
  validationIcon: {
    marginRight: 6,
    backgroundColor: "#F5F2F2",
  },
  validationRowText: {
    flex: 1, // Replaced padding to not overlap
    fontSize: 13,
    color: theme.colors.textMuted,
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
