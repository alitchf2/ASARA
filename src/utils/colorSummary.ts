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

  const traits: { text: string; isPositive: boolean }[] = [];

  const getDescriptor = (val: number, thresholds: any) => {
    const abs = Math.abs(val);
    if (abs >= thresholds.SIGNIFICANT) return DESCRIPTORS.SIGNIFICANT;
    if (abs >= thresholds.NOTICEABLE) return DESCRIPTORS.NOTICEABLE;
    if (abs >= thresholds.SLIGHT) return DESCRIPTORS.SLIGHT;
    return "";
  };

  // 1. Lightness
  if (Math.abs(dL) >= LIGHTNESS_THRESHOLDS.MINIMAL) {
    const desc = getDescriptor(dL, LIGHTNESS_THRESHOLDS);
    traits.push({
      text: `${desc ? desc + " " : ""}${dL > 0 ? "lighter" : "darker"}`,
      isPositive: dL > 0
    });
  }

  // 2. Chroma (Saturation)
  if (Math.abs(dC) >= CHROMA_THRESHOLDS.MINIMAL) {
    const desc = getDescriptor(dC, CHROMA_THRESHOLDS);
    traits.push({
      text: `${desc ? desc + " " : ""}${dC > 0 ? "more vivid" : "less vivid"}`,
      isPositive: dC > 0
    });
  }

  const DOMINANCE_THRESHOLD = 10;

  // 3. Red/Green (A) helper
  const getAHueLabel = () => {
    if (Math.abs(dA) < HUE_THRESHOLDS.MINIMAL) return null;
    
    const desc = getDescriptor(dA, HUE_THRESHOLDS);
    const sourceA = metrics.aSource;
    const compareA = metrics.aCompare;

    // Neutral Barrier: if both are near-neutral, ignore slight differences
    const bothNeutral = Math.abs(sourceA) <= DOMINANCE_THRESHOLD && Math.abs(compareA) <= DOMINANCE_THRESHOLD;
    if (bothNeutral && Math.abs(dA) < 15) return null;
    
    // Case A: Same side (both red or both green)
    if ((sourceA >= 0 && compareA >= 0) || (sourceA <= 0 && compareA <= 0)) {
      const side = (sourceA + compareA) >= 0 ? "red" : "green";
      const isMore = Math.abs(sourceA) > Math.abs(compareA);
      return {
        text: `${desc ? desc + " " : ""}${isMore ? "more" : "less"} ${side}`,
        isPositive: isMore
      };
    }

    // Case B: Crossing zero - check for dominance
    // If we're neutral and comparing against something strong, use 'less [strong-side]'
    if (Math.abs(compareA) > DOMINANCE_THRESHOLD && Math.abs(sourceA) <= DOMINANCE_THRESHOLD) {
      return {
        text: `${desc ? desc + " " : ""}less ${compareA > 0 ? "red" : "green"}`,
        isPositive: false
      };
    }
    // If we're strong and comparing against neutral, use 'more [strong-side]'
    if (Math.abs(sourceA) > DOMINANCE_THRESHOLD && Math.abs(compareA) <= DOMINANCE_THRESHOLD) {
      return {
        text: `${desc ? desc + " " : ""}more ${sourceA > 0 ? "red" : "green"}`,
        isPositive: true
      };
    }

    // Case C: True crossover or both neutral
    return {
      text: `${desc ? desc + " " : ""}more ${dA > 0 ? "red" : "green"}`,
      isPositive: true
    };
  };

  // 4. Yellow/Blue (B) helper
  const getBHueLabel = () => {
    if (Math.abs(dB) < HUE_THRESHOLDS.MINIMAL) return null;

    const desc = getDescriptor(dB, HUE_THRESHOLDS);
    const sourceB = metrics.bSource;
    const compareB = metrics.bCompare;

    // Neutral Barrier: if both are near-neutral, ignore slight differences
    const bothNeutral = Math.abs(sourceB) <= DOMINANCE_THRESHOLD && Math.abs(compareB) <= DOMINANCE_THRESHOLD;
    if (bothNeutral && Math.abs(dB) < 15) return null;
    
    // Case A: Same side
    if ((sourceB >= 0 && compareB >= 0) || (sourceB <= 0 && compareB <= 0)) {
      const side = (sourceB + compareB) >= 0 ? "yellow" : "blue";
      const isMore = Math.abs(sourceB) > Math.abs(compareB);
      return {
        text: `${desc ? desc + " " : ""}${isMore ? "more" : "less"} ${side}`,
        isPositive: isMore
      };
    }

    if (Math.abs(compareB) > DOMINANCE_THRESHOLD && Math.abs(sourceB) <= DOMINANCE_THRESHOLD) {
      return {
        text: `${desc ? desc + " " : ""}less ${compareB > 0 ? "yellow" : "blue"}`,
        isPositive: false
      };
    }
    if (Math.abs(sourceB) > DOMINANCE_THRESHOLD && Math.abs(compareB) <= DOMINANCE_THRESHOLD) {
      return {
        text: `${desc ? desc + " " : ""}more ${sourceB > 0 ? "yellow" : "blue"}`,
        isPositive: true
      };
    }

    return {
      text: `${desc ? desc + " " : ""}more ${dB > 0 ? "yellow" : "blue"}`,
      isPositive: true
    };
  };

  const aTrait = getAHueLabel();
  if (aTrait) traits.push(aTrait);
  
  const bTrait = getBHueLabel();
  if (bTrait) traits.push(bTrait);

  if (traits.length === 0) {
    return `${sourceName} is ${DESCRIPTORS.VIRTUAL_MATCH} to ${compareName}.`;
  }

  // Construct sentence with standard conjunctions
  if (traits.length === 1) {
    return `${sourceName} is ${traits[0].text} than ${compareName}.`;
  }

  if (traits.length === 2) {
    return `${sourceName} is ${traits[0].text} and ${traits[1].text} than ${compareName}.`;
  }

  // 3+ traits: use commas for all but the last
  const lastTrait = traits.pop()!;
  const mainList = traits.map(t => t.text).join(", ");
  
  return `${sourceName} is ${mainList} and ${lastTrait.text} than ${compareName}.`;
};
