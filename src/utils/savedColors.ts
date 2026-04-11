import { SavedColor } from '../types/color';

// Core list of saved colors
// Centralized for use in both SavedColorsScreen and ColorSelectionModal
// Hard-coded for development until Task 9.2/9.4 are complete
export const SAVED_COLORS: SavedColor[] = [
  {
    id: "1",
    name: "Midnight Blue",
    family: "Blue",
    hex: "#191970",
    imageUri: require('../assets/mock/midnight_blue.png')
  },
  {
    id: "2",
    name: "Sunset Orange",
    family: "Orange",
    hex: "#FF4500",
    imageUri: require('../assets/mock/sunset_orange.png')
  },
  {
    id: "3",
    name: "Forest Green",
    family: "Green",
    hex: "#228B22",
    imageUri: require('../assets/mock/forest_green.png')
  },
  {
    id: "4",
    name: "Crimson Red",
    family: "Red",
    hex: "#DC143C",
    imageUri: require('../assets/mock/crimson_red.png')
  },
  {
    id: "5",
    name: "Lemon Chiffon",
    family: "Yellow",
    hex: "#FFFACD",
    imageUri: require('../assets/mock/lemon_chiffon.png')
  }
];
