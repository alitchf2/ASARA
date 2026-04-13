import { ComparisonMetrics } from "./colorUtils";
import { 
  LIGHTNESS_THRESHOLDS, 
  HUE_THRESHOLDS, 
  CHROMA_THRESHOLDS,
  DESCRIPTORS 
} from "../config/comparisonThresholds";

/**
 * Generates a natural-language summary describing how the Source color 
 * differs from the Compare color.
 * (Task 10.7)
 */
export const generateComparisonSummary = (
  metrics: ComparisonMetrics,
  sourceName: string = "The original color",
  compareName: string = "the target color"
): string => {
  const dL = metrics.lightnessSource - metrics.lightnessCompare;
  const dA = metrics.aSource - metrics.aCompare;
  const dB = metrics.bSource - metrics.bCompare;
  const dC = metrics.chromaSource - metrics.chromaCompare;

  const traits: string[] = [];

  // 1. Lightness
  if (Math.abs(dL) >= LIGHTNESS_THRESHOLDS.MINIMAL) {
    let desc = DESCRIPTORS.SLIGHT;
    if (Math.abs(dL) >= LIGHTNESS_THRESHOLDS.NOTICEABLE) desc = DESCRIPTORS.SIGNIFICANT;
    else if (Math.abs(dL) >= LIGHTNESS_THRESHOLDS.SLIGHT) desc = DESCRIPTORS.NOTICEABLE;
    
    traits.push(`${desc} ${dL > 0 ? "lighter" : "darker"}`);
  }

  // 2. Chroma (Saturation)
  if (Math.abs(dC) >= CHROMA_THRESHOLDS.MINIMAL) {
    let desc = DESCRIPTORS.SLIGHT;
    if (Math.abs(dC) >= CHROMA_THRESHOLDS.SLIGHT) desc = DESCRIPTORS.NOTICEABLE;
    // We only have 2 thresholds for Chroma per requirements, let's add one for significant
    if (Math.abs(dC) >= 30) desc = DESCRIPTORS.SIGNIFICANT; 
    
    traits.push(`${desc} ${dC > 0 ? "more vivid" : "less vivid"}`);
  }

  // 3. Red/Green (A)
  if (Math.abs(dA) >= HUE_THRESHOLDS.MINIMAL) {
    let desc = DESCRIPTORS.SLIGHT;
    if (Math.abs(dA) >= HUE_THRESHOLDS.NOTICEABLE) desc = DESCRIPTORS.SIGNIFICANT;
    else if (Math.abs(dA) >= HUE_THRESHOLDS.SLIGHT) desc = DESCRIPTORS.NOTICEABLE;

    const sourceA = metrics.aSource;
    const compareA = metrics.aCompare;
    let label = "";

    if (sourceA > 0 && compareA > 0) {
      label = `${sourceA > compareA ? "more" : "less"} red`;
    } else if (sourceA < 0 && compareA < 0) {
      label = `${Math.abs(sourceA) > Math.abs(compareA) ? "more" : "less"} green`;
    } else {
      label = `more ${dA > 0 ? "red" : "green"}`;
    }

    traits.push(`${desc} ${label}`);
  }

  // 4. Yellow/Blue (B)
  if (Math.abs(dB) >= HUE_THRESHOLDS.MINIMAL) {
    let desc = DESCRIPTORS.SLIGHT;
    if (Math.abs(dB) >= HUE_THRESHOLDS.NOTICEABLE) desc = DESCRIPTORS.SIGNIFICANT;
    else if (Math.abs(dB) >= HUE_THRESHOLDS.SLIGHT) desc = DESCRIPTORS.NOTICEABLE;

    const sourceB = metrics.bSource;
    const compareB = metrics.bCompare;
    let label = "";

    if (sourceB > 0 && compareB > 0) {
      label = `${sourceB > compareB ? "more" : "less"} yellow`;
    } else if (sourceB < 0 && compareB < 0) {
      label = `${Math.abs(sourceB) > Math.abs(compareB) ? "more" : "less"} blue`;
    } else {
      label = `more ${dB > 0 ? "yellow" : "blue"}`;
    }

    traits.push(`${desc} ${label}`);
  }

  if (traits.length === 0) {
    return "These colors are very similar.";
  }

  // Construct sentence
  // Join first elements with commas, last with "and" or "but"
  // Simple heuristic: if we have more than one trait, check if any contrast
  let joinedTraits = "";
  if (traits.length === 1) {
    joinedTraits = traits[0];
  } else if (traits.length === 2) {
    joinedTraits = `${traits[0]} and ${traits[1]}`;
  } else {
    const last = traits.pop();
    joinedTraits = `${traits.join(", ")} and ${last}`;
  }

  return `${sourceName} is ${joinedTraits} than ${compareName}.`;
};
