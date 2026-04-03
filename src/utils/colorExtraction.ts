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
 * @param tapX - Mathematical X coordinate of the target selection point
 * @param tapY - Mathematical Y coordinate of the target selection point
 * @returns The {r,g,b} averaged color profile of the 25-pixel footprint
 */
export const calculate5x5Average = (
    base64Data: string, 
    tapX: number, 
    tapY: number
): RGB => {
    try {
        // Convert the lightweight base64 string into a memory buffer and decode the exact matrix
        const imgBuffer = Buffer.from(base64Data, 'base64');
        const rawImageData = decode(imgBuffer, { useTArray: true }); // Returns Uint8Array to save memory
        
        const width = rawImageData.width;
        const height = rawImageData.height;
        const pixelData = rawImageData.data;

        // Bounding Box Logic: Guarantee the 5x5 grid dynamically clamps at the absolute image borders.
        // This stops array out-of-bounds pointer crashes from corner selections. 
        const startX = Math.max(0, tapX - 2);
        const endX = Math.min(width - 1, tapX + 2);
        const startY = Math.max(0, tapY - 2);
        const endY = Math.min(height - 1, tapY + 2);

        let sumR = 0;
        let sumG = 0; 
        let sumB = 0;
        let pixelCount = 0;

        // Iterate identically across the 25 spatial points
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                // Calculate physical 1D array index (stride) for the 2D plane geometry
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
