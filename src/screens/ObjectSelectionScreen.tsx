import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Dimensions,
  Platform,
  LayoutChangeEvent
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { SelectionMarker } from '../components/SelectionMarker';
import { FullImageBackground } from '../components/FullImageBackground';
import { ImmersiveHeader } from '../components/ImmersiveHeader';
import { ImmersiveFooter } from '../components/ImmersiveFooter';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ObjectSelectionScreen({ route, navigation }: any) {
  const { photoUri } = route.params || {};
  const [marker, setMarker] = useState<{ x: number, y: number } | null>(null);
  const [imageLayout, setImageLayout] = useState<{ width: number, height: number } | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number, height: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (photoUri) {
      Image.getSize(photoUri, (width, height) => {
        setOriginalDimensions({ width, height });
      }, (error) => {
        console.error("Failed to get image size for test:", error);
      });
    }
  }, [photoUri]);

  const handlePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setMarker({ x: locationX, y: locationY });
  };

  const handleIdentify = () => {
    if (!marker || !imageLayout) return;

    navigation.navigate('SelectionConfirmation', {
      photoUri,
      marker,
      displayDimensions: imageLayout,
      originalDimensions
    });
  };

  const onImageLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setImageLayout({ width, height });
  };

  return (
    <FullImageBackground uri={photoUri} onLayout={onImageLayout}>
      {/* Touch Layer for Selection */}
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={StyleSheet.absoluteFill}>
          {marker && (
            <SelectionMarker x={marker.x} y={marker.y} />
          )}
        </View>
      </TouchableWithoutFeedback>

      {/* UI Overlays */}
      <View style={styles.overlayContainer} pointerEvents="box-none">
        <ImmersiveHeader 
          title="Select Object" 
          onBack={() => navigation.goBack()} 
        />

        <View style={styles.flexSpacer} pointerEvents="none" />

        <ImmersiveFooter>
          <Text style={styles.instruction}>
            Tap the point you want to identify the color of.
          </Text>

          <TouchableOpacity
            style={[
              styles.button,
              !marker && styles.buttonDisabled
            ]}
            onPress={handleIdentify}
            disabled={!marker || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Identify Color</Text>
            )}
          </TouchableOpacity>
        </ImmersiveFooter>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={theme.colors.companyOrange} />
            <Text style={styles.loadingText}>Finding Color...</Text>
          </View>
        </View>
      )}
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
  placeholderBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  flexSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  preview: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    marginTop: 10,
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
  button: {
    backgroundColor: theme.colors.companyBlue,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 12 : 5, // Tighter margin now that footer handles padding
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: theme.colors.companyBlack,
    fontWeight: '600',
  },
});
