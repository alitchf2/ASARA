import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

interface ImmersiveHeaderProps {
  title: string;
  onBack: () => void;
}

/**
 * Standard Frosted Header for immersive screens.
 * Handles safe-area insets and 60px height standards.
 */
export const ImmersiveHeader: React.FC<ImmersiveHeaderProps> = ({ title, onBack }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { height: 60 + insets.top, paddingTop: insets.top }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={28} color={theme.colors.companyBlack} />
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    width: '100%',
  },
  backButton: {
    marginRight: 15,
    padding: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.companyBlack,
  },
});
