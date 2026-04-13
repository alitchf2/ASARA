import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";
import { ImmersiveHeader } from "../components/ImmersiveHeader";
import { ColorSelectionModal } from "../components/ColorSelectionModal";
import { FeedbackModal } from "../components/FeedbackModal";
import { generateComparisonSummary } from "../utils/colorSummary";
import { CompareSlider } from "../components/CompareSlider";
import { ColorMetricsContainer } from "../components/ColorMetricsContainer";
import { AnimatedCircularProgress } from "../components/AnimatedCircularProgress";
import {
  parseLABString,
  hexToLab,
  hexToRgb,
  formatLABString,
  formatRGBString,
  calculateComparisonMetrics,
  ComparisonMetrics
} from "../utils/colorUtils";
import { SavedColor } from "../types/color";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ColorCompareScreen({ route, navigation }: any) {
  const { sourceColor } = route.params || {};
  const [isSelectionModalVisible, setIsSelectionModalVisible] = React.useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = React.useState(false);
  const [compareColor, setCompareColor] = React.useState<SavedColor | null>(null);

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

  const handleSelectCompareColor = (color: SavedColor) => {
    setCompareColor(color);
    // Task 10.3: Comparison calculations would be triggered here
  };

  // Dynamic Metrics for Source Color
  const sourceRGB = useMemo(() => hexToRgb(sourceColor.detectedColor || "#E5A100"), [sourceColor.detectedColor]);
  const sourceLAB = useMemo(() => hexToLab(sourceColor.detectedColor || "#E5A100"), [sourceColor.detectedColor]);

  // Data for sliders & display
  const sourceData = sourceLAB;
  const compareData = useMemo(() => parseLABString(compareColor?.lab), [compareColor]);

  // Integrated Comparison Metrics (Task 10.3)
  const metrics = useMemo(() => {
    if (!compareColor) return null;
    return calculateComparisonMetrics(sourceLAB, compareData);
  }, [sourceLAB, compareData, compareColor]);

  const summaryText = useMemo(() => {
    if (!compareColor || !metrics) {
      return "Select a color from your library to see a detailed visual and technical comparison.";
    }
    return generateComparisonSummary(
      metrics,
      sourceColor.colorName || "The original color",
      compareColor.name
    );
  }, [metrics, compareColor, sourceColor.colorName]);

  const sourceRGBStr = formatRGBString(sourceRGB);
  const sourceLABStr = formatLABString(sourceLAB);

  const compareRGBStr = compareColor?.rgb || "-";
  const compareLABStr = compareColor?.lab || "-";

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

              <ColorMetricsContainer
                hex={sourceColor.detectedColor || "#E5A100"}
                rgb={sourceRGBStr}
                lab={sourceLABStr}
                variant="compact"
              />
            </View>
          </View>

          <View style={styles.verticalDivider} />

          {/* Right Panel: Compare (Placeholder or Selected) */}
          <View style={styles.panel}>
            <Text style={styles.panelLabel}>COMPARE</Text>
            {compareColor ? (
              <TouchableOpacity style={styles.card} onPress={() => setIsSelectionModalVisible(true)}>
                <View style={[styles.thumbnailContainer, { width: THUMB_SIZE, height: THUMB_SIZE }]}>
                  <Image
                    source={typeof compareColor.imageUri === 'string' ? { uri: compareColor.imageUri } : compareColor.imageUri}
                    style={styles.thumbnail}
                    resizeMode="contain"
                  />
                </View>

                <View style={[styles.swatch, styles.swatchCircle, { backgroundColor: compareColor.hex }]} />

                <View style={styles.cardInfo}>
                  <Text style={styles.colorName} numberOfLines={1}>{compareColor.name}</Text>
                  <Text style={styles.colorFamily}>{compareColor.family}</Text>
                </View>

                <ColorMetricsContainer
                  hex={compareColor.hex}
                  rgb={compareRGBStr}
                  lab={compareLABStr}
                  variant="compact"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.placeholderCard, { width: THUMB_SIZE, height: THUMB_SIZE }]}
                onPress={() => setIsSelectionModalVisible(true)}
              >
                <Ionicons name="color-palette-outline" size={32} color="#DDD" />
                <Text style={styles.placeholderText}>Select a color to compare</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Compare Summary (Tasks 10.5 & 10.8) */}
        <View style={styles.summarySection}>
          <TouchableOpacity
            style={styles.sectionHeaderRow}
            onPress={() => setIsInfoModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Compare Summary</Text>
            <Ionicons name="information-circle-outline" size={16} color="#AAA" style={styles.infoIcon} />
          </TouchableOpacity>
          <View style={styles.summaryBox}>
            <View style={styles.summaryScoreLeft}>
              <AnimatedCircularProgress
                percentage={metrics ? metrics.similarityPercent : 0}
                size={68}
                strokeWidth={3}
                color={theme.colors.companyOrange}
                label="MATCH"
              />
            </View>
            <View style={styles.summaryContentRight}>
              <Text style={styles.summaryText}>
                {summaryText}
              </Text>
            </View>
          </View>
        </View>

        {/* Visual Comparison (Sliders) */}
        <View style={styles.comparisonVisuals}>
          <Text style={styles.sectionTitle}>Visual Comparison</Text>

          <CompareSlider
            label="Lightness (L)"
            sourceValue={sourceData.l}
            compareValue={metrics ? metrics.lightnessCompare : null}
            min={0}
            max={100}
            gradientColors={['#000000', '#FFFFFF']}
            sourceHex={sourceColor.detectedColor}
            compareHex={compareColor?.hex}
          />

          <CompareSlider
            label="Red ↔ Green (A)"
            sourceValue={sourceData.a}
            compareValue={metrics ? metrics.aCompare : null}
            min={-128}
            max={127}
            gradientColors={['#00FF00', '#808080', '#FF0000']}
            sourceHex={sourceColor.detectedColor}
            compareHex={compareColor?.hex}
          />

          <CompareSlider
            label="Yellow ↔ Blue (B)"
            sourceValue={sourceData.b}
            compareValue={metrics ? metrics.bCompare : null}
            min={-128}
            max={127}
            gradientColors={['#0000FF', '#808080', '#FFFF00']}
            sourceHex={sourceColor.detectedColor}
            compareHex={compareColor?.hex}
          />

          <CompareSlider
            label="Saturation / Chroma"
            sourceValue={sourceData.chroma}
            compareValue={metrics ? metrics.chromaCompare : null}
            min={0}
            max={180}
            gradientColors={['#808080', '#FF00FF']}
            sourceHex={sourceColor.detectedColor}
            compareHex={compareColor?.hex}
          />
        </View>
      </ScrollView>

      <ColorSelectionModal
        isVisible={isSelectionModalVisible}
        onClose={() => setIsSelectionModalVisible(false)}
        onSelect={handleSelectCompareColor}
      />

      <FeedbackModal
        visible={isInfoModalVisible}
        title="Comparison Science"
        subtitle="ASARA uses the CIE2000 DeltaE formula, the industry standard for perceptual color matching. This advanced math accounts for the non-linear way human eyes see differences in lightness, hue, and saturation. A Match Score of 100% means the colors are mathematically identical, while a score of 98% or higher is considered a perfect match to the naked eye."
        iconName="analytics-outline"
        buttonTitle="Got it"
        onButtonPress={() => setIsInfoModalVisible(false)}
      />
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
    paddingTop: 30,
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
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E0E0E0",
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
  swatchCircle: {
    borderRadius: 40,
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
    marginBottom: 15,
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
  verticalDivider: {
    width: 1,
    height: "60%",
    backgroundColor: "transparent",
    marginHorizontal: 10,
    alignSelf: 'center',
  },
  scoreSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  scoreValue: {
    fontSize: 72,
    fontWeight: '800',
    color: theme.colors.companyBlack,
    letterSpacing: -2,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#AAA',
    letterSpacing: 2,
    marginTop: -8,
  },
  summarySection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  summaryBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryScoreLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 18,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  summaryContentRight: {
    flex: 1,
    paddingLeft: 18,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#444',
    fontWeight: '500',
  },
  comparisonVisuals: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.companyBlack,
    letterSpacing: 1,
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    marginLeft: 6,
    marginTop: -15, // Alignment offset for the title's margin
  },
});
