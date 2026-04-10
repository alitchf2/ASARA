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

        // Handle coordinate mapping if display dimensions are provided
        let finalTapX = tapX;
        let finalTapY = tapY;

        if (displayDimensions) {
            const IW = width;
            const IH = height;
            const CW = displayDimensions.width;
            const CH = displayDimensions.height;

            const rawAspect = IW / IH;
            const displayAspect = CW / CH;
            let displayIW = IW;
            let displayIH = IH;

            const isSwapped = (rawAspect > 1 && displayAspect < 1) || (rawAspect < 1 && displayAspect > 1);
            if (isSwapped) {
                 displayIW = IH;
                 displayIH = IW;
            }

            // Calculate 'resizeMode="cover"' scaling factor
            const scale = Math.max(CW / displayIW, CH / displayIH);
            
            // Calculate what physical display dimension the image would take if unrestricted
            const scaledImageWidth = displayIW * scale;
            const scaledImageHeight = displayIH * scale;

            // Cover natively crops by centering. Calculate spatial translation vectors:
            const offsetX = (scaledImageWidth - CW) / 2;
            const offsetY = (scaledImageHeight - CH) / 2;

            // Remap touch space relative to the un-cropped Image plane rendering (0 to scaledDimensions)
            let imageTapX = tapX + offsetX;
            let imageTapY = tapY + offsetY;

            // Downscale back into physical encoded pixel ratios
            let logicalRawX = imageTapX / scale;
            let logicalRawY = imageTapY / scale;

            if (isSwapped) {
                // If Orientation was swapped inside React Native via EXIF mapping,
                // this performs a generic 90-degree mapping correction (assuming primary CCW/CW standards)
                finalTapX = logicalRawY;
                finalTapY = IW - logicalRawX; 
                // Quick bound check for typical 90deg opposite
                if (finalTapY < 0 || finalTapY > height) { finalTapY = logicalRawX; }
            } else {
                finalTapX = logicalRawX;
                finalTapY = logicalRawY;
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
