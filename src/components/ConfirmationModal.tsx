import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { BrandedButton } from './BrandedButton';

interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    subtitle: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    primaryButtonTitle: string;
    onPrimaryAction: () => void;
    primaryButtonVariant?: 'primary' | 'secondary' | 'text' | 'destructive';
    cancelButtonTitle?: string;
    onCancelAction: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    title,
    subtitle,
    iconName = "help-circle-outline",
    iconColor = theme.colors.companyOrange,
    primaryButtonTitle,
    onPrimaryAction,
    primaryButtonVariant = "primary",
    cancelButtonTitle = "Cancel",
    onCancelAction,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancelAction}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Ionicons
                            name={iconName}
                            size={50}
                            color={iconColor}
                            style={{ marginBottom: 16 }}
                        />
                        <Text style={styles.modalTitle}>{title}</Text>
                        <Text style={styles.modalSubtitle}>{subtitle}</Text>

                        <View style={styles.modalActions}>
                            <BrandedButton
                                title={cancelButtonTitle}
                                variant="text"
                                onPress={onCancelAction}
                                style={styles.modalButton}
                                textColor={theme.colors.companyOrange}
                            />
                            <BrandedButton
                                title={primaryButtonTitle}
                                variant={primaryButtonVariant}
                                onPress={onPrimaryAction}
                                style={styles.modalButton}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 340,
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
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 15,
        color: theme.colors.textMuted,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
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
