import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Linking, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authStyles } from '../styles/authStyles';

export default function FindColorScreen({ navigation }: any) {
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

    if (!permission) return <View style={styles.container} />;

    return (
        <View style={styles.container}>
            {/* Main Content Layer (Camera or Permission Fallback) */}
            <View style={styles.mainContent}>
                {!permission.granted ? (
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
                ) : (
                    <CameraView style={styles.camera} facing={facing} />
                )}
            </View>

            {/* UI Overlay Layer (Header & Footer) */}
            <View style={styles.overlay} pointerEvents="box-none">
                {/* Global Header Layer */}
                <SafeAreaView style={styles.headerLayer} pointerEvents="box-none">
                    <TouchableOpacity
                        style={[
                            styles.iconButton,
                            !permission.granted && styles.iconButtonDark
                        ]}
                        onPress={() => navigation.navigate('UserSettings')}
                    >
                        <Ionicons 
                            name="person-circle-outline" 
                            size={32} 
                            color={permission.granted ? "white" : "#2B2A2A"} 
                        />
                    </TouchableOpacity>
                </SafeAreaView>

                {/* Footer Layer - Only show if permission is granted */}
                {permission.granted && (
                    <View style={styles.footerLayer} pointerEvents="box-none">
                        <View style={styles.controlsContainer}>
                            {/* Placeholder for Recent Images */}
                            <TouchableOpacity style={styles.secondaryButton}>
                                <Ionicons name="images-outline" size={28} color="white" />
                            </TouchableOpacity>

                            {/* Capture Button */}
                            <TouchableOpacity style={styles.captureButton}>
                                <View style={styles.captureInner} />
                            </TouchableOpacity>

                            {/* Empty view for balance if needed */}
                            <View style={styles.spacer} />
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black' },
    camera: { flex: 1 },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
    },
    headerLayer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    footerLayer: {
        paddingBottom: 40,
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: 30,
    },
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 22,
    },
    iconButtonDark: {
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureInner: {
        width: 66,
        height: 66,
        borderRadius: 33,
        backgroundColor: 'white',
    },
    secondaryButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    spacer: {
        width: 50,
    },
    mainContent: {
        flex: 1,
    },
    
    // Permission Screen Styles
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: '#F5F2F2',
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