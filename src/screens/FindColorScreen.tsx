import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Linking, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authStyles } from '../styles/authStyles';

export default function FindColorScreen() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                // Silently re-check permissions when coming back from background/settings
                requestPermission();
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [requestPermission]);

    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <SafeAreaView style={authStyles.container}>
                <View style={styles.permissionContainer}>
                    <Ionicons name="camera-outline" size={80} color="#FEB05D" style={styles.icon} />
                    <Text style={styles.permissionTitle}>Camera Access Required</Text>
                    <Text style={styles.permissionMessage}>
                        {permission.canAskAgain
                            ? "Colorfind needs access to your camera to identify colors in the real world."
                            : "Camera access has been denied. Please open your device settings to grant camera access to Colorfind."}
                    </Text>
                    <TouchableOpacity
                        style={styles.grantButton}
                        onPress={() => permission.canAskAgain ? requestPermission() : Linking.openSettings()}
                    >
                        <Text style={styles.grantButtonText}>
                            {permission.canAskAgain ? "Grant Permission" : "Open Settings"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1 },

    // Permission Screen Styles
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    icon: {
        marginBottom: 20,
    },
    permissionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2B2A2A',
        marginBottom: 10,
        textAlign: 'center',
    },
    permissionMessage: {
        fontSize: 16,
        color: '#4A4A4A',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    grantButton: {
        backgroundColor: '#5A7ACD',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    grantButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});