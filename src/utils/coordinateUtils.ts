import { LayoutChangeEvent } from 'react-native';

/**
 * Coordinate Utilities for ASARA Color Identification
 */

export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Maps a tap coordinate (relative to a container) to the actual pixel coordinates of an image
 * displayed using resizeMode="cover".
 * 
 * Logic: 
 * 1. Calculate the aspect ratios of the container and the original image.
 * 2. Determine the scaling factor and the offset (since cover crops the image).
 * 3. Reverse the transformation to find the original pixel.
 */
export const mapTapToOriginalImage = (
  tap: Point,
  container: Dimensions,
  original: Dimensions
): Point => {
  const containerRatio = container.width / container.height;
  const originalRatio = original.width / original.height;

  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;

  if (containerRatio > originalRatio) {
    // Container is wider than image aspect ratio (crops top/bottom)
    scale = container.width / original.width;
    offsetY = (original.height * scale - container.height) / 2;
  } else {
    // Container is taller than image aspect ratio (crops sides)
    scale = container.height / original.height;
    offsetX = (original.width * scale - container.width) / 2;
  }

  // Calculate coordinates in the scaled (and potentially cropped) image space
  const imageX = (tap.x + offsetX) / scale;
  const imageY = (tap.y + offsetY) / scale;

  return {
    x: Math.max(0, Math.min(original.width, Math.round(imageX))),
    y: Math.max(0, Math.min(original.height, Math.round(imageY))),
  };
};

/**
 * Normalizes a point within a coordinate system
 */
export const clampPoint = (point: Point, dimensions: Dimensions): Point => {
  return {
    x: Math.max(0, Math.min(dimensions.width, point.x)),
    y: Math.max(0, Math.min(dimensions.height, point.y)),
  };
};
