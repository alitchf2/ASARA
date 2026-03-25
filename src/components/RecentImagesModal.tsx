import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  FlatList,
  Platform,
  Animated,
  PanResponder
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { getRecentPhotos } from '../utils/photoStorage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const SPACING = 12;
const ITEM_WIDTH = (SCREEN_WIDTH - (SPACING * (COLUMN_COUNT + 1))) / COLUMN_COUNT;

interface RecentImagesModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (uri: string) => void;
}

export const RecentImagesModal: React.FC<RecentImagesModalProps> = ({ 
  isVisible, 
  onClose, 
  onSelect 
}) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          handleClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 10
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isVisible) {
      loadPhotos();
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 10
      }).start();
    }
  }, [isVisible]);

  const loadPhotos = async () => {
    const recent = await getRecentPhotos();
    setPhotos(recent);
    setSelectedUri(null);
  };

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleConfirmSelection = () => {
    if (selectedUri) {
      onSelect(selectedUri);
      handleClose();
    }
  };

  const renderItem = ({ item, index }: { item: string | null, index: number }) => {
    const isSelected = selectedUri === item && item !== null;
    
    return (
      <TouchableOpacity 
        style={[
          styles.imageContainer,
          isSelected && styles.selectedContainer
        ]}
        onPress={() => item && setSelectedUri(item)}
        activeOpacity={0.8}
        disabled={!item}
      >
        {item ? (
          <>
            <Image source={{ uri: item }} style={styles.thumbnail} />
            {isSelected && (
              <View style={styles.checkmarkContainer}>
                <View style={styles.whiteCheckFiller} />
                <Ionicons name="checkmark-circle" size={32} color={theme.colors.companyBlue} />
              </View>
            )}
          </>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={30} color="#ccc" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const displayPhotos = [...photos];
  while (displayPhotos.length < 6) {
    displayPhotos.push(null as any);
  }

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      onRequestClose={handleClose}
      animationType="none" // Custom animation with translateY
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={handleClose} 
        />
        <Animated.View 
          style={[
            styles.modalContent, 
            { transform: [{ translateY }] }
          ]} 
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Recent Images</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={theme.colors.companyBlack} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={displayPhotos}
            renderItem={renderItem}
            keyExtractor={(item, index) => item || `placeholder-${index}`}
            numColumns={COLUMN_COUNT}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false}
          />

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[
                styles.selectButton,
                !selectedUri && styles.disabledButton
              ]}
              onPress={handleConfirmSelection}
              disabled={!selectedUri}
            >
              <Text style={styles.selectButtonText}>Select</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.companyBlack,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    padding: 4,
  },
  listContainer: {
    paddingHorizontal: SPACING,
  },
  imageContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.33,
    margin: SPACING / 2,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedContainer: {
    borderColor: theme.colors.companyBlue,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  checkmarkContainer: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteCheckFiller: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    position: 'absolute',
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    alignItems: 'flex-end',
  },
  selectButton: {
    backgroundColor: theme.colors.companyBlue,
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
