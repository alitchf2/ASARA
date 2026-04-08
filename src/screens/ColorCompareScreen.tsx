import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../styles/theme";
import { ImmersiveHeader } from "../components/ImmersiveHeader";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ColorCompareScreen({ route, navigation }: any) {
  const { sourceColor } = route.params || {};

  const [targetColor, setTargetColor] = useState<any>(null);
  const [isSelectionVisible, setIsSelectionVisible] = useState(false);

  // Constants for "THE Thumbnail" (matched to Results page logic)
  const THUMB_SIZE = Math.min(160, (SCREEN_WIDTH - 60) / 2);

  const offsets = useMemo(() => {
    if (!sourceColor.marker || !sourceColor.displayDimensions) return null;
    
    const { x, y } = sourceColor.marker;
    const containerWidth = sourceColor.displayDimensions.width;
    const containerHeight = sourceColor.displayDimensions.height;

    // Ideal top-left of the clipping window (relative to original size)
    const refThumbSize = 200; // The standard from results page
    let left = x - refThumbSize / 2;
    let top = y - refThumbSize / 2;

    // Clamp to boundaries
    left = Math.max(0, Math.min(containerWidth - refThumbSize, left));
    top = Math.max(0, Math.min(containerHeight - refThumbSize, top));

    // Calculate scale between display and standard
    const scale = THUMB_SIZE / refThumbSize;

    return {
      imgLeft: -left * scale,
      imgTop: -top * scale,
      markerX: (x - left) * scale,
      markerY: (y - top) * scale,
      imgWidth: sourceColor.displayDimensions.width * scale,
      imgHeight: sourceColor.displayDimensions.height * scale,
    };
  }, [sourceColor, THUMB_SIZE]);

  return (
    <View style={styles.container}>
      <ImmersiveHeader 
        title="Compare Colors" 
        onBack={() => navigation.goBack()} 
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Comparison Panels Side-by-Side */}
        <View style={styles.panelsContainer}>
          {/* Left Panel: Original */}
          <View style={styles.panel}>
            <Text style={styles.panelLabel}>ORIGINAL</Text>
            <View style={styles.card}>
              <View style={[styles.thumbnailContainer, { width: THUMB_SIZE, height: THUMB_SIZE }]}>
                {offsets ? (
                  <View style={styles.clippingBox}>
                    <Image 
                      source={{ uri: sourceColor.photoUri }} 
                      style={[
                        styles.zoomedImage,
                        {
                          width: offsets.imgWidth,
                          height: offsets.imgHeight,
                          left: offsets.imgLeft,
                          top: offsets.imgTop,
                        }
                      ]}
                      resizeMode="cover"
                    />
                    {/* Precise Selection Marker Overlay */}
                    <View
                      style={[
                        styles.miniMarker,
                        { left: offsets.markerX - 10, top: offsets.markerY - 10 }
                      ]}
                      pointerEvents="none"
                    >
                      <View style={styles.miniCenter} />
                    </View>
                  </View>
                ) : (
                  <Image source={{ uri: sourceColor.photoUri }} style={styles.thumbnail} resizeMode="cover" />
                )}
              </View>
              
              <View style={[styles.swatch, { backgroundColor: sourceColor.detectedColor || "#E5A100" }]} />
              
              <View style={styles.cardInfo}>
                <Text style={styles.colorName} numberOfLines={1}>{sourceColor.colorName || "Original"}</Text>
                <Text style={styles.colorFamily}>Yellow</Text>
              </View>

              <View style={styles.metricsContainer}>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>HEX</Text>
                  <Text style={styles.metricValue}>{sourceColor.detectedColor}</Text>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>RGB</Text>
                  <Text style={styles.metricValue}>229 161 0</Text>
                </View>

                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>LAB</Text>
                  <Text style={styles.metricValue}>68.4 12.1 61.8</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.verticalDivider} />

          {/* Right Panel: Compare (Placeholder) */}
          <View style={styles.panel}>
            <Text style={styles.panelLabel}>COMPARE</Text>
            <View style={[styles.placeholderCard, { width: THUMB_SIZE, height: THUMB_SIZE }]}>
              <Ionicons name="color-palette-outline" size={32} color="#DDD" />
              <Text style={styles.placeholderText}>Comparison color will be selected here</Text>
            </View>
          </View>
        </View>

        {/* Hidden comparison details (addressed in future task) */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  panelsContainer: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 30, // Extra air at top
  },
  panel: {
    flex: 1,
    alignItems: "center",
  },
  panelLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#AAA",
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  card: {
    width: "100%",
    alignItems: "center",
  },
  placeholderCard: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E0E0E0", // Slightly darker to be visible on F8F8F8
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  placeholderText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
    lineHeight: 18,
  },
  swatch: {
    width: 80, 
    height: 80,
    borderRadius: 8, 
    borderWidth: 0,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  metricsContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    width: '100%',
    padding: 10,
    marginBottom: 15,
  },
  metricRow: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#AAA',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.companyBlack,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  thumbnailContainer: {
    width: "100%",
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#EEEEEE',
  },
  clippingBox: {
    width: '100%',
    height: '100%',
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  zoomedImage: {
    position: 'absolute',
  },
  miniMarker: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.companyBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  miniCenter: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.companyOrange,
  },
  cardInfo: {
    alignItems: "center",
  },
  colorName: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.companyBlack,
    marginBottom: 2,
  },
  colorFamily: {
    fontSize: 12,
    color: "#888",
    marginBottom: 10,
  },
  metricsList: {
    alignItems: "center",
  },
  metricText: {
    fontSize: 11,
    color: "#666",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    lineHeight: 16,
  },
  tapToChange: {
    marginTop: 15,
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.companyBlue,
    textTransform: "uppercase",
  },
  verticalDivider: {
    width: 1,
    height: "60%",
    backgroundColor: "transparent", // Remove line to fully de-box
    marginHorizontal: 10,
    alignSelf: 'center',
  },
  detailsContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 15,
  },
  scoreSection: {
    marginBottom: 35,
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  percentageBadge: {
    backgroundColor: theme.colors.companyBlue,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentageText: {
    color: "white",
    fontSize: 12,
    fontWeight: "800",
  },
  scoreTrack: {
    height: 10,
    backgroundColor: "#EEE",
    borderRadius: 5,
    overflow: "hidden",
  },
  scoreFill: {
    height: "100%",
    backgroundColor: theme.colors.companyBlue,
  },
  slidersSection: {
    marginBottom: 35,
  },
  sliderRow: {
    marginBottom: 20,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.companyBlack,
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.companyOrange,
  },
  track: {
    height: 4,
    backgroundColor: "#EEE",
    borderRadius: 2,
    justifyContent: "center",
  },
  marker: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.companyBlue,
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summarySection: {
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: "#F8FAFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E0E8FF",
  },
  summaryText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    fontWeight: "500",
  },
});
