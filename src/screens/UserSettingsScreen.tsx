import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../styles/theme';
import { BrandedButton } from '../components/BrandedButton';
import { AuthInput } from '../components/AuthInput';
import { PasswordRequirements } from '../components/PasswordRequirements';

export default function UserSettingsScreen({ navigation, route }: any) {
    // Current "Live" data (Placeholders for Task 3.14/3.15)
    const [username, setUsername] = useState("Placeholder Username");
    const [password, setPassword] = useState("placeHolderPassword123!"); // Valid test password
    const isGuest = route.params?.guest === true;

    // Security Gate Modal State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    // Edit Mode State
    const [isEditMode, setIsEditMode] = useState(false);
    const [tempUsername, setTempUsername] = useState("");
    const [tempPassword, setTempPassword] = useState("");
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    // Delete Account Flow State
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deleteConfirmPassword, setDeleteConfirmPassword] = useState("");
    const [isDeleteSuccessModalVisible, setIsDeleteSuccessModalVisible] = useState(false);

    // Success & Confirmation Modal State
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [isConfirmSaveModalVisible, setIsConfirmSaveModalVisible] = useState(false);

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
        console.log("Sign Out pressed");
        // TODO: Add API code to invalidate the session/token here
        
        // Reset the navigation stack to the Sign In screen
        navigation.replace("SignIn");
    };

    const handleEditIconPress = () => {
        setIsModalVisible(true);
    };

    const handleModalSubmit = () => {
        console.log("Security password submitted:", confirmPassword);
        // Security gate passed, enter edit mode
        setIsModalVisible(false);
        setConfirmPassword("");

        // Initialize temp values with current values
        setTempUsername(username);
        setTempPassword(password); // Pre-fill with actual password for testing
        setIsEditMode(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setConfirmPassword("");
    };

    const handleSaveEditPress = () => {
        if (isSaveDisabled) return;
        setIsConfirmSaveModalVisible(true);
    };

    const handleConfirmSaveSubmit = () => {
        console.log("Saving changes...");
        // TODO: Add API code to change the actual database here (Task 3.16)

        setUsername(tempUsername);
        setPassword(tempPassword); // Update current password

        setIsConfirmSaveModalVisible(false);
        setIsEditMode(false);
        setTempPassword("");
        setIsSuccessModalVisible(true);
    };

    const handleConfirmSaveCancel = () => {
        setIsConfirmSaveModalVisible(false);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setTempUsername("");
        setTempPassword("");
    };

    const handleSuccessModalClose = () => {
        setIsSuccessModalVisible(false);
    };

    const handleDeleteAccountPress = () => {
        setIsDeleteModalVisible(true);
    };

    const handleDeleteModalSubmit = () => {
        console.log("DELETING ACCOUNT with password:", deleteConfirmPassword);
        // TODO: Add API code to delete the actual account (Task 3.17)
        setIsDeleteModalVisible(false);
        setDeleteConfirmPassword("");
        setIsDeleteSuccessModalVisible(true);
    };

    const handleDeleteModalCancel = () => {
        setIsDeleteModalVisible(false);
        setDeleteConfirmPassword("");
    };

    const handleDeleteSuccessModalClose = () => {
        setIsDeleteSuccessModalVisible(false);
        navigation.replace("SignIn");
    };

    // Validation helpers
    // Note: tempPassword starts as the current password, so hasChanges will correctly track diffs
    const hasChanges = tempUsername !== username || tempPassword !== password;

    const validatePassword = (p: string) => {
        const hasLength = p.length >= 8;
        const hasUpperLower = /[A-Z]/.test(p) && /[a-z]/.test(p);
        const hasNumber = /[0-9]/.test(p);
        const hasSpecial = /[^A-Za-z0-9\s]/.test(p);
        return hasLength && hasUpperLower && hasNumber && hasSpecial;
    };

    const isSaveDisabled =
        !hasChanges ||
        tempUsername.trim().length === 0 ||
        !validatePassword(tempPassword);

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
                    onPress={() => isEditMode ? handleCancelEdit() : navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={28} color={theme.colors.companyBlack} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account Settings</Text>

                {!isGuest && !isEditMode && (
                    <TouchableOpacity
                        style={styles.headerEditButton}
                        onPress={handleEditIconPress}
                    >
                        <Ionicons name="pencil" size={24} color={theme.colors.companyOrange} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Username</Text>
                    {isEditMode ? (
                        <AuthInput
                            value={tempUsername}
                            onChangeText={setTempUsername}
                            placeholder="Username"
                        />
                    ) : (
                        <Text style={styles.usernameText}>{username}</Text>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Password</Text>
                    {isEditMode ? (
                        <View>
                            <AuthInput
                                isPassword
                                value={tempPassword}
                                onChangeText={setTempPassword}
                                placeholder="New Password"
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                            />
                            <PasswordRequirements
                                password={tempPassword}
                                isFocused={isPasswordFocused}
                            />
                        </View>
                    ) : (
                        <Text style={styles.passwordMask}>
                            {"•".repeat(password.length)}
                        </Text>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    {isEditMode ? (
                        <>
                            <BrandedButton
                                title="Save"
                                onPress={handleSaveEditPress}
                                disabled={isSaveDisabled}
                            />
                            <BrandedButton
                                title="Delete Account"
                                variant="primary"
                                onPress={handleDeleteAccountPress}
                                style={{ marginTop: 8 }}
                            />
                        </>
                    ) : (
                        <BrandedButton
                            title="Sign Out"
                            onPress={handleSignOut}
                            variant="primary"
                        />
                    )}
                </View>
            </ScrollView>

            {/* Enable Editing Modal */}
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
                                <Text style={styles.modalTitle}>Enable Editing</Text>
                                <Text style={styles.modalSubtitle}>Enter your current password to edit your account.</Text>

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

            {/* Delete Account Password Modal */}
            <Modal
                visible={isDeleteModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleDeleteModalCancel}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
                            style={styles.modalContainer}
                        >
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Confirm Deletion</Text>
                                <Text style={styles.modalSubtitle}>Enter your password to permanently delete your account. This action cannot be undone.</Text>

                                <AuthInput
                                    isPassword
                                    placeholder="Password"
                                    value={deleteConfirmPassword}
                                    onChangeText={setDeleteConfirmPassword}
                                    containerStyle={styles.modalInput}
                                />

                                <View style={styles.modalActions}>
                                    <BrandedButton
                                        title="Cancel"
                                        variant="text"
                                        onPress={handleDeleteModalCancel}
                                        style={styles.modalButton}
                                        textColor={theme.colors.companyOrange}
                                    />
                                    <BrandedButton
                                        title="Delete Account"
                                        variant="primary"
                                        onPress={handleDeleteModalSubmit}
                                        disabled={deleteConfirmPassword.length === 0}
                                        style={styles.modalButton}
                                    />
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Success Feedback Modal */}
            <Modal
                visible={isSuccessModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleSuccessModalClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Ionicons
                                name="checkmark-circle"
                                size={60}
                                color={theme.colors.companyOrange}
                                style={{ marginBottom: 16 }}
                            />
                            <Text style={styles.modalTitle}>Changes Saved</Text>
                            <Text style={styles.modalSubtitle}>Your account settings have been successfully updated.</Text>

                            <BrandedButton
                                title="Continue"
                                onPress={handleSuccessModalClose}
                                style={{ width: '100%' }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Confirm Save Modal */}
            <Modal
                visible={isConfirmSaveModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleConfirmSaveCancel}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Ionicons
                                name="save-outline"
                                size={40}
                                color={theme.colors.companyOrange}
                                style={{ marginBottom: 16 }}
                            />
                            <Text style={styles.modalTitle}>Save Changes?</Text>
                            <Text style={styles.modalSubtitle}>Are you sure you want to update your account settings?</Text>

                            <View style={styles.modalActions}>
                                <BrandedButton
                                    title="Cancel"
                                    variant="text"
                                    onPress={handleConfirmSaveCancel}
                                    style={styles.modalButton}
                                    textColor={theme.colors.companyOrange}
                                />
                                <BrandedButton
                                    title="Save"
                                    onPress={handleConfirmSaveSubmit}
                                    style={styles.modalButton}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Delete Success Modal */}
            <Modal
                visible={isDeleteSuccessModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleDeleteSuccessModalClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Ionicons
                                name="trash-outline"
                                size={60}
                                color={theme.colors.companyOrange}
                                style={{ marginBottom: 16 }}
                            />
                            <Text style={[styles.modalTitle, { color: theme.colors.companyBlack }]}>Account Deleted</Text>
                            <Text style={styles.modalSubtitle}>Your account has been successfully removed.</Text>

                            <BrandedButton
                                title="OK"
                                onPress={handleDeleteSuccessModalClose}
                                style={{ width: '100%' }}
                            />
                        </View>
                    </View>
                </View>
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
        paddingHorizontal: 24,
        paddingTop: 24,
        flexGrow: 1,
    },
    section: {
        marginBottom: 24,
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
        gap: 8,
    },
    rowButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    flexButton: {
        flex: 1,
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
