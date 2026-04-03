import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderUserIconProps {
  absolute?: boolean; // If true, position absolutely using safe area insets
}

export const HeaderUserIcon: React.FC<HeaderUserIconProps> = ({ 
  absolute = false
}) => {
  const { isGuest, showGuestModal } = useAuth();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const handlePress = () => {
    if (isGuest) {
      showGuestModal("Sign in to access account settings.");
    } else {
      navigation.navigate("UserSettings");
    }
  };

  const containerStyle = [
    styles.iconButton,
    absolute && {
      position: "absolute" as const,
      top: insets.top + 10,
      right: 20,
      zIndex: 1000,
    }
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
    >
      <Ionicons
        name="person-circle-outline"
        size={32}
        color={theme.colors.companyOrange}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
});
