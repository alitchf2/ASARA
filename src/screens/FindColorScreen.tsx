import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  AppState,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";
import { useAuth } from "../contexts/AuthContext";
import { savePhoto } from "../utils/photoStorage";
import { ActivityIndicator } from "react-native";
import { Image } from "react-native";

export default function FindColorScreen({ navigation }: any) {
  const { isGuest, showGuestModal } = useAuth();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const cameraRef = useRef<CameraView>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
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

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      // 1. Take the picture
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      if (photo) {
        // 2. Freeze the UI by setting the captured image URI
        setCapturedImage(photo.uri);

        // 3. Save to local FIFO storage
        const savedUri = await savePhoto(photo.uri);

        // 4. Navigate to Object Selection after a short delay for "freeze" effect
        setTimeout(() => {
          navigation.navigate("ObjectSelection", { photoUri: savedUri || photo.uri });
          
          // Reset internal capture state for when they come back
          setIsCapturing(false);
          setCapturedImage(null);
        }, 1200); // 1.2s freeze per Section 3.3 requirement logic
      }
    } catch (error) {
      console.error("Capture failed:", error);
      setIsCapturing(false);
    }
  };

  if (!permission) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      {/* Main Content Layer (Camera or Permission Fallback) */}
      <View style={styles.mainContent}>
        {!permission.granted ? (
          <View style={styles.permissionContainer}>
            <Ionicons
              name="camera-outline"
              size={80}
              color={theme.colors.companyOrange}
              style={styles.icon}
            />
            <Text style={styles.permissionTitle}>Camera Access Required</Text>
            <Text style={styles.permissionMessage}>
              {permission.canAskAgain
                ? "Colorfind needs access to your camera to identify colors in the real world."
                : "Camera access has been denied. Please open your device settings to grant camera access to Colorfind."}
            </Text>
            <TouchableOpacity
              style={styles.grantButton}
              onPress={() =>
                permission.canAskAgain
                  ? requestPermission()
                  : Linking.openSettings()
              }
            >
              <Text style={styles.grantButtonText}>
                {permission.canAskAgain ? "Grant Permission" : "Open Settings"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <CameraView 
              ref={cameraRef}
              style={styles.camera} 
              facing={facing} 
            />
            {/* Freeze Overlay */}
            {capturedImage && (
              <Image 
                source={{ uri: capturedImage }} 
                style={StyleSheet.absoluteFill} 
                resizeMode="cover"
              />
            )}
            {/* Processing Indicator */}
            {isCapturing && !capturedImage && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="white" />
              </View>
            )}
          </View>
        )}
      </View>

      {/* UI Overlay Layer (Header & Footer) */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* Global Header Layer */}
        <SafeAreaView style={styles.headerLayer} pointerEvents="box-none">
          <TouchableOpacity
            style={[
              styles.iconButton,
              !permission.granted && styles.iconButtonDark,
            ]}
            onPress={() => {
              if (isGuest) {
                showGuestModal("Sign in to access account settings.");
              } else {
                navigation.navigate("UserSettings");
              }
            }}
          >
            <Ionicons
              name="person-circle-outline"
              size={32}
              color={
                permission.granted
                  ? theme.colors.companyWhite
                  : theme.colors.companyBlack
              }
            />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Footer Layer - Only show if permission is granted */}
        {permission.granted && (
          <View style={styles.footerLayer} pointerEvents="box-none">
            <View style={styles.controlsContainer}>
              {/* Placeholder for Recent Images */}
              <TouchableOpacity style={styles.secondaryButton}>
                <Ionicons
                  name="images-outline"
                  size={28}
                  color={theme.colors.companyWhite}
                />
              </TouchableOpacity>

              {/* Capture Button */}
              <TouchableOpacity 
                style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
                onPress={handleCapture}
                disabled={isCapturing}
              >
                <View style={[styles.captureInner, isCapturing && styles.captureInnerDisabled]} />
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
  container: { flex: 1, backgroundColor: theme.colors.companyBlack },
  camera: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  headerLayer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  footerLayer: {
    paddingBottom: 110, // Increased to clear the floating tab bar
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: 30,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 22,
  },
  iconButtonDark: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "white",
  },
  secondaryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: theme.colors.background,
  },
  icon: {
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.companyBlack,
    marginBottom: 10,
    textAlign: "center",
  },
  permissionMessage: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  grantButton: {
    backgroundColor: theme.colors.companyBlue,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  grantButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  captureButtonDisabled: {
    borderColor: "rgba(255,255,255,0.5)",
  },
  captureInnerDisabled: {
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
});
