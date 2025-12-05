# YouTube Video System

This document explains how to use the YouTube video playback system in this project.

## Overview

The YouTube system uses the **official YouTube iFrame Player API** to embed and play videos. It follows all YouTube Terms of Service and does not bypass any restrictions.

## Features

- ✅ Official YouTube iFrame embeds
- ✅ Autoplay (after user interaction)
- ✅ Picture-in-Picture support (browser default)
- ✅ Full-screen mode
- ✅ Responsive design (works on all devices)
- ✅ Dynamic video loading from JSON
- ✅ Thumbnail display
- ✅ Error handling

## Adding Videos

### Step 1: Edit the YouTube Links File

Open `src/data/youtubeLinks.json` and add your videos:

```json
[
  {
    "id": "1",
    "url": "https://www.youtube.com/watch?v=VIDEO_ID",
    "title": "Video Title",
    "channelName": "Channel Name",
    "description": "Video description"
  },
  {
    "id": "2",
    "url": "https://youtu.be/VIDEO_ID",
    "title": "Another Video",
    "channelName": "Another Channel",
    "description": "Another description"
  }
]
```

### Supported URL Formats

The system supports multiple YouTube URL formats:

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- Direct video ID: `VIDEO_ID`

### Required Fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier for the video |
| `url` | Yes | YouTube URL or video ID |
| `title` | No | Video title (shown in UI) |
| `channelName` | No | Channel name |
| `description` | No | Video description |

## Folder Structure

```
src/
├── data/
│   └── youtubeLinks.json    # Video links storage
├── components/
│   └── YouTubePlayer.tsx    # iFrame player component
├── pages/
│   ├── Videos.tsx           # Video listing page
│   └── YoutubePlayerScreen.tsx  # Full player page
└── utils/
    └── youtube.ts           # Utility functions
```

## API Key (Optional)

To fetch additional metadata (title, thumbnail, channel name) from YouTube API:

1. Get a YouTube Data API v3 key from [Google Cloud Console](https://console.cloud.google.com/)
2. Store it securely (not in client-side code for production)

**Note**: The API key is only used for metadata fetching. Video playback works without it using embedded thumbnails.

## Utility Functions

### Available Functions

```typescript
import { 
  extractVideoId,      // Extract video ID from URL
  isValidYouTubeUrl,   // Validate YouTube URL
  getEmbedUrl,         // Get embed URL
  getThumbnailUrl,     // Get thumbnail URL
  getWatchUrl,         // Get watch URL
  formatDuration,      // Format ISO duration
  formatViewCount,     // Format view count
  processVideoData     // Process video data
} from '@/utils/youtube';
```

### Examples

```typescript
// Extract video ID
const videoId = extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
// Returns: 'dQw4w9WgXcQ'

// Get thumbnail
const thumbnail = getThumbnailUrl('dQw4w9WgXcQ', 'high');
// Returns: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg'

// Validate URL
const isValid = isValidYouTubeUrl('https://youtu.be/dQw4w9WgXcQ');
// Returns: true
```

## Important Notes

### YouTube Terms of Service Compliance

This implementation:

- ✅ Uses official YouTube iFrame API
- ✅ Does NOT remove YouTube branding
- ✅ Does NOT block ads
- ✅ Does NOT enable background playback
- ✅ Does NOT bypass any restrictions
- ✅ Respects all YouTube policies

### Limitations

- Background audio playback is not supported (YouTube policy)
- Video downloads are not supported (YouTube policy)
- Ad blocking is not supported (YouTube policy)

## Troubleshooting

### Video Not Loading

1. Check if the URL is valid
2. Check if the video is available in your region
3. Check if the video allows embedding

### Invalid URL Toast

If you see "Invalid URL" toast messages:
1. Verify the URL format is correct
2. Make sure the video ID is 11 characters long
3. Check for typos in the URL

### Thumbnail Not Loading

Thumbnails are loaded from YouTube's servers. If they don't load:
1. Check your internet connection
2. The video might be private or deleted
3. Try a different thumbnail quality (default, medium, high, max)
