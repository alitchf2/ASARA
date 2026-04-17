import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { CompareSlider } from './CompareSlider';
import { LAB } from '../utils/colorUtils';
import { FeedbackModal } from './FeedbackModal';

interface LABSlidersProps {
  lab: LAB;
  hex: string;
  compareLab?: LAB | null;
  compareHex?: string | null;
  title?: string;
}

/**
 * A grouping of 4 sliders representing the L, a, b, and Chroma
 * components of a color. Used for technical visual analysis.
 */
export const LABSliders: React.FC<LABSlidersProps> = ({ 
  lab, 
  hex, 
  compareLab, 
  compareHex,
  title = "Visual Analysis"
}) => {
  const [isInfoVisible, setIsInfoVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.headerRow} 
        onPress={() => setIsInfoVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons name="information-circle-outline" size={18} color="#AAA" style={styles.infoIcon} />
      </TouchableOpacity>
      
      <CompareSlider
        label="Lightness (L)"
        sourceValue={lab.l}
        compareValue={compareLab?.l}
        min={0}
        max={100}
        gradientColors={['#000000', '#FFFFFF']}
        sourceHex={hex}
        compareHex={compareHex}
      />

      <CompareSlider
        label="Green ↔ Red (A)"
        sourceValue={lab.a}
        compareValue={compareLab?.a}
        min={-128}
        max={127}
        gradientColors={['#00FF00', '#808080', '#FF0000']}
        sourceHex={hex}
        compareHex={compareHex}
      />

      <CompareSlider
        label="Blue ↔ Yellow (B)"
        sourceValue={lab.b}
        compareValue={compareLab?.b}
        min={-128}
        max={127}
        gradientColors={['#0000FF', '#808080', '#FFFF00']}
        sourceHex={hex}
        compareHex={compareHex}
      />

      <CompareSlider
        label="Saturation / Chroma"
        sourceValue={lab.chroma}
        compareValue={compareLab?.chroma}
        min={0}
        max={180}
        gradientColors={['#808080', '#FF00FF']}
        sourceHex={hex}
        compareHex={compareHex}
      />

      <FeedbackModal
        visible={isInfoVisible}
        title="Color Analysis"
        subtitle={`CIELAB is a technical color space designed to closely match how the human eye perceives color.\n\n• Lightness (L): How bright or dark the color is, from black (0) to white (100).\n• A Axis: The shift between Green (Negative) and Red (Positive).\n• B Axis: The shift between Blue (Negative) and Yellow (Positive).\n• Chroma: The overall intensity or 'purity' of the color.\n\nLooking at these sliders is the best way to see nuanced shifts like yellow-greens or purple-blues.`}
        iconName="analytics-outline"
        buttonTitle="Got it"
        onButtonPress={() => setIsInfoVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.companyBlack,
  },
  infoIcon: {
    marginLeft: 8,
    marginTop: 2,
  },
});
