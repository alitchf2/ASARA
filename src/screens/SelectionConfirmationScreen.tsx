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
import { post } from 'aws-amplify/api';

import * as FileSystem from 'expo-file-system/legacy';
import { calculate5x5Average } from '../utils/colorExtraction';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SelectionConfirmationScreen({ route, navigation }: any) {
  const { photoUri, marker, originalDimensions, displayDimensions } = route.params || {};

  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleConfirm = async () => {
    if (!marker || !originalDimensions || !displayDimensions || !photoUri) {
      console.log("Skipping process: Missing dimension or marker data");
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Native Hardware-accelerated Resize scales 12 million pixels drastically down natively!
      const manipResult = await manipulateAsync(
        photoUri,
        [{ resize: { width: 800 } }], 
        { base64: true, format: SaveFormat.JPEG, compress: 0.8 }
      );
      
      const base64Data = manipResult.base64!;

      const rgb = calculate5x5Average(base64Data, marker.x, marker.y, displayDimensions);
      
      const toHex = (c: any) => {
        const val = Math.max(0, Math.min(255, Math.round(Number(c)) || 0));
        return val.toString(16).padStart(2, '0');
      };
      const hexColor = `#${toHex(rgb?.r)}${toHex(rgb?.g)}${toHex(rgb?.b)}`.toUpperCase();

      const restOperation = post({
        apiName: 'colorfindAPI',
        path: '/colors/detect/match',
        options: { body: { hexColor } }
      });
      const response = await restOperation.response;
      const data = await response.body.json() as any;
      const matchedColor = data.closestColor || null;

      navigation.navigate('ColorResults', { 
        photoUri, 
        marker,
        displayDimensions,
        originalDimensions,
        detectedColor: hexColor,
        matchedColor
      });
    } catch (err) {
      console.error("Match processing failed:", err);
    } finally {
      setIsProcessing(false);
    }
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
              style={[styles.confirmButton, isProcessing && { opacity: 0.7 }]}
              onPress={handleConfirm}
              disabled={isProcessing}
            >
              <Text style={styles.buttonText}>{isProcessing ? 'Processing Color...' : 'Confirm Selection'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reselectButton}
              onPress={handleReselect}
              disabled={isProcessing}
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
