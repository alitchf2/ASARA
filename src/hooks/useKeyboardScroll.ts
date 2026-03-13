import { useState, useEffect, useRef } from "react";
import { Keyboard, Animated, Platform } from "react-native";

export function useKeyboardScroll(fieldDistance: number = 65) {
  const translateY = useRef(new Animated.Value(0)).current;
  const [focusedField, setFocusedField] = useState<
    "username" | "password" | null
  >(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setIsKeyboardVisible(true),
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
        setFocusedField(null);
      },
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isKeyboardVisible && focusedField) {
      const shiftAmount = focusedField === "password" ? fieldDistance : 0;

      Animated.timing(translateY, {
        toValue: -shiftAmount,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else if (!isKeyboardVisible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isKeyboardVisible, focusedField, translateY, fieldDistance]);

  return { translateY, focusedField, setFocusedField };
}
