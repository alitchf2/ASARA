import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import { theme } from '../styles/theme';
import { ImmersiveHeader } from '../components/ImmersiveHeader';
import { ColorMetricsContainer } from '../components/ColorMetricsContainer';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  hexToRgb,
  hexToLab,
  formatRGBString,
  formatLABString
} from '../utils/colorUtils';
import {
  generateComplementaryTheme,
  generateAnalogousTheme,
  generateTriadicTheme,
  generateMonochromaticTheme
} from '../utils/colorThemes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SavedColorDetailScreen({ route, navigation }: any) {
  const { color } = route.params || {};
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  if (!color) {
    return (
      <View style={styles.container}>
        <ImmersiveHeader title="Color Details" onBack={() => navigation.goBack()} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Color data not found.</Text>
        </View>
      </View>
    );
  }

  const {
    imageUri: photoUri,
    hex: finalHex,
    name: colorName,
    family,
    rgb: savedRgb,
    lab: savedLab,
    marker,
    displayDimensions
  } = color;

  const THUMB_SIZE = 200;

  // Calculate thumbnail offsets for centering if marker exists
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
  const complementaryTheme = generateComplementaryTheme(finalHex);
  const analogousTheme = generateAnalogousTheme(finalHex);
  const triadicTheme = generateTriadicTheme(finalHex);
  const monochromaticTheme = generateMonochromaticTheme(finalHex);

  // Fallback metrics if not saved
  const finalRgbString = savedRgb || formatRGBString(hexToRgb(finalHex));
  const finalLabString = savedLab || formatLABString(hexToLab(finalHex));

  const handleCompareColor = () => {
    navigation.navigate('ColorCompare', {
      sourceColor: {
        detectedColor: finalHex,
        colorName: colorName,
        family: family,
        photoUri,
        marker,
        displayDimensions
      }
    });
  };

  return (
    <View style={styles.container}>
      <ImmersiveHeader
        title="Color Details"
        onBack={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Centered Thumbnail */}
        <View style={styles.thumbnailOuter}>
          <View style={styles.thumbnailContainer}>
            <Image
              source={typeof photoUri === 'string' ? { uri: photoUri } : photoUri}
              style={[
                styles.previewImage,
                marker ? {
                  width: displayDimensions?.width || SCREEN_WIDTH,
                  height: displayDimensions?.height || (SCREEN_WIDTH * 0.75),
                  left: offsets.left,
                  top: offsets.top,
                } : {
                  width: '100%',
                  height: '100%',
                }
              ]}
              resizeMode={marker ? "cover" : "cover"}
            />
            {marker && (
              /* Precise Selection Marker */
              <View
                style={[
                  styles.miniMarker,
                  { left: offsets.markerX - 10, top: offsets.markerY - 10 }
                ]}
                pointerEvents="none"
              >
                <View style={styles.miniCenter} />
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {/* Color Swatch & Identity */}
          <View style={styles.identitySection}>
            <View
              style={[
                styles.swatch,
                { backgroundColor: finalHex }
              ]}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.colorName}>{colorName}</Text>
              <Text style={styles.familyName}>{family}</Text>
            </View>
          </View>

          {/* Unified Metrics Section */}
          <ColorMetricsContainer
            hex={finalHex}
            rgb={finalRgbString}
            lab={finalLabString}
            containerStyle={{ marginBottom: 30 }}
          />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleCompareColor}
            >
              <Text style={styles.primaryButtonText}>Compare Color</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setIsDeleteModalVisible(true)}
            >
              <Text style={styles.deleteButtonText}>Delete Color</Text>
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

      <ConfirmationModal
        visible={isDeleteModalVisible}
        title="Delete Color"
        subtitle="Are you sure you want to delete this saved color? This action cannot be undone."
        iconName="trash-outline"
        primaryButtonTitle="Delete"
        primaryButtonVariant="primary"
        onPrimaryAction={() => {
          // TODO: Implement API deletion logic here (Task 9.9)
          console.log("TODO: Implement deletion for color ID:", color.id);
          setIsDeleteModalVisible(false);
          navigation.goBack();
        }}
        onCancelAction={() => setIsDeleteModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  deleteButton: {
    backgroundColor: theme.colors.companyBlue,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  deleteButtonText: {
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
