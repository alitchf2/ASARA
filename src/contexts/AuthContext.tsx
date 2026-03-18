import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * AuthContextType defines the shape of the authentication state.
 * Currently, it only tracks the guest mode flag, but can be expanded
 * for actual user authentication (Cognito) later.
 */
interface AuthContextType {
  isGuest: boolean;
  setIsGuest: (value: boolean) => void;
  isGuestModalVisible: boolean;
  guestModalTitle: string;
  showGuestModal: (title: string) => void;
  closeGuestModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider wraps the application and provides the guest mode state
 * to any component that needs it.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isGuest, setIsGuest] = useState(false);
  const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);
  const [guestModalTitle, setGuestModalTitle] = useState("");

  const showGuestModal = (title: string) => {
    setGuestModalTitle(title);
    setIsGuestModalVisible(true);
  };

  const closeGuestModal = () => {
    setIsGuestModalVisible(false);
  };

  return (
    <AuthContext.Provider value={{ isGuest, setIsGuest, isGuestModalVisible, guestModalTitle, showGuestModal, closeGuestModal }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth is a custom hook to easily access the authentication context
 * and ensure it's used within an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
