// This module implements the mathematical conversion from sRGB to CIELAB space.
// Conversion heavily relies on standard D65 illuminant daylight matrices.

import { RGB } from './colorExtraction';

export interface LAB {
    l: number;
    a: number;
    b: number;
}

/**
 * Standard sRGB gamma expansion.
 * Converts gamma-compressed RGB values (0-255) into linear RGB (0.0 - 1.0).
 */
const srgbToLinear = (colorChannel: number): number => {
    // Normalize into 0-1 scale
    const normalized = colorChannel / 255.0;
    // Apply inverse sRGB transformation
    if (normalized > 0.04045) {
        return Math.pow((normalized + 0.055) / 1.055, 2.4);
    }
    return normalized / 12.92;
};

/**
 * Non-linear transfer function for calculating LAB from XYZ components.
 */
const f = (t: number): number => {
    // Standard CIE parameter thresholds
    const epsilon = 0.008856; // (6/29)^3
    const kappa = 903.3;      // (29/3)^3
    
    if (t > epsilon) {
        return Math.pow(t, 1.0 / 3.0);
    }
    return (kappa * t + 16.0) / 116.0;
};

/**
 * Mathematically transforms an sRGB generic object into precise D65 CIELAB coordinates.
 * 
 * @param rgb - Input generic RGB values between 0-255.
 * @returns CIELAB scaled spacial coordinates representing human perceptual bounds.
 */
export const rgbToLab = ({ r, g, b }: RGB): LAB => {
    // Step 1: Linearize the mapped sRGB pixel payload
    const linearR = srgbToLinear(r);
    const linearG = srgbToLinear(g);
    const linearB = srgbToLinear(b);

    // Step 2: Convert Linear RGB to CIE XYZ (Standard D65 daylight mapping matrix)
    // The coefficients are precisely weighted according to the CIE 1931 standard observer.
    let x = (linearR * 0.4124 + linearG * 0.3576 + linearB * 0.1805) * 100.0;
    let y = (linearR * 0.2126 + linearG * 0.7152 + linearB * 0.0722) * 100.0;
    let z = (linearR * 0.0193 + linearG * 0.1192 + linearB * 0.9505) * 100.0;

    // Step 3: Convert CIE XYZ out into CIELAB coordinates.
    // D65 Daylight scale reference white points mapping constants
    const xn = 95.047;
    const yn = 100.000;
    const zn = 108.883;

    // Normalize against reference white point scalars
    const vx = x / xn;
    const vy = y / yn;
    const vz = z / zn;

    const fx = f(vx);
    const fy = f(vy);
    const fz = f(vz);

    // Step 4: Map mathematical deltas into the perceptual L, a, and b bounding axes
    const lValue = (116.0 * fy) - 16.0;
    const aValue = 500.0 * (fx - fy);
    const bValue = 200.0 * (fy - fz);

    return {
        l: lValue,
        a: aValue,
        b: bValue
    };
};
