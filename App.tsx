import React, { useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FindColorScreen from "./src/screens/FindColorScreen";
import SavedColorsScreen from "./src/screens/SavedColorsScreen";
import SignInScreen from "./src/screens/SignInScreen";
import CreateAccountScreen from "./src/screens/CreateAccountScreen";
import TermsOfServiceScreen from "./src/screens/TermsOfServiceScreen";
import UserSettingsScreen from "./src/screens/UserSettingsScreen";

//Task 1.2: environment switcher + validation
import { ENV } from "./src/config";
import { validateEnvOrThrow } from "./src/config/validateEnv";

//Task1.3: Amplify setup
import { configureAmplify } from "./src/config/amplify";
configureAmplify();

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Dimensions, View } from "react-native";
import { GlobalOfflineModal } from "./src/components/GlobalOfflineModal";
import { CustomTabBar } from "./src/components/CustomTabBar";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { GlobalGuestModal } from "./src/components/GlobalGuestModal";

const Tab = createMaterialTopTabNavigator();
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
      }}
      {...({
        bounces: false,
        overScrollMode: "never",
      } as any)}
    >
      <Tab.Screen
        name="FindColor"
        component={FindColorScreen}
        options={{ tabBarLabel: "Find Color" }}
      />
      <Tab.Screen
        name="SavedColors"
        component={SavedColorsScreen}
        options={{ tabBarLabel: "Saved" }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
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
