import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2; // (Screen - 20 padding * 2 - 20 gap) / 2

interface ColorCardProps {
  imageUri: any;
  name: string;
  family: string;
  onPress?: () => void;
  isSelected?: boolean;
}

export const ColorCard: React.FC<ColorCardProps> = ({ 
  imageUri, 
  name, 
  family, 
  onPress,
  isSelected
}) => {
  const imageSource = typeof imageUri === 'string' ? { uri: imageUri } : imageUri;
  
  return (
    <TouchableOpacity 
      style={[
        styles.card,
        isSelected && styles.cardSelected
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={imageSource} style={styles.thumbnail} resizeMode="contain" />
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.family}>{family}</Text>
      </View>

      {isSelected && (
        <>
          <View style={styles.selectionBorder} pointerEvents="none" />
          <View style={styles.checkmarkOverlay}>
            <View style={styles.whiteCheckFiller} />
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.companyBlue} />
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 12,
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: "hidden",
    position: 'relative',
  },
  cardSelected: {
    // Optional: add a slight elevation or background change when selected
  },
  thumbnailContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    position: 'relative',
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F0F0F0",
  },
  checkmarkOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  whiteCheckFiller: {
    width: 16,
    height: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    position: 'absolute',
  },
  selectionBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 3,
    borderColor: theme.colors.companyBlue,
    borderRadius: 12,
    zIndex: 10,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.companyBlack,
  },
  family: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});
