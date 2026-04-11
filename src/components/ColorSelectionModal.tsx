import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  Dimensions, 
  FlatList,
  Platform,
  Animated,
  PanResponder,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { ColorCard } from './ColorCard';
import { SAVED_COLORS } from '../utils/savedColors';
import { SavedColor } from '../types/color';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const FAMILIES = ["All", "Red", "Yellow", "Blue", "Green", "Orange", "Purple", "Brown", "Gray", "Black", "White"];

interface ColorSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (color: SavedColor) => void;
}

export const ColorSelectionModal: React.FC<ColorSelectionModalProps> = ({ 
  isVisible, 
  onClose, 
  onSelect 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("All");
  const [selectedColor, setSelectedColor] = useState<SavedColor | null>(null);
  
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
      setSearchQuery("");
      setSelectedFamily("All");
      setSelectedColor(null);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 10
      }).start();
    }
  }, [isVisible]);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleConfirmSelection = () => {
    if (selectedColor) {
      onSelect(selectedColor);
      handleClose();
    }
  };

  const isFiltered = searchQuery !== "" || selectedFamily !== "All";
  const isEmptyLibrary = SAVED_COLORS.length === 0;

  const emptyTitle = isFiltered 
    ? `No results ${selectedFamily !== "All" ? `in ${selectedFamily}` : ""}`
    : "No saved colors yet";
  const emptySubtitle = isFiltered
    ? "Try adjusting your search or filters to find what you're looking for."
    : "Capture a color and save it to build your personalized palette collection.";

  const filteredColors = useMemo(() => {
    return SAVED_COLORS.filter(color => {
      const matchesSearch = color.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           color.family.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFamily = selectedFamily === "All" || color.family === selectedFamily;
      return matchesSearch && matchesFamily;
    });
  }, [searchQuery, selectedFamily]);

  const renderItem = ({ item }: { item: SavedColor }) => {
    const isSelected = selectedColor?.id === item.id;
    
    return (
      <View style={styles.cardWrapper}>
        <ColorCard 
          name={item.name} 
          family={item.family} 
          imageUri={item.imageUri} 
          onPress={() => setSelectedColor(item)}
          isSelected={isSelected}
        />
      </View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      onRequestClose={handleClose}
      animationType="none"
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
        >
          <View style={styles.header} {...panResponder.panHandlers}>
            <Text style={styles.headerTitle}>Select a color to compare</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={theme.colors.companyBlack} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search saved colors..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          <View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterBar}
            >
              {FAMILIES.map((family) => (
                <TouchableOpacity
                  key={family}
                  style={[
                    styles.filterChip,
                    selectedFamily === family && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedFamily(family)}
                >
                  <Text style={[
                    styles.filterText,
                    selectedFamily === family && styles.filterTextActive
                  ]}>
                    {family}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={filteredColors}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons 
                  name={isFiltered ? "search-outline" : "bookmark-outline"} 
                  size={80} 
                  color={theme.colors.companyOrange} 
                />
                <Text style={styles.emptyTitle}>{emptyTitle}</Text>
                <Text style={styles.emptySubtitle}>{emptySubtitle}</Text>
              </View>
            }
          />

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[
                styles.selectButton,
                !selectedColor && styles.disabledButton
              ]}
              onPress={handleConfirmSelection}
              disabled={!selectedColor}
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
    height: SCREEN_HEIGHT * 0.75,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.companyBlack,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.companyBlack,
  },
  filterBar: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: theme.colors.companyBlue,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  filterTextActive: {
    color: "#FFF",
  },
  listContainer: {
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  cardWrapper: {
    position: 'relative',
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: 'white',
  },
  selectButton: {
    backgroundColor: theme.colors.companyBlue,
    paddingVertical: 12,
    paddingHorizontal: 40,
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
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.companyBlack,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});
