import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FindColorScreen from './src/screens/FindColorScreen';
import SavedColorsScreen from './src/screens/SavedColorsScreen';
import SignInScreen from './src/screens/SignInScreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';


//Task 1.2: environment switcher + validation
import { ENV } from './src/config';
import { validateEnvOrThrow } from './src/config/validateEnv';

//Task1.3: Amplify setup
import { configureAmplify } from './src/config/amplify';
configureAmplify();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
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
  );
}

// Fail fast if config is missing
  validateEnvOrThrow();

  // Helpful in dev to confirm which env is active
  if (__DEV__) {
    console.log(`[Colorfind] Running env: ${ENV.env}`);
    console.log(`[Colorfind] API base: ${ENV.apiBaseUrl}`);
  }

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}