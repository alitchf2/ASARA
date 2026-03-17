import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { GuestAuthModal } from "./GuestAuthModal";

export const GlobalGuestModal = () => {
  const { isGuestModalVisible, guestModalTitle, closeGuestModal, setIsGuest } =
    useAuth();
  const navigation = useNavigation<any>();

  return (
    <GuestAuthModal
      visible={isGuestModalVisible}
      title={guestModalTitle}
      onClose={closeGuestModal}
      onSignIn={() => {
        closeGuestModal();
        setIsGuest(false);
        navigation.navigate("SignIn");
      }}
    />
  );
};
