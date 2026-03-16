import React from 'react';
import { View, Text, StyleSheet, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { BrandedButton } from './BrandedButton';
import { AuthInput } from './AuthInput';

interface ActionModalProps {
    visible: boolean;
    title: string;
    subtitle: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    // Input props
    inputValue: string;
    onInputChange: (text: string) => void;
    inputPlaceholder?: string;
    isPasswordInput?: boolean;
    // Action props
    primaryButtonTitle: string;
    onPrimaryAction: () => void;
    primaryButtonVariant?: 'primary' | 'secondary' | 'text' | 'destructive';
    isPrimaryDisabled?: boolean;
    cancelButtonTitle?: string;
    onCancelAction: () => void;
    cancelButtonVariant?: 'text' | 'secondary' | 'primary';
    cancelButtonTextColor?: string;
}

export const ActionModal: React.FC<ActionModalProps> = ({
    visible,
    title,
    subtitle,
    iconName,
    inputValue,
    onInputChange,
    inputPlaceholder = "Password",
    isPasswordInput = true,
    primaryButtonTitle,
    onPrimaryAction,
    primaryButtonVariant = "primary",
    isPrimaryDisabled = false,
    cancelButtonTitle = "Cancel",
    onCancelAction,
    cancelButtonVariant = "text",
    cancelButtonTextColor = theme.colors.companyOrange,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancelAction}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
                        style={styles.modalContainer}
                    >
                        <View style={styles.modalContent}>
                            {iconName && (
                                <Ionicons
                                    name={iconName}
                                    size={40}
                                    color={theme.colors.companyOrange}
                                    style={{ marginBottom: 16 }}
                                />
                            )}
                            <Text style={styles.modalTitle}>{title}</Text>
                            <Text style={styles.modalSubtitle}>{subtitle}</Text>

                            <AuthInput
                                isPassword={isPasswordInput}
                                placeholder={inputPlaceholder}
                                value={inputValue}
                                onChangeText={onInputChange}
                                containerStyle={styles.modalInput}
                            />

                            <View style={styles.modalActions}>
                                <BrandedButton
                                    title={cancelButtonTitle}
                                    variant={cancelButtonVariant}
                                    onPress={onCancelAction}
                                    style={styles.modalButton}
                                    textColor={cancelButtonTextColor}
                                />
                                <BrandedButton
                                    title={primaryButtonTitle}
                                    variant={primaryButtonVariant}
                                    onPress={onPrimaryAction}
                                    disabled={isPrimaryDisabled}
                                    style={styles.modalButton}
                                />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
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
