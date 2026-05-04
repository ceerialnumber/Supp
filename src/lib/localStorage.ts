/**
 * Local Image Storage - Stores uploaded images in localStorage linked to user/event profiles
 */

const PROFILE_IMAGES_KEY = 'app_profile_images';
const EVENT_IMAGES_KEY = 'app_event_images';

interface StoredImage {
  id: string;
  dataUrl: string;
  filename: string;
  uploadedAt: number;
}

/**
 * Save a profile image for a user and link it to their profile
 */
export async function saveProfileImage(userId: string, file: File | Blob, fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const dataUrl = reader.result as string;
        const images = getStoredProfileImages();
        
        // Store with userId as key
        images[userId] = {
          id: userId,
          dataUrl,
          filename: fileName,
          uploadedAt: Date.now(),
        };
        
        localStorage.setItem(PROFILE_IMAGES_KEY, JSON.stringify(images));
        console.log(`✓ Profile image saved for user ${userId}`);
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Save an event image and link it to event ID
 */
export async function saveEventImage(eventId: string, file: File | Blob, fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const dataUrl = reader.result as string;
        const images = getStoredEventImages();
        
        // Store with eventId as key
        images[eventId] = {
          id: eventId,
          dataUrl,
          filename: fileName,
          uploadedAt: Date.now(),
        };
        
        localStorage.setItem(EVENT_IMAGES_KEY, JSON.stringify(images));
        console.log(`✓ Event image saved for event ${eventId}`);
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Get profile image for a user
 */
export function getProfileImage(userId: string): string | null {
  const images = getStoredProfileImages();
  return images[userId]?.dataUrl || null;
}

/**
 * Get event image for an event
 */
export function getEventImage(eventId: string): string | null {
  const images = getStoredEventImages();
  return images[eventId]?.dataUrl || null;
}

/**
 * Get all stored profile images
 */
export function getStoredProfileImages(): Record<string, StoredImage> {
  try {
    const data = localStorage.getItem(PROFILE_IMAGES_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading profile images from storage:', error);
    return {};
  }
}

/**
 * Get all stored event images
 */
export function getStoredEventImages(): Record<string, StoredImage> {
  try {
    const data = localStorage.getItem(EVENT_IMAGES_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading event images from storage:', error);
    return {};
  }
}

/**
 * Delete profile image for a user
 */
export function deleteProfileImage(userId: string): void {
  const images = getStoredProfileImages();
  delete images[userId];
  localStorage.setItem(PROFILE_IMAGES_KEY, JSON.stringify(images));
}

/**
 * Delete event image for an event
 */
export function deleteEventImage(eventId: string): void {
  const images = getStoredEventImages();
  delete images[eventId];
  localStorage.setItem(EVENT_IMAGES_KEY, JSON.stringify(images));
}

/**
 * Clear all stored images
 */
export function clearAllImages(): void {
  localStorage.removeItem(PROFILE_IMAGES_KEY);
  localStorage.removeItem(EVENT_IMAGES_KEY);
  console.log('All stored images cleared');
}

/**
 * Get storage statistics
 */
export function getStorageStats() {
  const profileImages = getStoredProfileImages();
  const eventImages = getStoredEventImages();
  
  return {
    profileImages: Object.keys(profileImages).length,
    eventImages: Object.keys(eventImages).length,
    totalStored: Object.keys(profileImages).length + Object.keys(eventImages).length,
  };
}
