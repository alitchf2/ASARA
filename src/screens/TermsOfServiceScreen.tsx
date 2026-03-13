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
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#2B2A2A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.mainTitle}>Terms of Service & Privacy Policy</Text>
        {/* Terms of Service Section */}
        <Text style={styles.sectionTitle}>1. Terms of Service</Text>

        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: theme.colors.companyBlack,
            marginTop: 12,
            marginBottom: 8,
          }}
        >
          As-Is & As-Available
        </Text>
        <Text style={styles.paragraph}>
          The App is provided on an "as-is" and "as-available" basis without
          warranties of any kind.
        </Text>

        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: theme.colors.companyBlack,
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          Lawful Use Only
        </Text>
        <Text style={styles.paragraph}>
          You agree not to use the App for any unlawful purpose or in any way
          that interrupts, damages, or impairs the service.
        </Text>

        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: theme.colors.companyBlack,
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          Content Ownership & License
        </Text>
        <Text style={styles.paragraph}>
          You retain full ownership of all images and content you submit to the
          App. However, by using the App, you grant ASARA a limited license to
          store, process, and transmit your images solely for the purpose of
          identifying colors and providing the service to you.
        </Text>

        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: theme.colors.companyBlack,
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          Changes to Terms
        </Text>
        <Text style={styles.paragraph}>
          ASARA reserves the right to modify these Terms at any time. Continued
          use of the App constitutes acceptance of any updated Terms.
        </Text>

        {/* Privacy Policy Section */}
        <Text style={styles.sectionTitle}>2. Privacy Policy</Text>

        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: theme.colors.companyBlack,
            marginTop: 12,
            marginBottom: 8,
          }}
        >
          Information We Collect
        </Text>
        <View style={styles.bulletListRow}>
          <Text style={styles.bulletPoint}>-</Text>
          <Text style={styles.bulletText}>
            Username: To associate your account and saved colors.
          </Text>
        </View>
        <View style={styles.bulletListRow}>
          <Text style={styles.bulletPoint}>-</Text>
          <Text style={styles.bulletText}>
            Saved Colors & Images: For your personal library and history.
          </Text>
        </View>
        <View style={styles.bulletListRow}>
          <Text style={styles.bulletPoint}>-</Text>
          <Text style={styles.bulletText}>
            Anonymous Analytics: To improve App performance and user experience.
          </Text>
        </View>

        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: theme.colors.companyBlack,
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          Information We Do NOT Collect
        </Text>
        <Text style={styles.paragraph}>
          We do not collect or store your email address, real name, device
          identifiers, precise location data, or biometric data.
        </Text>

        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: theme.colors.companyBlack,
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          How We Use Your Data
        </Text>
        <Text style={styles.paragraph}>
          Your data is used strictly for color identification, maintaining your
          personal library of saved colors, and anonymous analytics for app
          improvement.
        </Text>

        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: theme.colors.companyBlack,
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          Image Privacy & Security
        </Text>
        <Text style={styles.paragraph}>
          Images uploaded to the App are securely isolated in private storage
          (AWS S3) and are accessible only by you. We prioritize the security of
          your user-submitted content.
        </Text>

        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: theme.colors.companyBlack,
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          Data Deletion
        </Text>
        <Text style={styles.paragraph}>
          Upon deleting your account, all associated data, including your saved
          colors and images, will be immediately and completely deleted from our
          servers.
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
