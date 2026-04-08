import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";
import { ColorCard } from "./ColorCard";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Mock starter colors for selection UI
const STARTER_COLORS = [
  { id: 's1', name: 'Desert Rose', family: 'Red', hex: '#ED6B86', imageUri: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=200' },
  { id: 's2', name: 'Ocean Mist', family: 'Blue', hex: '#4BA3C3', imageUri: 'https://images.unsplash.com/photo-1505113135031-6dddf462518e?w=200' },
  { id: 's3', name: 'Forest Moss', family: 'Green', hex: '#4B6B40', imageUri: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=200' },
];

interface ColorSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (color: any) => void;
  savedColors?: any[];
}

export const ColorSelectionModal: React.FC<ColorSelectionModalProps> = ({
  visible,
  onClose,
  onSelect,
  savedColors = []
}) => {
  const displayColors = savedColors.length > 0 ? savedColors : STARTER_COLORS;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Color</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={theme.colors.companyBlack} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={displayColors}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            renderItem={({ item }) => (
              <ColorCard
                name={item.name}
                family={item.family}
                imageUri={item.imageUri}
                onPress={() => onSelect(item)}
              />
            )}
            contentContainerStyle={styles.scrollContent}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: SCREEN_HEIGHT * 0.70,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.companyBlack,
  },
  closeButton: {
    padding: 4,
  },
  gridRow: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
