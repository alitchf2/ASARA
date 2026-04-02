import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ImmersiveFooterProps {
  children?: React.ReactNode;
  minHeight?: number;
}

/**
 * Standard Frosted Footer for immersive screens.
 * Handles safe-area insets and 180px height standards.
 */
export const ImmersiveFooter: React.FC<ImmersiveFooterProps> = ({ 
  children, 
  minHeight = 180 
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.footer, 
      { 
        minHeight, 
        paddingBottom: Math.max(insets.bottom, 20) 
      }
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    width: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});
