import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";
import { theme } from "../styles/theme";

interface BrandedButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "text";
  isLoading?: boolean;
}

export const BrandedButton: React.FC<BrandedButtonProps> = ({
  title,
  variant = "primary",
  isLoading = false,
  disabled,
  style,
  ...props
}) => {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isText = variant === "text";

  const getBackgroundColor = () => {
    if (disabled && !isText) return theme.colors.disabled;
    if (isPrimary) return theme.colors.companyBlue;
    if (isSecondary) return theme.colors.companyOrange;
    return "transparent";
  };

  const getTextColor = () => {
    if (isText) {
      return disabled ? theme.colors.disabled : theme.colors.companyBlue;
    }
    return theme.colors.companyWhite;
  };

  return (
    <TouchableOpacity
      style={[
        styles.buttonBase,
        !isText && styles.buttonSolid,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.textBase, { color: getTextColor() }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSolid: {
    height: 50,
    borderRadius: theme.borderRadius.md,
    width: "100%",
    paddingHorizontal: theme.spacing.lg,
  },
  textBase: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
