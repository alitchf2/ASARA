import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Brand Colors
const COMPANY_BLUE = '#5A7ACD';   // Indicator Color
const COMPANY_ORANGE = '#FEB05D'; // Brand Color (unused for active here now)
const INACTIVE_COLOR = '#F5F2F2';

export const CustomTabBar = ({ state, descriptors, navigation, position }: MaterialTopTabBarProps) => {
  const containerWidth = width - 40; // width minus left:20 and right:20
  const tabWidth = containerWidth / state.routes.length;
  const paddingHorizontal = 8; 
  const pillWidth = tabWidth - (paddingHorizontal * 2);

  // Directly interpolate the position prop from the Material Top Tab navigator
  // This ensures the indicator moves in perfect synchrony with the screen swipe.
  const translateX = position.interpolate({
    inputRange: state.routes.map((_, i) => i),
    outputRange: state.routes.map((_, i) => (i * tabWidth) + paddingHorizontal),
  });

  return (
    <View style={styles.tabBarContainer}>
      {/* Sliding Indicator (Pill) */}
      <Animated.View
        style={[
          styles.indicator,
          {
            width: pillWidth,
            transform: [{ translateX }],
          },
        ]}
      />

      <View style={styles.routesContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Render correct icon based on route name
          const renderIcon = (color: string) => {
            if (route.name === 'FindColor') {
              return <MaterialCommunityIcons name="eyedropper" size={26} color={color} />;
            } else if (route.name === 'SavedColors') {
              return <Ionicons name="bookmark-outline" size={26} color={color} />;
            }
            return null;
          };

          const activeColor = 'white';
          const inactiveColor = COMPANY_ORANGE;
          const color = isFocused ? activeColor : inactiveColor;

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={route.name}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              {renderIcon(color)}
              <Text style={[styles.tabLabel, { color }]}>
                {typeof label === 'string' ? label : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    height: 70, // Slightly more compact
    backgroundColor: '#2B2A2A', // Company Black
    position: 'absolute',
    bottom: 25, // Float above the bottom
    left: 20,
    right: 20,
    borderRadius: 35, // Perfect capsule
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    justifyContent: 'center',
    overflow: 'hidden', // Contain the indicator
  },
  routesContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 11, // Slightly smaller for compact bar
    marginTop: 2,
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
    height: 50, // Fits inside the 70px bar comfortably
    backgroundColor: COMPANY_BLUE,
    borderRadius: 25,
  },
});
