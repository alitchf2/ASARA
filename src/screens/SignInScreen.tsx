import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Animated,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useKeyboardScroll } from "../hooks/useKeyboardScroll";
import { globalStyles } from "../styles/globalStyles";
import { AuthInput } from "../components/AuthInput";
import { BrandedButton } from "../components/BrandedButton";
import { theme } from "../styles/theme";

export default function SignInScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isFormValid = username.trim().length > 0 && password.trim().length > 0;

  const { translateY, setFocusedField } = useKeyboardScroll(65);

  return (
    <SafeAreaView style={globalStyles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Animated.View style={{ flex: 1, transform: [{ translateY }] }}>
          {/* Logo Section (Upper Third) */}
          <View style={globalStyles.logoContainer}>
            <Image
              source={require("../../assets/ColorfindByASARALogo(Transparent).png")}
              style={globalStyles.logoImage}
              resizeMode="contain"
            />
          </View>
          {/* Form Section */}
          <View style={globalStyles.formContainer}>
            <Text style={globalStyles.screenTitle}>Sign In</Text>
            <AuthInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              onFocus={() => setFocusedField("username")}
            />
            <AuthInput
              isPassword
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField("password")}
            />
            <BrandedButton
              title="Sign In"
              onPress={() => navigation.replace("MainTabs")}
              disabled={!isFormValid}
              style={{ marginTop: 10, marginBottom: 20 }}
            />
            <View style={styles.linksContainer}>
              <BrandedButton
                title="Continue as Guest"
                variant="text"
                onPress={() => navigation.replace("MainTabs", { guest: true })}
              />
              <BrandedButton
                title="Create an Account"
                variant="text"
                onPress={() => navigation.navigate("CreateAccount")}
              />
            </View>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  linksContainer: {
    alignItems: "center",
    gap: 15,
  },
});
