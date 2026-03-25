import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface SelectionMarkerProps {
  x: number;
  y: number;
  size?: number;
}

export const SelectionMarker: React.FC<SelectionMarkerProps> = ({ x, y, size = 30 }) => {
  const radius = size / 2;
  
  return (
    <View 
      style={[
        styles.marker, 
        { 
          left: x - radius, 
          top: y - radius,
          width: size,
          height: size,
          borderRadius: radius,
        }
      ]} 
      pointerEvents="none"
    >
      <View style={styles.innerCircle} />
      <View style={[styles.targetLine, styles.targetLineTop]} />
      <View style={[styles.targetLine, styles.targetLineBottom]} />
      <View style={[styles.targetLine, styles.targetLineLeft]} />
      <View style={[styles.targetLine, styles.targetLineRight]} />
    </View>
  );
};

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: theme.colors.companyBlue,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  innerCircle: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1,
    borderColor: theme.colors.companyOrange,
  },
  targetLine: {
    position: 'absolute',
    backgroundColor: theme.colors.companyOrange,
  },
  targetLineTop: {
    top: 5,
    left: '50%',
    width: 1,
    height: 5.5,
    marginLeft: -0.5,
  },
  targetLineBottom: {
    bottom: 5,
    left: '50%',
    width: 1,
    height: 5.5,
    marginLeft: -0.5,
  },
  targetLineLeft: {
    left: 5,
    top: '50%',
    width: 5.5,
    height: 1,
    marginTop: -0.5,
  },
  targetLineRight: {
    right: 5,
    top: '50%',
    width: 5.5,
    height: 1,
    marginTop: -0.5,
  },
});
