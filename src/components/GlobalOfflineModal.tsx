import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export const GlobalOfflineModal: React.FC = () => {
    const { isOffline, checkConnection } = useNetworkStatus();
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleRetry = async () => {
        setIsLoading(true);
        setShowError(false);

        // Artificial delay for better UX feeling
        await new Promise(resolve => setTimeout(resolve, 800));

        const isOnlineNow = await checkConnection();

        if (!isOnlineNow) {
            setShowError(true);
        }
        setIsLoading(false);
    };

    return (
        <Modal
            visible={isOffline}
            transparent={true}
            animationType="fade"
            onRequestClose={() => { }} // Non-dismissible via Android hardware back button
        >
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <Ionicons name="cloud-offline-outline" size={48} color="#FEB05D" style={styles.icon} />
                    <Text style={styles.title}>No Internet Connection</Text>
                    <Text style={styles.message}>
                        Colorfind requires an active internet connection to function. Please check your network settings and try again.
                    </Text>
                    <TouchableOpacity
                        style={[styles.retryButton, isLoading && styles.retryButtonDisabled]}
                        onPress={handleRetry}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.retryButtonText}>Retry</Text>
                        )}
                    </TouchableOpacity>
                    {showError && !isLoading && (
                        <Text style={styles.errorText}>Connection attempt failed.</Text>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Strongly dims the frozen background
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    box: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        width: '100%',
        maxWidth: 340,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    icon: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2B2A2A',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#4A4A4A',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: '#5A7ACD',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        width: '100%',
        height: 48, // Fixed height to prevent Layout Jump when spinning
        justifyContent: 'center',
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    retryButtonDisabled: {
        backgroundColor: '#a0a0a0',
    },
    errorText: {
        color: '#D15858',
        fontSize: 14,
        marginTop: 12,
        textDecorationLine: 'underline',
        textAlign: 'center',
    }
});
