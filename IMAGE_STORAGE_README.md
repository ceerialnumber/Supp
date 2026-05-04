# Image Storage System

## Overview
Images are now stored locally in the browser using **localStorage** instead of depending on Firebase or external services. This ensures images persist across sessions and are always available.

## Image Storage Structure

### Default Images (from `/public/images`)
These built-in images are used as fallbacks:
- `User.jpg` - Default profile picture
- `Snap1.jpg`, `Snap2.jpg`, `Snap3.jpg` - Snapshot gallery images
- Event images: `boardgame.jpg`, `conference.jpg`, `craft-event.jpg`, etc.

### User Uploaded Images
Stored in browser localStorage:
- **Profile Images**: Stored by user name (e.g., `app_profile_images: { "john_doe": { dataUrl, filename, uploadedAt } }`)
- **Event Images**: Stored by event ID (e.g., `app_event_images: { "event_1234": { dataUrl, filename, uploadedAt } }`)

## How It Works

1. **User uploads a profile picture during signup**
   - Image is compressed to 400x400px
   - Converted to base64 and stored in localStorage with temp user ID
   - After signup, migrated to real user ID

2. **User uploads event image**
   - Image is compressed to 1024x1024px
   - Stored in localStorage linked to event ID

3. **Viewing profile**
   - First checks localStorage for stored image
   - Falls back to Firestore image URL if exists
   - Falls back to default `/images/User.jpg`

## localStorage Keys
- `app_profile_images` - Stores all user profile images
- `app_event_images` - Stores all event cover images

## Storage Size
- localStorage typically allows 5-10MB per domain
- Compressed images (base64) use ~20-30% more space than binary

## Fallback Chain
1. **localStorage** (app-stored image)
2. **Firestore/Firebase URL** (if uploaded to cloud)
3. **Vercel Blob URL** (if uploaded via /api/upload)
4. **Default public image** (`/images/User.jpg` or event category image)

## Clearing Images
To clear all stored images (for debugging):
```javascript
// In browser console:
localStorage.removeItem('app_profile_images');
localStorage.removeItem('app_event_images');
```

## Benefits
✅ No external service dependency
✅ Images persist across sessions
✅ Instant loading (no network requests)
✅ Works offline
✅ No CORS issues
✅ Linked to user/event profiles
