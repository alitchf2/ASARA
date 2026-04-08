import React, { useState, useEffect } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer, useNavigationState } from '@react-navigation/native';

import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getCurrentUser } from 'aws-amplify/auth';
import FindColorScreen from './src/screens/FindColorScreen';
import SavedColorsScreen from './src/screens/SavedColorsScreen';
import SignInScreen from './src/screens/SignInScreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import TermsOfServiceScreen from './src/screens/TermsOfServiceScreen';
import ColorCompareScreen from './src/screens/ColorCompareScreen';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { CustomTabBar } from "./src/components/CustomTabBar";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { GlobalGuestModal } from "./src/components/GlobalGuestModal";
import UserSettingsScreen from './src/screens/UserSettingsScreen';
import ObjectSelectionScreen from './src/screens/ObjectSelectionScreen';
import SelectionConfirmationScreen from './src/screens/SelectionConfirmationScreen';
import ColorResultsScreen from './src/screens/ColorResultsScreen';
import SaveColorPromptScreen from './src/screens/SaveColorPromptScreen';
import { clearRecentPhotos } from "./src/utils/photoStorage";
import { AppState } from 'react-native';
import { HeaderUserIcon } from "./src/components/HeaderUserIcon";

//Task 1.2: environment switcher + validation
import { ENV } from "./src/config";
import { validateEnvOrThrow } from "./src/config/validateEnv";

//Task 1.3: Amplify setup
import { configureAmplify } from './src/config/amplify';
configureAmplify();

import { GlobalOfflineModal } from './src/components/GlobalOfflineModal';


const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function GlobalHeaderOverlay() {
  return <HeaderUserIcon absolute />;
}

function MainTabs() {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        tabBarPosition="bottom"
        initialRouteName="FindColor"
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          headerShown: false,
        }}
        {...({
          bounces: false,
          overScrollMode: "never",
        } as any)}
      >
        <Tab.Screen
          name="FindColor"
          component={FindColorScreen}
          options={{
            tabBarLabel: 'Find Color',
            swipeEnabled: true,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="eyedropper" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="SavedColors"
          component={SavedColorsScreen}
          options={{
            tabBarLabel: 'Saved',
            swipeEnabled: true,
            tabBarIcon: ({ color }) => <Ionicons name="bookmark-outline" color={color} />,
          }}
        />
      </Tab.Navigator>
      <GlobalHeaderOverlay />
    </View>
  );
}

function GuestCleanup() {
  const { isGuest } = useAuth();
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      // Clear data if guest and app is closing/backgrounding
      if (isGuest && nextAppState !== 'active') {
        console.log("Cleaning up guest photos on session end...");
        await clearRecentPhotos();
      }
    });
    return () => subscription.remove();
  }, [isGuest]);
  return null;
}

export default function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if there's an active session on launch — skip Sign In if so
    getCurrentUser()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setAuthChecked(true));
  }, []);

  // Blank loading screen while we check — avoids flash of Sign In for logged-in users
  if (!authChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F2F2' }}>
        <ActivityIndicator size="large" color="#5A7ACD" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <GuestCleanup />
        <GlobalOfflineModal />
        <NavigationContainer>
          <GlobalGuestModal />
          <Stack.Navigator
            initialRouteName={isAuthenticated ? 'MainTabs' : 'SignIn'}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
            <Stack.Screen
              name="TermsOfService"
              component={TermsOfServiceScreen}
            />
            <Stack.Screen name="UserSettings" component={UserSettingsScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="ObjectSelection" component={ObjectSelectionScreen} />
            <Stack.Screen name="SelectionConfirmation" component={SelectionConfirmationScreen} />
            <Stack.Screen name="ColorResults" component={ColorResultsScreen} />
            <Stack.Screen name="SaveColorPrompt" component={SaveColorPromptScreen} />
            <Stack.Screen name="ColorCompare" component={ColorCompareScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
