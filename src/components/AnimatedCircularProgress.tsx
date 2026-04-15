import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { theme } from '../styles/theme';

// Create an animated-capable version of the SVG Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AnimatedCircularProgressProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  color: string;
  label?: string;
}

export const AnimatedCircularProgress: React.FC<AnimatedCircularProgressProps> = ({
  percentage,
  size,
  strokeWidth,
  color,
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Use standard Animated.Value for maximum compatibility with Expo Go
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fill up the circle smoothly
    Animated.timing(animatedValue, {
      toValue: percentage / 100,
      duration: 1500,
      useNativeDriver: false, // SVG props often require JS-thread animation in standard Animated
    }).start();
  }, [percentage]);

  // Interpolate the dash offset based on the progress
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#EDEDED"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Stroke */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </G>
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.content}>
          <Text style={styles.percentageText}>
            {percentage === 0 && label === "MATCH" && percentage !== null ? "0%" : (percentage > 0 ? `${Math.round(percentage)}%` : "---")}
          </Text>
          {label && <Text style={styles.label}>{label}</Text>}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.companyBlack,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 8,
    fontWeight: '800',
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: -2,
  },
});
