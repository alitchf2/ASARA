import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity, 
  ScrollView, 
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles";
import { theme } from "../styles/theme";

export default function TermsOfServiceScreen({ navigation }: any) {
  return (
    <SafeAreaView style={globalStyles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color={theme.colors.companyBlack} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mainTitle}>Terms & Privacy</Text>

        {/* Section 1: Terms of Service */}
        <Text style={styles.sectionTitle}>1. Terms of Service</Text>

        <Text style={styles.subHeader}>App Provided "As-Is"</Text>
        <Text style={styles.paragraph}>
          ASARA is provided as a tool for color identification and inspiration. 
          The app is provided on an "as-is" basis, and we cannot guarantee 100% 
          color accuracy. This app should not be used for professional, 
          industrial, or safety-critical applications where exact color matching 
          is required.
        </Text>

        <Text style={styles.subHeader}>Lawful Use Only</Text>
        <Text style={styles.paragraph}>
          By using ASARA, you agree not to use the app for any unlawful purpose 
          or in any way that might damage, disable, or impair our services.
        </Text>

        <Text style={styles.subHeader}>Image Ownership & Storage</Text>
        <Text style={styles.paragraph}>
          You retain full ownership of every image you capture or upload. 
          By using the app, you grant ASARA a limited license to store and 
          process these images strictly to provide the color identification 
          features and your personal library.
        </Text>

        <Text style={styles.subHeader}>Updates to These Terms</Text>
        <Text style={styles.paragraph}>
          ASARA may update these terms at any time. If you continue to use 
          the app after terms are updated, it means you accept the new terms.
        </Text>

        {/* Section 2: Privacy Policy */}
        <Text style={styles.sectionTitle}>2. Privacy Policy</Text>

        <Text style={styles.subHeader}>What We Collect</Text>
        <View style={styles.bulletListRow}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: 'bold' }}>Username:</Text> To identify your account and your saved color library.
          </Text>
        </View>
        <View style={styles.bulletListRow}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: 'bold' }}>Saved Colors & Images:</Text> Any colors and cropped images you explicitly choose to save to your library.
          </Text>
        </View>
        <View style={styles.bulletListRow}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: 'bold' }}>Usage Analytics:</Text> Anonymous data about how the app is used, which helps us make it better.
          </Text>
        </View>

        <Text style={styles.subHeader}>What We DO NOT Collect</Text>
        <Text style={styles.paragraph}>
          We value your privacy. We do not collect your email address, real name, 
          device identifiers, location data, or biometric information.
        </Text>

        <Text style={styles.subHeader}>How Your Data is Used</Text>
        <Text style={styles.paragraph}>
          Your data is used only to provide the app’s features, like identifying 
          colors and maintaining your personal collection. We never sell your 
          data to third parties, and we don't share it for advertising purposes.
        </Text>

        <Text style={styles.subHeader}>Image Privacy</Text>
        <Text style={styles.paragraph}>
          The images you save are stored privately in AWS S3 storage. These 
          images are isolated and accessible only to your specific account.
        </Text>

        <Text style={styles.subHeader}>Deleting Your Data</Text>
        <Text style={styles.paragraph}>
          If you choose to delete your account, we will permanently and 
          immediately remove all of your data, including your saved colors 
          and images, from our servers.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#F5F2F2",
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    // Positioned inside the generic header layout
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 60, // Extra padding at bottom for easy reading
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.companyBlack,
    marginBottom: 24,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.companyBlack,
    marginTop: 24,
    marginBottom: 12,
  },
  subHeader: {
    fontWeight: "bold",
    fontSize: 16,
    color: theme.colors.companyBlack,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: theme.colors.textSecondary, // Slightly softer color than headers for reading comfort
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletListRow: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 8,
  },
  bulletPoint: {
    width: 16,
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
});
