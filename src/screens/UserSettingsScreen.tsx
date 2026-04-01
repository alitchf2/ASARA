import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../styles/theme';
import { BrandedButton } from '../components/BrandedButton';
import { AuthInput } from '../components/AuthInput';
import { PasswordRequirements } from '../components/PasswordRequirements';
import { ActionModal } from '../components/ActionModal';
import { FeedbackModal } from '../components/FeedbackModal';
import { validatePasswordStrength } from '../utils/validators';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { clearRecentPhotos } from '../utils/photoStorage';

export default function UserSettingsScreen({ navigation }: any) {
    const { isGuest, setIsGuest } = useAuth();
    // Current "Live" data (Placeholders for Task 3.14/3.15)
    const [username, setUsername] = useState("Loading...");
    const [password, setPassword] = useState("placeHolderPassword123!"); // Valid test password

    useEffect(() => {
        if (!isGuest) {
            getCurrentUser()
                .then(user => {
                    setUsername(user.username);
                })
                .catch(err => {
                    console.log("Error fetching user:", err);
                    setUsername("Unknown User");
                });
        }
    }, [isGuest]);

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

    // Success Modal State
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    const handleSignOut = async () => {
        try {
            await clearRecentPhotos();
            await signOut();
            setIsGuest(false);
            
            // Reset the navigation stack to the Sign In screen
            navigation.replace("SignIn");
        } catch (error) {
            console.error('Error signing out:', error);
        }
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

        console.log("Saving changes...");
        // TODO: Add API code to change the actual database here (Task 3.16)

        setUsername(tempUsername);
        setPassword(tempPassword); // Update current password

        setIsEditMode(false);
        setTempPassword("");
        setIsSuccessModalVisible(true);
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

    const handleDeleteSuccessModalClose = async () => {
        try {
            await clearRecentPhotos();
        } catch (error) {
            console.error('Error clearing photos on account deletion:', error);
        }
        setIsDeleteSuccessModalVisible(false);
        navigation.replace("SignIn");
    };

    // Validation helpers
    // Note: tempPassword starts as the current password, so hasChanges will correctly track diffs
    const hasChanges = tempUsername !== username || tempPassword !== password;

    const isSaveDisabled =
        !hasChanges ||
        tempUsername.trim().length === 0 ||
        !validatePasswordStrength(tempPassword).isValid;

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
                        onPress={() => {
                            setIsGuest(false);
                            navigation.replace("SignIn");
                        }}
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
            <ActionModal
                visible={isModalVisible}
                title="Enable Editing"
                subtitle="Enter your current password to edit your account."
                inputValue={confirmPassword}
                onInputChange={setConfirmPassword}
                inputPlaceholder="Current Password"
                cancelButtonTitle="Cancel"
                onCancelAction={handleModalCancel}
                primaryButtonTitle="Submit"
                onPrimaryAction={handleModalSubmit}
                isPrimaryDisabled={confirmPassword.length === 0}
            />

            {/* Delete Account Password Modal */}
            <ActionModal
                visible={isDeleteModalVisible}
                title="Confirm Deletion"
                subtitle="Enter your password to permanently delete your account. This action cannot be undone."
                inputValue={deleteConfirmPassword}
                onInputChange={setDeleteConfirmPassword}
                primaryButtonTitle="Delete Account"
                primaryButtonVariant="primary"
                onPrimaryAction={handleDeleteModalSubmit}
                isPrimaryDisabled={deleteConfirmPassword.length === 0}
                onCancelAction={handleDeleteModalCancel}
            />

            {/* Success Feedback Modal */}
            <FeedbackModal
                visible={isSuccessModalVisible}
                title="Changes Saved"
                subtitle="Your account settings have been successfully updated."
                iconName="checkmark-circle"
                onButtonPress={handleSuccessModalClose}
            />



            {/* Delete Success Modal */}
            <FeedbackModal
                visible={isDeleteSuccessModalVisible}
                title="Account Deleted"
                subtitle="Your account has been successfully removed."
                iconName="trash-outline"
                buttonTitle="OK"
                onButtonPress={handleDeleteSuccessModalClose}
            />
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
});
