/**
 * UI Color Theme Generation Utilities
 * 
 * Implements high-performance, zero-dependency color space conversions (HEX <-> HSL)
 * and harmonic palette generation.
 */

interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

/**
 * Converts a HEX color string (#RRGGBB) to HSL.
 */
export const hexToHsl = (hex: string): HSL => {
  // Remove hash if present
  const cleanHex = hex.replace('#', '');
  
  // Convert HEX to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

/**
 * Converts HSL values to a HEX color string (#RRGGBB).
 */
export const hslToHex = (h: number, s: number, l: number): string => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

/**
 * Generates a 5-swatch Complementary Theme.
 * Rotates the central hue by 180 degrees and samples +/- 10 and +/- 20 degrees.
 */
export const generateComplementaryTheme = (hex: string): string[] => {
  const { h, s, l } = hexToHsl(hex);
  
  // Find the complementary hue (opposite on the color wheel)
  const compH = (h + 180) % 360;

  // Generate swatches around the complement
  // Pattern: [H-20, H-10, H, H+10, H+20] relative to complement
  const hOffsets = [-20, -10, 0, 10, 20];

  return hOffsets.map(offset => {
    let finalH = (compH + offset) % 360;
    if (finalH < 0) finalH += 360;
    return hslToHex(finalH, s, l);
  });
};
