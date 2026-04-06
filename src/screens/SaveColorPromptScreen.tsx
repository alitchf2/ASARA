import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../styles/theme";
import { ColorMetricsContainer } from "../components/ColorMetricsContainer";
import { post } from "aws-amplify/api";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function SaveColorPromptScreen({ route, navigation }: any) {
  const { 
    photoUri, 
    detectedColor = '#E5A100', 
    marker, 
    displayDimensions,
    colorName = "Unknown Match",
    family = "Color",
    rgbString,
    labString
  } = route.params || {};

  const [name, setName] = useState(colorName);
  const [error, setError] = useState("");

  const THUMB_SIZE = 200;

  // Re-calculate thumbnail offsets (Stable logic from Results screen)
  const offsets = useMemo(() => {
    if (!marker || !displayDimensions) return { left: 0, top: 0, markerX: 0, markerY: 0 };

    const { x, y } = marker;
    const containerWidth = SCREEN_WIDTH;
    const { height: containerHeight } = Dimensions.get('window');

    let left = x - THUMB_SIZE / 2;
    let top = y - THUMB_SIZE / 2;

    left = Math.max(0, Math.min(containerWidth - THUMB_SIZE, left));
    top = Math.max(0, Math.min(containerHeight - THUMB_SIZE, top));

    return {
      left: -left,
      top: -top,
      markerX: x - left,
      markerY: y - top,
    };
  }, [marker, displayDimensions]);


  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name required");
      return;
    }
    
    try {
      setError(""); // Clear previous errors
      
      // STEP 1: Get a secure upload ticket
      console.log("-> Fetching S3 Upload URL...");
      const urlResponse = await post({
        apiName: "colorfindAPI",
        path: "/users/me/savedColors/upload-url",
        options: {
          body: { fileType: 'image/jpeg' }
        }
      }).response;
      
      const urlData = (await urlResponse.body.json()) as any;
      const { uploadUrl, s3Key } = urlData;
      
      // STEP 2: Upload image directly to S3
      console.log("-> Uploading image to S3...", s3Key);
      const fetchResponse = await fetch(photoUri);
      const photoBlob = await fetchResponse.blob();
      
      const uploadResult = await fetch(uploadUrl, {
        method: 'PUT',
        body: photoBlob,
        headers: {
          'Content-Type': 'image/jpeg',
        },
      });

      if (!uploadResult.ok) throw new Error("S3 Upload Failed");

      // STEP 3: Save color record to DynamoDB with imageS3Key
      console.log("-> Saving color metadata to DynamoDB...");
      await post({
        apiName: "colorfindAPI",
        path: "/users/me/savedColors",
        options: {
          body: {
            name: name.trim(),
            hex: detectedColor,
            family: "Yellow", // Temp MVP Default
            imageS3Key: s3Key,
          }
        }
      }).response;

      console.log("-> Save Complete!");

      // Reset the navigation stack
      navigation.reset({
        index: 0,
        routes: [{ 
          name: 'MainTabs', 
          params: { screen: 'SavedColors' } 
        }],
      });
    } catch (err: any) {
      console.error("Save Color Error:", err);
      setError("Cloud sync failed. Please check your connection.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={theme.colors.companyBlack} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Save Color</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Centered Thumbnail Section */}
          <View style={styles.thumbnailOuter}>
            <View style={styles.thumbnailContainer}>
              <Image
                source={{ uri: photoUri }}
                style={[
                  styles.previewImage,
                  {
                    width: displayDimensions?.width || SCREEN_WIDTH,
                    height: displayDimensions?.height || (SCREEN_WIDTH * 0.75),
                    left: offsets.left,
                    top: offsets.top,
                  }
                ]}
                resizeMode="cover"
              />
              <View style={[styles.miniMarker, { left: offsets.markerX - 10, top: offsets.markerY - 10 }]}>
                <View style={styles.miniCenter} />
              </View>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.instruction}>Give this color a name.</Text>

            {/* Identity & Input Section */}
            <View style={styles.identitySection}>
              <View style={[styles.swatch, { backgroundColor: detectedColor }]} />
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, error ? styles.inputError : null]}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (error) setError("");
                  }}
                  placeholder="Enter name..."
                  autoCorrect={false}
                />
                <Text style={styles.familyName}>{family}</Text>
              </View>
            </View>

            {/* Unified Metrics Section */}
            <ColorMetricsContainer
              hex={detectedColor}
              rgb={rgbString || "0, 0, 0"}
              lab={labString || "0, 0, 0"}
              containerStyle={{ marginBottom: 30 }}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text style={styles.saveButtonText}>Save Color</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.companyBlack,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  thumbnailOuter: {
    width: SCREEN_WIDTH,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  thumbnailContainer: {
    width: 200,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#EEEEEE',
  },
  previewImage: {
    position: 'absolute',
  },
  miniMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.companyBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniCenter: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.companyOrange,
  },
  content: {
    padding: 24,
  },
  instruction: {
    fontSize: 18,
    fontWeight: "700",
    color: "#666",
    marginBottom: 20,
  },
  identitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  swatch: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  inputWrapper: {
    marginLeft: 16,
    flex: 1,
  },
  input: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.companyBlack,
    paddingVertical: 4,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.companyBlue,
  },
  inputError: {
    borderBottomColor: theme.colors.destructive,
  },
  familyName: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
  },
  metricsContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    letterSpacing: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.companyBlack,
  },
  errorText: {
    color: theme.colors.destructive,
    fontSize: 14,
    marginBottom: 20,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: theme.colors.companyBlue,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.companyBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: "#CCC",
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
});
