import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { theme } from "../styles/theme";

interface ColorMetricsContainerProps {
  hex: string;
  rgb: string;
  lab: string;
  containerStyle?: object;
  variant?: "default" | "compact";
}

export const ColorMetricsContainer: React.FC<ColorMetricsContainerProps> = ({
  hex,
  rgb,
  lab,
  containerStyle,
  variant = "default",
}) => {
  const isCompact = variant === "compact";

  return (
    <View
      style={[
        styles.metricsContainer,
        isCompact && styles.metricsContainerCompact,
        containerStyle,
      ]}
    >
      <View style={[styles.metricRow, isCompact && styles.metricRowCompact]}>
        <Text style={[styles.metricLabel, isCompact && styles.metricLabelCompact]}>
          HEX
        </Text>
        <Text style={[styles.metricValue, isCompact && styles.metricValueCompact]}>
          {hex.toUpperCase()}
        </Text>
      </View>

      <View style={[styles.metricRow, isCompact && styles.metricRowCompact]}>
        <Text style={[styles.metricLabel, isCompact && styles.metricLabelCompact]}>
          RGB
        </Text>
        <Text style={[styles.metricValue, isCompact && styles.metricValueCompact]}>
          {rgb}
        </Text>
      </View>

      <View style={[styles.metricRow, isCompact && styles.metricRowCompact]}>
        <Text style={[styles.metricLabel, isCompact && styles.metricLabelCompact]}>
          LAB
        </Text>
        <Text style={[styles.metricValue, isCompact && styles.metricValueCompact]}>
          {lab}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  metricsContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 20,
    width: "100%",
  },
  metricsContainerCompact: {
    padding: 10,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  metricRowCompact: {
    paddingVertical: 6,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    letterSpacing: 1,
  },
  metricLabelCompact: {
    fontSize: 9,
    fontWeight: "800",
    color: "#AAA",
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.companyBlack,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  metricValueCompact: {
    fontSize: 10.5,
  },
});
