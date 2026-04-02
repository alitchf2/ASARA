import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'react-native';

/**
 * Compresses an image for storage/upload.
 * - Max 2048px on the longest side.
 * - JPEG format at 90% quality.
 * - Strips EXIF data (handled by default in ImageManipulator).
 * 
 * @param uri The local URI of the image to compress.
 * @returns The URI of the compressed image.
 */
export async function compressImage(uri: string): Promise<string> {
  try {
    // 1. Get current dimensions to determine scaling
    const { width, height } = await new Promise<{ width: number, height: number }>((resolve, reject) => {
      Image.getSize(uri, (w, h) => resolve({ width: w, height: h }), reject);
    });

    const actions: ImageManipulator.Action[] = [];
    const maxSide = 2048;

    // 2. Determine if resizing is needed based on longest side
    if (width > maxSide || height > maxSide) {
      if (width > height) {
        actions.push({ resize: { width: maxSide } });
      } else {
        actions.push({ resize: { height: maxSide } });
      }
    }

    // 3. Perform manipulation
    const result = await ImageManipulator.manipulateAsync(
      uri,
      actions,
      { 
        compress: 0.9, 
        format: ImageManipulator.SaveFormat.JPEG 
      }
    );

    return result.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    // Return original URI if compression fails as a fallback
    return uri;
  }
}
