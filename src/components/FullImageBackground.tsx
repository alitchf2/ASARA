import React from 'react';
import { Image, StyleSheet, View, LayoutChangeEvent, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FullImageBackgroundProps {
  uri?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  children?: React.ReactNode;
}

/**
 * Reusable Full-Screen Background Image component.
 * Ensures consistent absolute-fill positioning and resizeMode.
 */
export const FullImageBackground: React.FC<FullImageBackgroundProps> = ({ 
  uri, 
  onLayout, 
  children 
}) => {
  return (
    <View style={styles.container}>
      {uri ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onLayout={onLayout}
        />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="image-outline" size={48} color="rgba(255,255,255,0.3)" />
        </View>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
