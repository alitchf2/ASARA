import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard,
    TouchableWithoutFeedback, Image, Dimensions, Animated, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
const { width } = Dimensions.get('window');

export default function CreateAccountScreen({ navigation }: any) {
    const translateY = useRef(new Animated.Value(0)).current;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // NEW: Password Validation State
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const hasLength = password.length >= 8;
    const hasUpperLower = /[A-Z]/.test(password) && /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9\s]/.test(password);

    const isPasswordValid = hasLength && hasUpperLower && hasNumber && hasSpecial;

    // Form logic: Everything must be filled and agreed to before submission is allowed.
    const isFormValid = username.trim().length > 0 && isPasswordValid && agreedToTerms;

    // Deterministic state management
    const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

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
            {/* Sticky Header Layer */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={28} color="#2B2A2A" />
                </TouchableOpacity>
            </View>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
                    {/* Logo Section (Upper Third) */}
                    <View style={styles.logoContainer}>
                        <Image source={require('../../assets/ColorfindByASARALogo(Transparent).png')}
                            style={styles.logoImage} resizeMode="contain" />
                    </View>
                    {/* Form Section */}
                    <View style={styles.formContainer}>
                        <Text style={styles.screenTitle}>Create Account</Text>
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
                                onFocus={() => {
                                    setFocusedField('password');
                                    setIsPasswordFocused(true);
                                }}
                                onBlur={() => setIsPasswordFocused(false)}
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

                        {/* Password Validation Section */}
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

                            {isPasswordFocused && (
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

                        {/* Checkbox Section */}
                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}
                                onPress={() => setAgreedToTerms(!agreedToTerms)}
                            >
                                {agreedToTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
                            </TouchableOpacity>
                            <Text style={styles.checkboxText}>
                                I agree to the <Text style={styles.linkText} onPress={() => console.log('Navigate to Terms')}>Terms of Service and Privacy Policy</Text>
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.createButton, !isFormValid && styles.createButtonDisabled]}
                            onPress={() => console.log('Create account action')}
                            disabled={!isFormValid}
                        >
                            <Text style={styles.createButtonText}>Create Account</Text>
                        </TouchableOpacity>
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
    header: {
        height: 60, // Gives enough vertical space for the arrow
        backgroundColor: '#F5F2F2', // Matches background so it blends normally but acts as a mask
        justifyContent: 'center',
        paddingHorizontal: 20,
        zIndex: 10, // Places the header in front of the scrolling animated view
    },
    backButton: {
        // Positioned inside the generic header layout
    },
    logoContainer: {
        flex: 0.3, // Takes up upper third
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -60, // visually offset the header's height to keep the 0.3 flex balanced perfectly like before
    },
    formContainer: {
        flex: 0.7,
        paddingHorizontal: 20,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2B2A2A',
        marginTop: -30, // Pulls the title upwards out of the 0.7 flex box closer to the logo
        marginBottom: 10,
        textAlign: 'center',
    },
    logoImage: {
        width: width * 1,
        height: width * 1,
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
        marginBottom: 8,
    },
    validationContainer: {
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    validationSummary: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    validationSummaryText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#767676',
    },
    validationDetails: {
        position: 'relative',
        marginTop: 6,
        paddingBottom: 4,
    },
    validationBranchLine: {
        position: 'absolute',
        top: -6,
        bottom: 15, // Stops slightly above the bottom to not poke past the last curve
        left: 9,
        width: 2,
        backgroundColor: '#D3D3D3',
    },
    validationRows: {
        paddingLeft: 22,
        gap: 0,
    },
    validationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        paddingVertical: 5,
    },
    curvedBranch: {
        position: 'absolute',
        left: -13,
        width: 13,
        top: 0,
        bottom: '50%',
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderColor: '#D3D3D3',
        borderBottomLeftRadius: 6,
    },
    activeBottomTrunk: {
        position: 'absolute',
        left: -13,
        width: 2,
        top: '50%',
        bottom: 0,
        backgroundColor: '#5A7ACD',
    },
    activeInitialTrunk: {
        position: 'absolute',
        left: -13,
        width: 2,
        top: -6,
        bottom: '100%',
        backgroundColor: '#5A7ACD',
    },
    validationIcon: {
        marginRight: 6,
        backgroundColor: '#F5F2F2',
    },
    validationRowText: {
        flex: 1, // Replaced padding to not overlap
        fontSize: 13,
        color: '#767676',
    },
    passwordInput: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    eyeIcon: {
        marginLeft: 10,
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
    }
});
