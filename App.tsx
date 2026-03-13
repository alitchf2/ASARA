import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FindColorScreen from './src/screens/FindColorScreen';
import SavedColorsScreen from './src/screens/SavedColorsScreen';
import SignInScreen from './src/screens/SignInScreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import TermsOfServiceScreen from './src/screens/TermsOfServiceScreen';
import UserSettingsScreen from './src/screens/UserSettingsScreen';


//Task 1.2: environment switcher + validation
import { ENV } from './src/config';
import { validateEnvOrThrow } from './src/config/validateEnv';

//Task1.3: Amplify setup
import { configureAmplify } from './src/config/amplify';
configureAmplify();

import { GlobalOfflineModal } from './src/components/GlobalOfflineModal';

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
          tabBarIcon: ({ color, size }) => <Ionicons name="color-filter-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="SavedColors"
        component={SavedColorsScreen}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmark-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GlobalOfflineModal />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
          <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
          <Stack.Screen name="UserSettings" component={UserSettingsScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}