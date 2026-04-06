import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../styles/theme";
import { ColorCard } from "../components/ColorCard";
import { SAVED_COLORS } from "../utils/savedColors";
import { SavedColor } from "../types/color";
import { get } from 'aws-amplify/api';

const { width } = Dimensions.get("window");


const FAMILIES = ["All", "Red", "Yellow", "Blue", "Green", "Orange", "Purple", "Brown", "Gray", "Black", "White"];

// --- Stable Header Component ---
const SavedColorsHeader = React.memo(({
  searchQuery,
  setSearchQuery,
  selectedFamily,
  setSelectedFamily
}: any) => {
  return (
    <View style={styles.contentHeader}>
      <View style={styles.titleRow}>
        <Text style={styles.screenTitle}>Saved Colors</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search saved colors..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        {FAMILIES.map((family) => (
          <TouchableOpacity
            key={family}
            style={[
              styles.filterChip,
              selectedFamily === family && styles.filterChipActive
            ]}
            onPress={() => setSelectedFamily(family)}
          >
            <Text style={[
              styles.filterText,
              selectedFamily === family && styles.filterTextActive
            ]}>
              {family}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
});

// --- Stable Empty State Component ---
const SavedColorsEmptyState = React.memo(({
  searchQuery,
  selectedFamily,
  onCtaPress
}: any) => {
  const isFiltered = selectedFamily !== "All" || searchQuery !== "";
  const emptyTitle = isFiltered
    ? `No results ${selectedFamily !== "All" ? `in ${selectedFamily}` : ""}`
    : "No saved colors yet";
  const emptySubtitle = isFiltered
    ? "Try adjusting your search or filters to find what you're looking for."
    : "Capture a color and save it to build your personalized palette collection.";

  return (
    <View style={styles.emptyContainer}>
      <Ionicons
        name={isFiltered ? "search-outline" : "bookmark-outline"}
        size={80}
        color={theme.colors.companyOrange}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>{emptyTitle}</Text>
      <Text style={styles.emptySubtitle}>{emptySubtitle}</Text>
      {!isFiltered && (
        <TouchableOpacity
          style={styles.captureCta}
          onPress={onCtaPress}
        >
          <Text style={styles.captureCtaText}>Start Identifying</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

export default function SavedColorsScreen({ navigation }: any) {
  const { isGuest, showGuestModal } = useAuth();
  const isFocused = useIsFocused();
  const [searchQuery, setSearchQuery] = useState("");
  const [savedColors, setSavedColors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFamily, setSelectedFamily] = useState("All");

  const fetchColors = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const restOperation = get({
        apiName: 'colorfindAPI',
        path: '/users/me/savedColors'
      });
      const { body } = await restOperation.response;
      const data = await body.json();
      
      console.log("Fetched colors successfully:", data);
      setSavedColors(data as any[]);
    } catch (err) {
      console.error("DEBUG: Failed to fetch colors details:", JSON.stringify(err, null, 2));
      setError("could not load your saved colors. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isGuest && isFocused) {
      const timer = setTimeout(() => {
        navigation.navigate("FindColor");
        showGuestModal("Sign in to view your saved colors.");
      }, 10);
      return () => clearTimeout(timer);
    } else if (!isGuest && isFocused) {
      console.log("SavedColorsScreen focused - initiating fetch...");
      fetchColors();
    }
  }, [isGuest, isFocused, navigation, showGuestModal]);

  const filteredColors = SAVED_COLORS.filter((color: SavedColor) => {
    const matchesSearch = color.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFamily = selectedFamily === "All" || color.family === selectedFamily;
    return matchesSearch && matchesFamily;
  });


  if (isGuest) return <View style={styles.container} />;

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.companyOrange} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red', marginBottom: 20 }}>{error}</Text>
        <TouchableOpacity style={styles.captureCta} onPress={() => fetchColors()}>
          <Text style={styles.captureCtaText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SavedColorsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedFamily={selectedFamily}
        setSelectedFamily={setSelectedFamily}
      />
      <FlatList
        data={filteredColors}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <ColorCard
            name={item.name}
            family={item.family}
            hex={item.hex}
            imageUri={item.imageUri}
            onPress={() => { }} // Navigate to detail in Task 9.9
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        ListEmptyComponent={
          <SavedColorsEmptyState
            searchQuery={searchQuery}
            selectedFamily={selectedFamily}
            onCtaPress={() => navigation.navigate("FindColor")}
          />
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8", // Slightly off-white for better visual contrast
  },
  contentHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.companyBlack,
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    height: 54,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#EEE",
    marginBottom: 20,
    // Soft inner shadow effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.companyBlack,
  },
  filterBar: {
    paddingBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "#FFF",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  filterChipActive: {
    backgroundColor: theme.colors.companyBlue,
    borderColor: theme.colors.companyBlue,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  filterTextActive: {
    color: "#FFF",
  },
  scrollContent: {
    paddingBottom: 120, // Clear bottom tab bar
  },
  gridRow: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 50,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.companyBlack,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  captureCta: {
    backgroundColor: theme.colors.companyBlue,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
  },
  captureCtaText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

