import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";

interface PasswordRequirementsProps {
  password: string;
  isFocused: boolean;
}

import { validatePasswordStrength } from '../utils/validators';

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  isFocused,
}) => {
  const { hasLength, hasUpperLower, hasNumber, hasSpecial, isValid: isPasswordValid } = validatePasswordStrength(password);

  // Only show if focused OR if we have started typing and it's not valid yet OR if it is valid
  const shouldShow = isFocused || (password.length > 0 && !isPasswordValid) || isPasswordValid;

  if (!shouldShow) return null;

  return (
    <View style={styles.validationContainer}>
      <View style={styles.validationSummary}>
        <Ionicons
          name={isPasswordValid ? "checkmark-circle" : "close-circle-outline"}
          size={20}
          color={isPasswordValid ? theme.colors.companyBlue : theme.colors.textMuted}
        />
        <Text
          style={[
            styles.validationSummaryText,
            isPasswordValid && { color: theme.colors.companyBlue },
          ]}
        >
          {isPasswordValid ? "password is valid" : "password is not valid"}
        </Text>
      </View>

      {(!isPasswordValid || isFocused) && (
        <View style={styles.validationDetails}>
          <View style={styles.validationBranchLine} />
          <View style={styles.validationRows}>
            {/* Requirement: Length */}
            <View style={styles.validationRow}>
              {hasLength && <View style={styles.activeInitialTrunk} />}
              <View
                style={[
                  styles.curvedBranch,
                  hasLength && { borderColor: theme.colors.companyBlue },
                ]}
              />
              {hasLength && hasUpperLower && (
                <View style={styles.activeBottomTrunk} />
              )}
              <Ionicons
                name={hasLength ? "checkmark-circle" : "ellipse-outline"}
                size={16}
                color={hasLength ? theme.colors.companyBlue : theme.colors.textMuted}
                style={styles.validationIcon}
              />
              <Text
                style={[
                  styles.validationRowText,
                  hasLength && { color: theme.colors.companyBlue },
                ]}
              >
                Must be at least 8 characters long
              </Text>
            </View>

            {/* Requirement: Upper/Lower */}
            <View style={styles.validationRow}>
              <View
                style={[
                  styles.curvedBranch,
                  hasUpperLower && { borderColor: theme.colors.companyBlue },
                ]}
              />
              {hasUpperLower && hasNumber && (
                <View style={styles.activeBottomTrunk} />
              )}
              <Ionicons
                name={hasUpperLower ? "checkmark-circle" : "ellipse-outline"}
                size={16}
                color={hasUpperLower ? theme.colors.companyBlue : theme.colors.textMuted}
                style={styles.validationIcon}
              />
              <Text
                style={[
                  styles.validationRowText,
                  hasUpperLower && { color: theme.colors.companyBlue },
                ]}
              >
                Must contain an uppercase and lowercase letter (A, z)
              </Text>
            </View>

            {/* Requirement: Number */}
            <View style={styles.validationRow}>
              <View
                style={[
                  styles.curvedBranch,
                  hasNumber && { borderColor: theme.colors.companyBlue },
                ]}
              />
              {hasNumber && hasSpecial && (
                <View style={styles.activeBottomTrunk} />
              )}
              <Ionicons
                name={hasNumber ? "checkmark-circle" : "ellipse-outline"}
                size={16}
                color={hasNumber ? theme.colors.companyBlue : theme.colors.textMuted}
                style={styles.validationIcon}
              />
              <Text
                style={[
                  styles.validationRowText,
                  hasNumber && { color: theme.colors.companyBlue },
                ]}
              >
                Must contain a number
              </Text>
            </View>

            {/* Requirement: Special Character */}
            <View style={styles.validationRow}>
              <View
                style={[
                  styles.curvedBranch,
                  hasSpecial && { borderColor: theme.colors.companyBlue },
                ]}
              />
              <Ionicons
                name={hasSpecial ? "checkmark-circle" : "ellipse-outline"}
                size={16}
                color={hasSpecial ? theme.colors.companyBlue : theme.colors.textMuted}
                style={styles.validationIcon}
              />
              <Text
                style={[
                  styles.validationRowText,
                  hasSpecial && { color: theme.colors.companyBlue },
                ]}
              >
                Must contain a special character (!, %, @, #, etc.)
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  validationContainer: {
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  validationSummary: {
    flexDirection: "row",
    alignItems: "center",
  },
  validationSummaryText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#767676",
  },
  validationDetails: {
    position: "relative",
    marginTop: 6,
    paddingBottom: 4,
  },
  validationBranchLine: {
    position: "absolute",
    top: -6,
    bottom: 15,
    left: 9,
    width: 2,
    backgroundColor: "#D3D3D3",
  },
  validationRows: {
    paddingLeft: 22,
    gap: 0,
  },
  validationRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    paddingVertical: 5,
  },
  curvedBranch: {
    position: "absolute",
    left: -13,
    width: 13,
    top: 0,
    bottom: "50%",
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: "#D3D3D3",
    borderBottomLeftRadius: 6,
  },
  activeBottomTrunk: {
    position: "absolute",
    left: -13,
    width: 2,
    top: "50%",
    bottom: 0,
    backgroundColor: "#5A7ACD",
  },
  activeInitialTrunk: {
    position: "absolute",
    left: -13,
    width: 2,
    top: -6,
    bottom: "100%",
    backgroundColor: "#5A7ACD",
  },
  validationIcon: {
    marginRight: 6,
    backgroundColor: "#F5F2F2", // Matches the app background color used in forms
  },
  validationRowText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textMuted,
  },
});
