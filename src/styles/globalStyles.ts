import { StyleSheet, Dimensions } from "react-native";
import { theme } from "./theme";

const { width } = Dimensions.get("window");

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  logoContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: width * 1,
    height: width * 1,
  },
  formContainer: {
    flex: 0.7,
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.companyBlack,
    marginTop: -30,
    marginBottom: 10,
    textAlign: "center",
  },
});
