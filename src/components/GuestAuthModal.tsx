import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { BrandedButton } from './BrandedButton';

interface GuestAuthModalProps {
    visible: boolean;
    title: string;
    onClose: () => void;
    onSignIn: () => void;
}

/**
 * GuestAuthModal is shown when a guest user tries to access restricted features.
 * It provides a "Sign In" button and is dismissible (X button or tapping outside).
 */
export const GuestAuthModal: React.FC<GuestAuthModalProps> = ({
    visible,
    title,
    onClose,
    onSignIn,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            {/* Close Button (X) */}
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Ionicons name="close" size={24} color={theme.colors.textMuted} />
                            </TouchableOpacity>

                            {/* Icon Stack for Lock with Keyhole */}
                            <View style={styles.iconStack}>
                                <Ionicons name="lock-closed-outline" size={80} color={theme.colors.companyOrange} />
                                <View style={styles.keyholeContainer}>
                                    <View style={styles.keyholeTop} />
                                    <View style={styles.keyholeBottom} />
                                </View>
                            </View>

                            {/* Content */}
                            <Text style={styles.modalTitle}>{title}</Text>
                            
                            <BrandedButton
                                title="Sign In"
                                onPress={onSignIn}
                                style={styles.signInButton}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: theme.colors.background,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
        padding: 4,
    },
    iconStack: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        position: 'relative',
    },
    keyholeContainer: {
        position: 'absolute',
        top: '60%',
        alignItems: 'center',
    },
    keyholeTop: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.companyOrange,
    },
    keyholeBottom: {
        width: 4,
        height: 8,
        backgroundColor: theme.colors.companyOrange,
        marginTop: -2,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 24,
    },
    signInButton: {
        width: '100%',
    },
});
