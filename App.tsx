import React, { useMemo, useState, useEffect } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Dimensions, View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getCurrentUser } from 'aws-amplify/auth';
import FindColorScreen from './src/screens/FindColorScreen';
import SavedColorsScreen from './src/screens/SavedColorsScreen';
import SignInScreen from './src/screens/SignInScreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import TermsOfServiceScreen from './src/screens/TermsOfServiceScreen';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { CustomTabBar } from "./src/components/CustomTabBar";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { GlobalGuestModal } from "./src/components/GlobalGuestModal";
import UserSettingsScreen from './src/screens/UserSettingsScreen';
=======
>>>>>>> 41108dd (Adding accout creation functionality, with persistent sign-in status. Edited Cognito allowances)

//Task 1.2: environment switcher + validation
import { ENV } from "./src/config";
import { validateEnvOrThrow } from "./src/config/validateEnv";

//Task 1.3: Amplify setup
import { configureAmplify } from './src/config/amplify';
configureAmplify();

import { GlobalOfflineModal } from './src/components/GlobalOfflineModal';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { isGuest } = useAuth();
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      tabBarPosition="bottom"
      initialRouteName="FindColor"
      screenOptions={{
        swipeEnabled: !isGuest,
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
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="eyedropper" size={size} color={color} />
          ),
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
        <GlobalOfflineModal />
        <NavigationContainer>
          <GlobalGuestModal />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
            <Stack.Screen
              name="TermsOfService"
              component={TermsOfServiceScreen}
            />
            <Stack.Screen name="UserSettings" component={UserSettingsScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
