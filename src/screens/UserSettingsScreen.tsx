import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../styles/theme';
import { BrandedButton } from '../components/BrandedButton';

export default function UserSettingsScreen({ navigation, route }: any) {
    // Note: User data and guest check will be implemented in future tasks (3.11, 3.14, 3.15)
    const username = "Placeholder Username"; // Placeholder for task 3.15
    const isGuest = route.params?.guest === true;

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

    const handleDeleteAccount = () => {
        // Logic for task 3.13
        console.log("Delete Account pressed");
    };

    const handleEditPassword = () => {
        // Logic for task 3.12
        console.log("Edit Password pressed");
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
});
