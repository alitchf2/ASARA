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
    imageUri: require('../assets/mock/midnight_blue.png'),
    rgb: "25, 25, 112",
    lab: "12.78, 21.08, -45.14"
  },
  {
    id: "2",
    name: "Sunset Orange",
    family: "Orange",
    hex: "#FF4500",
    imageUri: require('../assets/mock/sunset_orange.png'),
    rgb: "255, 69, 0",
    lab: "54.34, 67.50, 67.43"
  },
  {
    id: "3",
    name: "Forest Green",
    family: "Green",
    hex: "#228B22",
    imageUri: require('../assets/mock/forest_green.png'),
    rgb: "34, 139, 34",
    lab: "49.34, -52.20, 45.45"
  },
  {
    id: "4",
    name: "Crimson Red",
    family: "Red",
    hex: "#DC143C",
    imageUri: require('../assets/mock/crimson_red.png'),
    rgb: "220, 20, 60",
    lab: "45.74, 70.04, 35.53"
  },
  {
    id: "5",
    name: "Lemon Chiffon",
    family: "Yellow",
    hex: "#FFFACD",
    imageUri: require('../assets/mock/lemon_chiffon.png'),
    rgb: "255, 250, 205",
    lab: "97.45, -4.24, 22.01"
  }
];
