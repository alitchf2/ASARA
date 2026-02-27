import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Keyboard,
    TouchableWithoutFeedback, Image, Dimensions, Animated, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const { width } = Dimensions.get('window');

export default function SignInScreen({ navigation }: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isFormValid = username.trim().length > 0 && password.trim().length > 0;

    const translateY = useRef(new Animated.Value(0)).current;

    // Deterministic state management
    const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    // Fixed distance between the Username and Password fields
    // Username Height (50) + bottom margin (15) = 65.
    const FIELD_DISTANCE = 65;

    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => setIsKeyboardVisible(true)
        );

        const keyboardWillHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setIsKeyboardVisible(false);
                setFocusedField(null);
            }
        );

        return () => {
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (isKeyboardVisible && focusedField) {
            // When Username is selected, we maintain its natural spot (shift 0).
            // When Password is selected, we shift the entire screen up by exactly the distance 
            // between the two fields (65px) so the Password field sits PERFECTLY in the Username's spot.
            const shiftAmount = focusedField === 'password' ? FIELD_DISTANCE : 0;

            Animated.timing(translateY, {
                toValue: -shiftAmount,
                duration: 250,
                useNativeDriver: true,
            }).start();
        } else if (!isKeyboardVisible) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [isKeyboardVisible, focusedField, translateY]);
    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
                    {/* Logo Section (Upper Third) */}
                    <View style={styles.logoContainer}>
                        <Image source={require('../../assets/ColorfindByASARALogo(Transparent).png')}
                            style={styles.logoImage} resizeMode="contain" />
                    </View>
                    {/* Form Section */}
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            onFocus={() => setFocusedField('username')}
                        />
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!isPasswordVisible}
                                autoCapitalize="none"
                                onFocus={() => setFocusedField('password')}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            >
                                <Ionicons
                                    name={isPasswordVisible ? "eye-off" : "eye"}
                                    size={24}
                                    color="gray"
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={[styles.signInButton, !isFormValid && styles.signInButtonDisabled]}
                            onPress={() => navigation.replace('MainTabs')}
                            disabled={!isFormValid}
                        >
                            <Text style={styles.signInButtonText}>Sign In</Text>
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
    container: {
        flex: 1,
        backgroundColor: '#F5F2F2',
    },
    logoContainer: {
        flex: 0.3, // Takes up upper third
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        flex: 0.7,
        paddingHorizontal: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#2B2A2A',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: '#2B2A2A',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    eyeIcon: {
        marginLeft: 10,
    },
    signInButton: {
        backgroundColor: '#5A7ACD',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linksContainer: {
        alignItems: 'center',
        gap: 15,
    },
    linkText: {
        color: '#5A7ACD',
        fontSize: 16,
    },
    signInButtonDisabled: {
        backgroundColor: '#a0a0a0',
    },
    logoImage: {
        width: width * 1,
        height: width * 1,
    }
});
