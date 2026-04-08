import { decode } from 'jpeg-js';
import { Buffer } from 'buffer'; // Expo React Native standard polyfill

export interface RGB {
    r: number;
    g: number;
    b: number;
}

/**
 * Validates and decodes a base64 JPEG image, then mathematically computes the arithmetic 
 * average of the RGB channels for a precise 5x5 pixel area centered around the user tap point.
 * 
 * @param base64Data - Raw base64 string slice representing the JPEG (NO "data:image/jpeg;base64," prefix)
 * @param tapX - Mathematical X coordinate of the target selection point (screen or pixel depending on displayDimensions)
 * @param tapY - Mathematical Y coordinate of the target selection point (screen or pixel depending on displayDimensions)
 * @param displayDimensions - Optional display size to enable robust mapping for rotated images
 * @returns The {r,g,b} averaged color profile of the 25-pixel footprint
 */
export const calculate5x5Average = (
    base64Data: string,
    tapX: number,
    tapY: number,
    displayDimensions?: { width: number, height: number }
): RGB => {
    try {
        // Convert the lightweight base64 string into a memory buffer and decode the exact matrix
        const imgBuffer = Buffer.from(base64Data, 'base64');
        const rawImageData = decode(imgBuffer, { useTArray: true }); // Returns Uint8Array to save memory

        const width = rawImageData.width;
        const height = rawImageData.height;
        const pixelData = rawImageData.data;

        console.log(`[DEBUG] Image Decoded: ${width}x${height}`);

        // Handle coordinate mapping if display dimensions are provided (Phase 1 Fix for rotation)
        let finalTapX = tapX;
        let finalTapY = tapY;

        if (displayDimensions) {
            const rawAR = width / height;
            const displayAR = displayDimensions.width / displayDimensions.height;
            
            // Check for potential orientation mismatch (e.g., Raw is Landscape, Display is Portrait)
            // This is a common issue with EXIF orientation metadata.
            const isSwapped = (rawAR > 1 && displayAR < 1) || (rawAR < 1 && displayAR > 1);

            if (isSwapped) {
                // If orientation is swapped, we map display Y to raw X and display X to raw Y (90deg logic)
                finalTapX = (tapY / displayDimensions.height) * width;
                finalTapY = (tapX / displayDimensions.width) * height;
            } else {
                finalTapX = (tapX / displayDimensions.width) * width;
                finalTapY = (tapY / displayDimensions.height) * height;
            }
        }

        // Bounding Box Logic: Guarantee the 5x5 grid dynamically clamps at the absolute image borders.
        // We also clamp the tap coords themselves to be safe.
        finalTapX = Math.max(0, Math.min(width - 1, finalTapX));
        finalTapY = Math.max(0, Math.min(height - 1, finalTapY));

        const startX = Math.max(0, Math.round(finalTapX - 2));
        const endX = Math.min(width - 1, Math.round(finalTapX + 2));
        const startY = Math.max(0, Math.round(finalTapY - 2));
        const endY = Math.min(height - 1, Math.round(finalTapY + 2));

        console.log(`[DEBUG] Final Bounds: X(${startX}-${endX}), Y(${startY}-${endY}) | Final Tap: (${finalTapX.toFixed(1)},${finalTapY.toFixed(1)})`);

        let sumR = 0;
        let sumG = 0;
        let sumB = 0;
        let pixelCount = 0;

        // Iterate identically across the 25 spatial points
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                // Every parsed pixel strictly maintains 4 specific byte channels: (R, G, B, A)
                const index = (y * width + x) * 4;

                sumR += pixelData[index];
                sumG += pixelData[index + 1];
                sumB += pixelData[index + 2];
                pixelCount++;
            }
        }

        // Failsafe for 0-dimension images or bizarre edge bugs to prevent divide-by-zero NaN vectors
        if (pixelCount === 0) {
            console.log("No pixels found in bounds. RGB sums: ", sumR, sumG, sumB);
            return { r: 0, g: 0, b: 0 };
        }

        // Return perfectly rounded whole-number RGB indices as visually interpretable ints
        return {
            r: Math.round(sumR / pixelCount),
            g: Math.round(sumG / pixelCount),
            b: Math.round(sumB / pixelCount)
        };
    } catch (err: any) {
        console.error("Critical failure during 5x5 exact point color extraction:", err);
        throw new Error("Failed to decode target image for analysis.");
    }
};
