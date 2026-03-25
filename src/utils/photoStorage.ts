import { Directory, File, Paths } from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_PHOTOS_KEY = 'ASARA_RECENT_PHOTOS';
const MAX_PHOTOS = 6;

// Pre-define the base directory object
const PHOTOS_DIR = new Directory(Paths.document, 'recent_photos');

/**
 * Ensures the directory for storing recent photos exists.
 */
async function ensureDirExists() {
  if (!PHOTOS_DIR.exists) {
    // New API: create() is asynchronous
    await PHOTOS_DIR.create();
  }
}

/**
 * Saves a photo from a temporary URI to permanent storage.
 * Handles FIFO logic to keep only the 6 most recent photos.
 */
export async function savePhoto(tempUri: string): Promise<string | null> {
  try {
    await ensureDirExists();

    // 1. Get current list
    const stored = await AsyncStorage.getItem(RECENT_PHOTOS_KEY);
    let photos: string[] = stored ? JSON.parse(stored) : [];

    // 2. Prepare new file
    const filename = `photo_${Date.now()}.jpg`;
    const destinationFile = new File(PHOTOS_DIR, filename);

    // 3. Move file from temp cache to permanent storage
    // The camera URI usually starts with 'file://'
    const tempFile = new File(tempUri);
    
    // Using copy for persistence
    await tempFile.copy(destinationFile);

    // 4. Update index (FIFO)
    // We store the URI string in the index
    const newUri = destinationFile.uri;
    photos.unshift(newUri);

    // 5. Cleanup oldest if over limit
    if (photos.length > MAX_PHOTOS) {
      const oldestUri = photos.pop();
      if (oldestUri) {
        const oldestFile = new File(oldestUri);
        if (oldestFile.exists) {
          await oldestFile.delete();
        }
      }
    }

    // 6. Save index
    await AsyncStorage.setItem(RECENT_PHOTOS_KEY, JSON.stringify(photos));

    return newUri;
  } catch (error) {
    console.error('Error in savePhoto:', error);
    return null;
  }
}

/**
 * Retrieves the list of recent photo URIs.
 */
export async function getRecentPhotos(): Promise<string[]> {
  try {
    const stored = await AsyncStorage.getItem(RECENT_PHOTOS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error in getRecentPhotos:', error);
    return [];
  }
}

/**
 * Clears all recent photos from both filesystem and index.
 * Used for guest session cleanup.
 */
export async function clearRecentPhotos(): Promise<void> {
  try {
    const photos = await getRecentPhotos();
    
    // Delete files
    for (const uri of photos) {
      const file = new File(uri);
      if (file.exists) {
        await file.delete();
      }
    }

    // Clear index
    await AsyncStorage.removeItem(RECENT_PHOTOS_KEY);
  } catch (error) {
    console.error('Error in clearRecentPhotos:', error);
  }
}
