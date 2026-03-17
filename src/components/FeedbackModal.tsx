import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { BrandedButton } from './BrandedButton';

interface FeedbackModalProps {
    visible: boolean;
    title: string;
    subtitle: string;
    iconName: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    titleColor?: string;
    buttonTitle?: string;
    onButtonPress: () => void;
    buttonVariant?: 'primary' | 'secondary' | 'text' | 'destructive';
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
    visible,
    title,
    subtitle,
    iconName,
    iconColor = theme.colors.companyOrange,
    titleColor = theme.colors.textPrimary,
    buttonTitle = "Continue",
    onButtonPress,
    buttonVariant = "primary",
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onButtonPress}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Ionicons
                            name={iconName}
                            size={60}
                            color={iconColor}
                            style={{ marginBottom: 16 }}
                        />
                        <Text style={[styles.modalTitle, { color: titleColor }]}>{title}</Text>
                        <Text style={styles.modalSubtitle}>{subtitle}</Text>

                        <BrandedButton
                            title={buttonTitle}
                            onPress={onButtonPress}
                            variant={buttonVariant}
                            style={{ width: '100%' }}
                        />
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
        marginBottom: 12,
    },
    modalSubtitle: {
        fontSize: 15,
        color: theme.colors.textMuted,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
});
