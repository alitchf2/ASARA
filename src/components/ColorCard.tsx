import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { theme } from "../styles/theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2; // (Screen - 20 padding * 2 - 20 gap) / 2

interface ColorCardProps {
  imageUri: string;
  name: string;
  family: string;
  onPress?: () => void;
}

export const ColorCard: React.FC<ColorCardProps> = ({ 
  imageUri, 
  name, 
  family, 
  onPress 
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: imageUri }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.family}>{family}</Text>
      </View>
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
  },
  thumbnail: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: "#F0F0F0",
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
