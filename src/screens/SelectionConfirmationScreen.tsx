import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { SelectionMarker } from '../components/SelectionMarker';
import { FullImageBackground } from '../components/FullImageBackground';
import { ImmersiveHeader } from '../components/ImmersiveHeader';
import { ImmersiveFooter } from '../components/ImmersiveFooter';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SelectionConfirmationScreen({ route, navigation }: any) {
  const { photoUri, marker, originalDimensions, displayDimensions } = route.params || {};

  const handleConfirm = () => {
    // Transition to results for Task 7.1
    navigation.navigate('ColorResults', { 
      photoUri, 
      marker,
      displayDimensions,
      originalDimensions
    });
  };

  const handleReselect = () => {
    navigation.goBack();
  };

  return (
    <FullImageBackground uri={photoUri}>
      {/* Marker Overlay */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {marker && (
          <SelectionMarker x={marker.x} y={marker.y} />
        )}
      </View>

      {/* UI Overlays */}
      <View style={styles.overlayContainer} pointerEvents="box-none">
        <ImmersiveHeader 
          title="Confirm Selection" 
          onBack={() => navigation.goBack()} 
        />

        <View style={styles.flexSpacer} pointerEvents="none" />

        <ImmersiveFooter>
          <Text style={styles.instruction}>
            Is this the exact point you want to identify?
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>Confirm Selection</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reselectButton}
              onPress={handleReselect}
            >
              <Text style={styles.reselectText}>Reselect</Text>
            </TouchableOpacity>
          </View>
        </ImmersiveFooter>
      </View>
    </FullImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullScreenPreview: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  flexSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  instruction: {
    fontSize: 15,
    color: theme.colors.companyBlack,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 20,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: 4, // Tighter gap between buttons
  },
  confirmButton: {
    backgroundColor: theme.colors.companyBlue,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 5,
  },
  reselectButton: {
    width: '100%',
    paddingVertical: 8, // Tighter padding for Reselect
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  reselectText: {
    color: theme.colors.companyOrange,
    fontSize: 17,
    fontWeight: '600',
  },
});
