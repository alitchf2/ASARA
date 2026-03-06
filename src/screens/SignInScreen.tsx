import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Keyboard,
    TouchableWithoutFeedback, Image, Animated, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useKeyboardScroll } from '../hooks/useKeyboardScroll';
import { authStyles } from '../styles/authStyles';
import { AuthInput } from '../components/AuthInput';

export default function SignInScreen({ navigation }: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const isFormValid = username.trim().length > 0 && password.trim().length > 0;

    const { translateY, setFocusedField } = useKeyboardScroll(65);

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
                            onChangeText={setUsername}
                            onFocus={() => setFocusedField('username')}
                        />
                        <AuthInput
                            isPassword
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            onFocus={() => setFocusedField('password')}
                        />
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
});
