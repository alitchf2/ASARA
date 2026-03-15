import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../styles/theme';
import { BrandedButton } from '../components/BrandedButton';
import { AuthInput } from '../components/AuthInput';

export default function UserSettingsScreen({ navigation, route }: any) {
    // Note: User data and guest check will be implemented in future tasks (3.11, 3.14, 3.15)
    const username = "Placeholder Username"; // Placeholder for task 3.15
    const isGuest = route.params?.guest === true;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (isGuest) {
            Alert.alert(
                "Access Denied",
                "Sign in to access account settings.",
                [
                    { text: "Sign In", onPress: () => navigation.replace("SignIn") },
                    { text: "Cancel", onPress: () => navigation.goBack(), style: "cancel" }
                ]
            );
        }
    }, [isGuest]);

    const handleSignOut = () => {
        // Logic for task 3.10
        console.log("Sign Out pressed");
    };

    const handleEditPassword = () => {
        setIsModalVisible(true);
    };

    const handleModalSubmit = () => {
        console.log("Password submitted:", confirmPassword);
        // Task 3.12: Add validation logic later
        setIsModalVisible(false);
        setConfirmPassword("");
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setConfirmPassword("");
    };

    if (isGuest) {
        return (
            <SafeAreaView style={globalStyles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={28} color={theme.colors.companyBlack} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Account Settings</Text>
                </View>
                <View style={styles.guestContainer}>
                    <Ionicons name="lock-closed-outline" size={60} color={theme.colors.textMuted} />
                    <Text style={styles.guestText}>Please sign in to view your settings.</Text>
                    <BrandedButton
                        title="Sign In"
                        onPress={() => navigation.replace("SignIn")}
                        style={{ width: '60%', marginTop: 20 }}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={28} color={theme.colors.companyBlack} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account Settings</Text>

                {!isGuest && (
                    <TouchableOpacity
                        style={styles.headerEditButton}
                        onPress={handleEditPassword}
                    >
                        <Ionicons name="pencil" size={24} color={theme.colors.companyOrange} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Username</Text>
                    <Text style={styles.usernameText}>{username}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Password</Text>
                    <Text style={styles.passwordMask}>••••••••</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <BrandedButton
                        title="Sign Out"
                        onPress={handleSignOut}
                        variant="primary"
                    />
                </View>
            </View>

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleModalCancel}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
                            style={styles.modalContainer}
                        >
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Confirm Changes</Text>
                                <Text style={styles.modalSubtitle}>Enter your current password to make changes.</Text>
                                
                                <AuthInput 
                                    isPassword
                                    placeholder="Current Password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    containerStyle={styles.modalInput}
                                />

                                <View style={styles.modalActions}>
                                    <BrandedButton 
                                        title="Cancel"
                                        variant="text"
                                        onPress={handleModalCancel}
                                        style={styles.modalButton}
                                        textColor={theme.colors.companyOrange}
                                    />
                                    <BrandedButton 
                                        title="Submit"
                                        onPress={handleModalSubmit}
                                        disabled={confirmPassword.length === 0}
                                        style={styles.modalButton}
                                    />
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: theme.colors.background,
        justifyContent: 'space-between',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.companyBlack,
    },
    headerEditButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionLabel: {
        fontSize: 14,
        color: theme.colors.textMuted,
        marginBottom: 8,
        fontWeight: '500',
    },
    usernameText: {
        fontSize: 18,
        color: theme.colors.textPrimary,
        fontWeight: '600',
    },
    passwordMask: {
        fontSize: 20,
        color: theme.colors.textPrimary,
        letterSpacing: 2,
    },
    buttonContainer: {
        marginTop: 'auto',
        marginBottom: 32,
        gap: 16,
    },
    guestContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    guestText: {
        fontSize: 16,
        color: theme.colors.textMuted,
        textAlign: 'center',
        marginTop: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
    },
    modalContent: {
        backgroundColor: theme.colors.background,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
        marginBottom: 12,
    },
    modalSubtitle: {
        fontSize: 15,
        color: theme.colors.textMuted,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    modalInput: {
        width: '100%',
        marginBottom: 24,
    },
    modalActions: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    modalButton: {
        flex: 1,
    },
});
