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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signIn } from 'aws-amplify/auth';
import { useKeyboardScroll } from "../hooks/useKeyboardScroll";
import { globalStyles } from "../styles/globalStyles";
import { AuthInput } from "../components/AuthInput";
import { BrandedButton } from "../components/BrandedButton";
import { theme } from "../styles/theme";
import { useAuth } from "../contexts/AuthContext";

export default function SignInScreen({ navigation }: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isFormValid = username.trim().length > 0 && password.trim().length > 0;
    const { translateY, setFocusedField } = useKeyboardScroll(65);

    async function handleSignIn() {
        if (!isFormValid || loading) return;
        setError('');
        setLoading(true);

        try {
            const { isSignedIn } = await signIn({
                username: username.trim(),
                password, // never trim or log the password
            });

            if (isSignedIn) {
                navigation.replace('MainTabs');
            }
        } catch (err: any) {
            // NotAuthorizedException = wrong password/username
            // UserNotFoundException = username doesn't exist
            // Both show the same generic message per spec (don't reveal which)
            setError('Incorrect username or password.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={authStyles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
                    {/* Logo Section (Upper Third) */}
                    <View style={authStyles.logoContainer}>
                        <Image source={require('../../assets/ColorfindByASARALogo(Transparent).png')}
                            style={authStyles.logoImage} resizeMode="contain" />
                    </View>
                    {/* Form Section */}
                    <View style={authStyles.formContainer}>
                        <Text style={authStyles.screenTitle}>Sign In</Text>
                        <AuthInput
                            placeholder="Username"
                            value={username}
                            onChangeText={(text) => { setUsername(text); setError(''); }}
                            onFocus={() => setFocusedField('username')}
                        />
                        <AuthInput
                            isPassword
                            placeholder="Password"
                            value={password}
                            onChangeText={(text) => { setPassword(text); setError(''); }}
                            onFocus={() => setFocusedField('password')}
                        />

                        {/* Inline error — clears when user edits either field */}
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity
                            style={[styles.signInButton, (!isFormValid || loading) && styles.signInButtonDisabled]}
                            onPress={handleSignIn}
                            disabled={!isFormValid || loading}
                        >
                            {loading
                                ? <ActivityIndicator color="#fff" />
                                : <Text style={styles.signInButtonText}>Sign In</Text>
                            }
                        </TouchableOpacity>

                        <View style={styles.linksContainer}>
                            <TouchableOpacity onPress={() => navigation.replace('MainTabs', { guest: true })}>
                                <Text style={styles.linkText}>Continue as Guest</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
                                <Text style={styles.linkText}>Create an Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  linksContainer: {
    alignItems: "center",
    gap: 15,
  },
});
