/**
 * Comprehensive Color Space Utility Functions
 * Handles conversions and mathematical operations for RGB, LAB, and Chroma.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface LAB {
  l: number;
  a: number;
  b: number;
  chroma: number;
}

export interface ComparisonMetrics {
  deltaE: number;
  lightnessSource: number;
  lightnessCompare: number;
  aSource: number;
  aCompare: number;
  bSource: number;
  bCompare: number;
  chromaSource: number;
  chromaCompare: number;
  similarityPercent: number;
}

/**
 * Parses a standard LAB string "L, A, B" into an object with Chroma.
 */
export const parseLABString = (labStr?: string | null): LAB => {
  if (!labStr) return { l: 0, a: 0, b: 0, chroma: 0 };
  
  const parts = labStr.split(',').map(p => parseFloat(p.trim()));
  if (parts.length < 3) return { l: 0, a: 0, b: 0, chroma: 0 };
  
  const [l, a, b] = parts;
  const chroma = Math.sqrt(a * a + b * b);
  
  return { l, a, b, chroma };
};

/**
 * Calculates Chroma/Saturation from A and B components.
 */
export const calculateChroma = (a: number, b: number): number => {
  return Math.sqrt(a * a + b * b);
};

/**
 * Converts HEX string to RGB object.
 */
export const hexToRgb = (hex: string): RGB => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
};

/**
 * Formats RGB object into a readable string "R, G, B".
 */
export const formatRGBString = (rgb: RGB): string => {
  return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
};

/**
 * Converts HEX to LAB (approximate sRGB/D65 conversion).
 */
export const hexToLab = (hex: string): LAB => {
  const { r, g, b } = hexToRgb(hex);
  
  // Normalize RGB to [0, 1]
  let rNorm = r / 255;
  let gNorm = g / 255;
  let bNorm = b / 255;

  // Gamma correction
  rNorm = rNorm > 0.04045 ? Math.pow((rNorm + 0.055) / 1.055, 2.4) : rNorm / 12.92;
  gNorm = gNorm > 0.04045 ? Math.pow((gNorm + 0.055) / 1.055, 2.4) : gNorm / 12.92;
  bNorm = bNorm > 0.04045 ? Math.pow((bNorm + 0.055) / 1.055, 2.4) : bNorm / 12.92;

  // RGB to XYZ (D65 white point)
  const x = rNorm * 0.4124 + gNorm * 0.3576 + bNorm * 0.1805;
  const y = rNorm * 0.2126 + gNorm * 0.7152 + bNorm * 0.0722;
  const z = rNorm * 0.0193 + gNorm * 0.1192 + bNorm * 0.9505;

  // XYZ to LAB
  const pivot = (n: number) => n > 0.008856 ? Math.pow(n, 1/3) : (7.787 * n) + 16/116;
  const fx = pivot(x / 0.95047);
  const fy = pivot(y / 1.00000);
  const fz = pivot(z / 1.08883);

  const l = (116 * fy) - 16;
  const a = 500 * (fx - fy);
  const bb = 200 * (fy - fz);

  return {
    l,
    a,
    b: bb,
    chroma: calculateChroma(a, bb),
  };
};

/**
 * Formats LAB object into a readable string "L, A, B".
 */
export const formatLABString = (lab: LAB): string => {
  return `${lab.l.toFixed(1)}, ${lab.a.toFixed(1)}, ${lab.b.toFixed(1)}`;
};

/**
 * Calculates the color difference between two LAB colors using the CIE2000 formula.
 * (Task 6.4)
 */
export const calculateDeltaE2000 = (lab1: LAB, lab2: LAB): number => {
  const L1 = lab1.l;
  const a1 = lab1.a;
  const b1 = lab1.b;
  const L2 = lab2.l;
  const a2 = lab2.a;
  const b2 = lab2.b;

  const avgL = (L1 + L2) / 2;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const avgC = (C1 + C2) / 2;

  const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));

  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);

  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);

  const avgCp = (C1p + C2p) / 2;

  const h1p = (Math.atan2(b1, a1p) * 180 / Math.PI + 360) % 360;
  const h2p = (Math.atan2(b2, a2p) * 180 / Math.PI + 360) % 360;

  let deltaHp;
  if (Math.abs(h1p - h2p) <= 180) {
    deltaHp = h2p - h1p;
  } else if (h2p <= h1p) {
    deltaHp = h2p - h1p + 360;
  } else {
    deltaHp = h2p - h1p - 360;
  }

  const avgHp = Math.abs(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h2p) / 2;

  const T = 1 - 0.17 * Math.cos((avgHp - 30) * Math.PI / 180) +
            0.24 * Math.cos((2 * avgHp) * Math.PI / 180) +
            0.32 * Math.cos((3 * avgHp + 6) * Math.PI / 180) -
            0.20 * Math.cos((4 * avgHp - 63) * Math.PI / 180);

  const deltaLp = L2 - L1;
  const deltaCp = C2p - C1p;
  const deltaHPp = 2 * Math.sqrt(C1p * C2p) * Math.sin((deltaHp / 2) * Math.PI / 180);

  const Sl = 1 + (0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2));
  const Sc = 1 + 0.045 * avgCp;
  const Sh = 1 + 0.015 * avgCp * T;

  const deltaTheta = 30 * Math.exp(-Math.pow((avgHp - 275) / 25, 2));
  const Rc = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
  const Rt = -Math.sin((2 * deltaTheta) * Math.PI / 180) * Rc;

  const deltaE = Math.sqrt(
    Math.pow(deltaLp / Sl, 2) +
    Math.pow(deltaCp / Sc, 2) +
    Math.pow(deltaHPp / Sh, 2) +
    Rt * (deltaCp / Sc) * (deltaHPp / Sh)
  );

  return deltaE;
};

/**
 * Computes all comparison metrics between two colors.
 * (Task 10.3)
 */
export const calculateComparisonMetrics = (source: LAB, compare: LAB): ComparisonMetrics => {
  const dE = calculateDeltaE2000(source, compare);
  
  return {
    deltaE: dE,
    lightnessSource: source.l,
    lightnessCompare: compare.l,
    aSource: source.a,
    aCompare: compare.a,
    bSource: source.b,
    bCompare: compare.b,
    chromaSource: source.chroma,
    chromaCompare: compare.chroma,
    similarityPercent: Math.max(0, 100 - (dE * 2)),
  };
};
