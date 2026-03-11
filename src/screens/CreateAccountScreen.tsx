import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Animated, ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { signUp, signIn } from 'aws-amplify/auth';
import { useKeyboardScroll } from "../hooks/useKeyboardScroll";
import { globalStyles } from "../styles/globalStyles";
import { theme } from "../styles/theme";
import { BrandedButton } from "../components/BrandedButton";
import { AuthInput } from "../components/AuthInput";
import { PasswordRequirements } from "../components/PasswordRequirements";
import { validatePasswordStrength } from "../utils/validators";

export default function CreateAccountScreen({ navigation }: any) {
  const { translateY, setFocusedField } = useKeyboardScroll(65);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [generalError, setGeneralError] = useState('');

    // Password Validation State
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const { isValid: isPasswordValid } = validatePasswordStrength(password);

    // Form logic: Everything must be filled and agreed to before submission is allowed.
    const isFormValid = username.trim().length > 0 && isPasswordValid && agreedToTerms;

    async function handleCreateAccount() {
        if (!isFormValid || loading) return;
        setUsernameError('');
        setGeneralError('');
        setLoading(true);

        try {
            // TODO (Task 3.8): Call /auth/check-username Lambda here before signUp
            // to check DynamoDB for username availability. Cognito will still catch
            // duplicates below as a fallback.

            // Step 1: Sign up with Cognito
            const signUpResult = await signUp({
                username: username.trim(),
                password,
                options: {
                    userAttributes: {}, // username-only — no email collected
                },
            });

            // Step 2: Sign in using USER_PASSWORD_AUTH (bypasses SRP crypto — required for Expo)
            if (signUpResult.isSignUpComplete) {
                const signInResult = await signIn({
                    username: username.trim(),
                    password,
                    options: {
                        authFlowType: 'USER_PASSWORD_AUTH',
                    },
                });

                if (signInResult.isSignedIn) {
                    // TODO (Task 3.5 / 2.1): Write user record to DynamoDB Users table here
                    // { userID: Cognito sub, username, createdAt } via SaveUser Lambda

                    navigation.replace('MainTabs');
                }
            } else {
                setGeneralError('Something went wrong. Please try again.');
            }
        } catch (err: any) {
            if (
                err.name === 'UsernameExistsException' ||
                err.message?.toLowerCase().includes('already exists')
            ) {
                setUsernameError('That username is already in use.');
            } else if (err.name === 'InvalidPasswordException') {
                setGeneralError('Password does not meet requirements.');
            } else {
                setGeneralError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateAccount() {
        if (!isFormValid || loading) return;
        setUsernameError('');
        setGeneralError('');
        setLoading(true);

        try {
            // TODO (Task 3.8): Call /auth/check-username Lambda here before signUp
            // to check DynamoDB for username availability. Cognito will still catch
            // duplicates below as a fallback.

            // Step 1: Sign up with Cognito
            const { isSignUpComplete } = await signUp({
                username: username.trim(),
                password,
                options: {
                    userAttributes: {}, // username-only — no email collected
                },
            });

            // Step 2: Auto sign in immediately after successful sign up
            if (isSignUpComplete) {
                await signIn({
                    username: username.trim(),
                    password,
                });

                // TODO (Task 3.5 / 2.1): Write user record to DynamoDB Users table here
                // { userID: Cognito sub, username, createdAt } via SaveUser Lambda

                navigation.replace('MainTabs');
            }
        } catch (err: any) {
            if (
                err.name === 'UsernameExistsException' ||
                err.message?.toLowerCase().includes('already exists')
            ) {
                setUsernameError('That username is already in use.');
            } else if (err.name === 'InvalidPasswordException') {
                setGeneralError('Password does not meet requirements.');
            } else {
                setGeneralError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

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
              onChangeText={(text) => { setUsername(text); setUsernameError(''); setGeneralError(''); }}
              onFocus={() => setFocusedField("username")}
            />
                        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
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
                        {(isPasswordFocused || (password.length > 0 && !isPasswordValid) || isPasswordValid) && (
                            <View style={styles.validationContainer}>
                                <View style={styles.validationSummary}>
                                    <Ionicons
                                        name={isPasswordValid ? "checkmark-circle" : "close-circle-outline"}
                                        size={20}
                                        color={isPasswordValid ? "#5A7ACD" : "#767676"}
                                    />
                                    <Text style={[styles.validationSummaryText, isPasswordValid && { color: "#5A7ACD" }]}>
                                        {isPasswordValid ? "password is valid" : "password is not valid"}
                                    </Text>
                                </View>

                                {(!isPasswordValid || isPasswordFocused) && (
                                    <View style={styles.validationDetails}>
                                        <View style={styles.validationBranchLine} />
                                        <View style={styles.validationRows}>
                                            <View style={styles.validationRow}>
                                                {hasLength && <View style={styles.activeInitialTrunk} />}
                                                <View style={[styles.curvedBranch, hasLength && { borderColor: "#5A7ACD" }]} />
                                                {hasLength && hasUpperLower && <View style={styles.activeBottomTrunk} />}
                                                <Ionicons name={hasLength ? "checkmark-circle" : "ellipse-outline"} size={16} color={hasLength ? "#5A7ACD" : "#767676"} style={styles.validationIcon} />
                                                <Text style={[styles.validationRowText, hasLength && { color: "#5A7ACD" }]}>Must be at least 8 characters long</Text>
                                            </View>
                                            <View style={styles.validationRow}>
                                                <View style={[styles.curvedBranch, hasUpperLower && { borderColor: "#5A7ACD" }]} />
                                                {hasUpperLower && hasNumber && <View style={styles.activeBottomTrunk} />}
                                                <Ionicons name={hasUpperLower ? "checkmark-circle" : "ellipse-outline"} size={16} color={hasUpperLower ? "#5A7ACD" : "#767676"} style={styles.validationIcon} />
                                                <Text style={[styles.validationRowText, hasUpperLower && { color: "#5A7ACD" }]}>Must contain an uppercase and lowercase letter (A, z)</Text>
                                            </View>
                                            <View style={styles.validationRow}>
                                                <View style={[styles.curvedBranch, hasNumber && { borderColor: "#5A7ACD" }]} />
                                                {hasNumber && hasSpecial && <View style={styles.activeBottomTrunk} />}
                                                <Ionicons name={hasNumber ? "checkmark-circle" : "ellipse-outline"} size={16} color={hasNumber ? "#5A7ACD" : "#767676"} style={styles.validationIcon} />
                                                <Text style={[styles.validationRowText, hasNumber && { color: "#5A7ACD" }]}>Must contain a number</Text>
                                            </View>
                                            <View style={styles.validationRow}>
                                                <View style={[styles.curvedBranch, hasSpecial && { borderColor: "#5A7ACD" }]} />
                                                <Ionicons name={hasSpecial ? "checkmark-circle" : "ellipse-outline"} size={16} color={hasSpecial ? "#5A7ACD" : "#767676"} style={styles.validationIcon} />
                                                <Text style={[styles.validationRowText, hasSpecial && { color: "#5A7ACD" }]}>Must contain a special character (!, %, @, #, etc.)</Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}
                        {/* General error (e.g. network failure) */}
                        {generalError ? <Text style={styles.errorText}>{generalError}</Text> : null}

                        {/* Checkbox Section */}
                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}
                                onPress={() => setAgreedToTerms(!agreedToTerms)}
                            >
                                {agreedToTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
                            </TouchableOpacity>
                            <Text style={styles.checkboxText}>
                                I agree to the <Text style={styles.linkText} onPress={() => navigation.navigate('TermsOfService')}>Terms of Service and Privacy Policy</Text>
                            </Text>
                        </View>
                        {/* Create Account Button */}
                        <TouchableOpacity
                            style={[styles.createButton, (!isFormValid || loading) && styles.createButtonDisabled]}
                            onPress={handleCreateAccount}
                            disabled={!isFormValid || loading}
                        >
                            {loading
                                ? <ActivityIndicator color="#fff" />
                                : <Text style={styles.createButtonText}>Create Account</Text>
                            }
                        </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingRight: 10,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: '#2B2A2A',
        borderRadius: 4,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#5A7ACD',
        borderColor: '#5A7ACD',
    },
    checkboxText: {
        flex: 1,
        fontSize: 14,
        color: '#2B2A2A',
    },
    linkText: {
        color: '#5A7ACD',
        textDecorationLine: 'underline',
    },
    createButton: {
        backgroundColor: '#5A7ACD',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    createButtonDisabled: {
        backgroundColor: '#a0a0a0',
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 14,
        marginBottom: 8,
        marginTop: -4,
    },
});
