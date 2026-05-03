/**
 * Compresses an image to be under a certain size limit and resizes it.
 * @param base64Str The original base64 string
 * @param maxWidth The maximum width of the resized image
 * @param maxHeight The maximum height of the resized image
 * @param quality The quality of the JPEG compression (0 to 1)
 */
export const compressImage = (
  base64Str: string, 
  maxWidth: number = 400, 
  maxHeight: number = 400, 
  quality: number = 0.7
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    img.onerror = () => {
      resolve(base64Str); // Fallback to original if error
    };
  });
};
