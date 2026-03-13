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
  const tabWidth = width / state.routes.length;
  const paddingHorizontal = 10; // Padding inside the tab bar for the pill
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
    height: 85,
    backgroundColor: '#2B2A2A', // Company Black
    borderTopWidth: 1,
    borderTopColor: '#3D3D3D', // Subtle dark border
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'relative',
    justifyContent: 'center', // Center indicator vertically
  },
  routesContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure icons are above indicator
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '700', // Making text a bit bolder for better legibility against backlight
  },
  indicator: {
    position: 'absolute',
    height: 60, // Large pill height
    backgroundColor: COMPANY_BLUE, // Solid Company Blue
    borderRadius: 30, // Capsule shape
  },
});
