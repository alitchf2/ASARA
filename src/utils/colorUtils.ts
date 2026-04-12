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
