import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { theme } from '../styles/theme';
import { ImmersiveHeader } from '../components/ImmersiveHeader';
import { generateComplementaryTheme, generateAnalogousTheme, generateTriadicTheme, generateMonochromaticTheme } from '../utils/colorThemes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ColorResultsScreen({ route, navigation }: any) {
<<<<<<< HEAD
  const { 
    photoUri, 
    detectedColor = '#E5A100', 
    marker, 
    displayDimensions,
    matchedColor 
=======
  const {
    photoUri,
    detectedColor = '#E5A100',
    marker,
    displayDimensions
>>>>>>> 77a7b42 (added basic color compare screen (task 10.1))
  } = route.params || {};

  const THUMB_SIZE = 200;

  // Calculate thumbnail offsets for centering
  const calculateOffsets = () => {
    if (!marker || !displayDimensions) return { left: 0, top: 0, markerX: 0, markerY: 0 };

    const { x, y } = marker;
    const containerWidth = SCREEN_WIDTH;
    const containerHeight = Dimensions.get('window').height;

    // Ideal top-left of the clipping window
    let left = x - THUMB_SIZE / 2;
    let top = y - THUMB_SIZE / 2;

    // Clamp to boundaries
    left = Math.max(0, Math.min(containerWidth - THUMB_SIZE, left));
    top = Math.max(0, Math.min(containerHeight - THUMB_SIZE, top));

    return {
      left: -left,
      top: -top,
      markerX: x - left,
      markerY: y - top,
    };
  };

  const offsets = calculateOffsets();
  const complementaryTheme = generateComplementaryTheme(detectedColor);
  const analogousTheme = generateAnalogousTheme(detectedColor);
  const triadicTheme = generateTriadicTheme(detectedColor);
  const monochromaticTheme = generateMonochromaticTheme(detectedColor);

  return (
    <View style={styles.container}>
      <ImmersiveHeader
        title="Color Results"
        onBack={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Centered Thumbnail */}
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
            {/* Precise Selection Marker */}
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
        </View>

        <View style={styles.content}>
          {/* Color Swatch & Identity */}
          <View style={styles.identitySection}>
            <View
              style={[
                styles.swatch,
                { backgroundColor: detectedColor }
              ]}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.colorName}>
                {matchedColor?.detailedColorName || matchedColor?.name || matchedColor?.colorName || 'Unknown Match'}
              </Text>
              <Text style={styles.familyName}>{matchedColor?.familyColorName || matchedColor?.familyName || matchedColor?.family || 'Color'}</Text>
            </View>
          </View>

          {/* Metrics Section */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>HEX</Text>
              <Text style={styles.metricValue}>
                {(matchedColor?.hex ? `#${matchedColor.hex}` : detectedColor)?.toUpperCase()}
              </Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>RGB</Text>
              <Text style={styles.metricValue}>
                R: {matchedColor?.rgb?.r || '?'}  G: {matchedColor?.rgb?.g || '?'}  B: {matchedColor?.rgb?.b || '?'}
              </Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>LAB</Text>
              <Text style={styles.metricValue}>
                L: {matchedColor?.lab?.l || '?'}  A: {matchedColor?.lab?.a || '?'}  B: {matchedColor?.lab?.b || '?'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('SaveColorPrompt', {
                detectedColor,
                colorName: matchedColor?.name || matchedColor?.colorName || 'Unknown Match', // Placeholder for Task 5.3
                photoUri,
                marker,
                displayDimensions
              })}
            >
              <Text style={styles.primaryButtonText}>Save Color</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.compareButton}
              onPress={() => navigation.navigate('ColorCompare', {
                sourceColor: {
                  detectedColor,
                  colorName: 'Quercitron', // Placeholder for Task 5.3
                  photoUri,
                  marker,
                  displayDimensions
                }
              })}
            >
              <Text style={styles.compareButtonText}>Compare Color</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.themesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Color Themes</Text>
            </View>

            <View style={styles.themeRowContainer}>
              <Text style={styles.themeLabel}>Complementary</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.swatchRow}
              >
                {complementaryTheme.map((color: string, index: number) => (
                  <View key={`comp-${index}`} style={styles.themeSwatchContainer}>
                    <View style={[styles.themeSwatch, { backgroundColor: color }]} />
                    <Text style={styles.swatchHex}>{color}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.themeRowContainer}>
              <Text style={styles.themeLabel}>Analogous</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.swatchRow}
              >
                {analogousTheme.map((color: string, index: number) => (
                  <View key={`analog-${index}`} style={styles.themeSwatchContainer}>
                    <View style={[styles.themeSwatch, { backgroundColor: color }]} />
                    <Text style={styles.swatchHex}>{color}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.themeRowContainer}>
              <Text style={styles.themeLabel}>Triadic</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.swatchRow}
              >
                {triadicTheme.map((color: string, index: number) => (
                  <View key={`triadic-${index}`} style={styles.themeSwatchContainer}>
                    <View style={[styles.themeSwatch, { backgroundColor: color }]} />
                    <Text style={styles.swatchHex}>{color}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.themeRowContainer}>
              <Text style={styles.themeLabel}>Monochromatic</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.swatchRow}
              >
                {monochromaticTheme.map((color: string, index: number) => (
                  <View key={`mono-${index}`} style={styles.themeSwatchContainer}>
                    <View style={[styles.themeSwatch, { backgroundColor: color }]} />
                    <Text style={styles.swatchHex}>{color}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
    color: theme.colors.companyBlack,
  },
  thumbnailOuter: {
    width: SCREEN_WIDTH,
    height: 240,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  content: {
    padding: 20,
  },
  identitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  swatch: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  nameContainer: {
    marginLeft: 20,
    flex: 1,
  },
  colorName: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.companyBlack,
  },
  familyName: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
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
    fontFamily: 'System', // Use mono-space if possible, but System is safer
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: theme.colors.companyBlue,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  compareButton: {
    backgroundColor: theme.colors.companyBlue,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  compareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  themesSection: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 20,
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.companyBlack,
  },
  themeRowContainer: {
    marginBottom: 20,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  swatchRow: {
    gap: 12,
    paddingRight: 20,
  },
  themeSwatchContainer: {
    alignItems: 'center',
    gap: 6,
  },
  themeSwatch: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  swatchHex: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  placeholderText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
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
});
