import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';

interface CompareSliderProps {
  label: string;
  sourceValue: number;
  compareValue?: number | null;
  min: number;
  max: number;
  gradientColors: string[];
  sourceHex: string;
  compareHex?: string | null;
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
  label,
  sourceValue,
  compareValue,
  min,
  max,
  gradientColors,
  sourceHex,
  compareHex,
}) => {
  const range = max - min;
  
  // Calculate marker positions in percentage (0 to 100)
  const getPosition = (val: number) => {
    const clamped = Math.max(min, Math.min(max, val));
    return ((clamped - min) / range) * 100;
  };

  const sourcePos = getPosition(sourceValue);
  const comparePos = compareValue !== undefined && compareValue !== null ? getPosition(compareValue) : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valuesRow}>
          <Text style={[styles.valueText, { color: theme.colors.textMuted }]}>
            Δ: {compareValue !== undefined && compareValue !== null 
              ? (compareValue - sourceValue > 0 ? "+" : "") + (compareValue - sourceValue).toFixed(2)
              : "0.00"}
          </Text>
        </View>
      </View>

      <View style={styles.trackContainer}>
        <LinearGradient
          colors={gradientColors as any}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.track}
        />
        
        {/* Source Marker - Square */}
        <View 
          style={[
            styles.marker, 
            styles.sourceMarker, 
            { 
              left: `${sourcePos}%`,
              backgroundColor: sourceHex,
            }
          ]} 
        />

        {/* Compare Marker - Circle */}
        {comparePos !== null && compareHex && (
          <View 
            style={[
              styles.marker, 
              styles.compareMarker, 
              { 
                left: `${comparePos}%`,
                backgroundColor: compareHex,
              }
            ]} 
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#AAA',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  valuesRow: {
    flexDirection: 'row',
  },
  valueText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'System',
  },
  trackContainer: {
    height: 12,
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 0, // Markers are centered on their position
  },
  track: {
    height: 6,
    borderRadius: 3,
    width: '100%',
  },
  marker: {
    position: 'absolute',
    width: 14,
    height: 14,
    zIndex: 10,
    marginLeft: -7, // Center marker on its position
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  sourceMarker: {
    backgroundColor: theme.colors.companyBlue,
    borderRadius: 2, // Square-ish
    top: -1, // Center vertically on track (12/2 - 14/2)
  },
  compareMarker: {
    backgroundColor: theme.colors.companyOrange,
    borderRadius: 7, // Circle
    top: -1,
  },
});
