import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import FindColorScreen from './src/screens/FindColorScreen';
import SavedColorsScreen from './src/screens/SavedColorsScreen';

//Task 1.2: environment switcher + validation
import { ENV } from './src/config';
import { validateEnvOrThrow } from './src/config/validateEnv';

const Tab = createBottomTabNavigator();

// Fail fast if config is missing
  validateEnvOrThrow();

  // Helpful in dev to confirm which env is active
  if (__DEV__) {
    console.log(`[Colorfind] Running env: ${ENV.env}`);
    console.log(`[Colorfind] API base: ${ENV.apiBaseUrl}`);
  }

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF', // brand-blue placeholder
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="FindColor"
          component={FindColorScreen}
          options={{
            tabBarLabel: 'Find Color',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💧</Text>,
          }}
        />
        <Tab.Screen
          name="SavedColors"
          component={SavedColorsScreen}
          options={{
            tabBarLabel: 'Saved',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🔖</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}