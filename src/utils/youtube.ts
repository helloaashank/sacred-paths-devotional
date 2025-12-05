/**
 * YouTube Utility Functions
 * Extract video IDs, validate URLs, and format data
 */

// Regular expressions for different YouTube URL formats
const YOUTUBE_REGEX_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
];

/**
 * Extract video ID from various YouTube URL formats
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/, youtube.com/shorts/
 */
export function extractVideoId(url: string): string | null {
  if (!url) return null;
  
  const trimmedUrl = url.trim();
  
  for (const pattern of YOUTUBE_REGEX_PATTERNS) {
    const match = trimmedUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Validate if a string is a valid YouTube URL or video ID
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}

/**
 * Get YouTube embed URL from video ID
 */
export function getEmbedUrl(videoId: string, autoplay: boolean = false): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  
  if (autoplay) {
    params.set('autoplay', '1');
  }
  
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Get YouTube thumbnail URL (multiple quality options)
 */
export function getThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'max' = 'high'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    max: 'maxresdefault',
  };
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Get standard YouTube watch URL from video ID
 */
export function getWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Format duration from ISO 8601 format (PT1H2M3S) to readable format (1:02:03)
 */
export function formatDuration(isoDuration: string): string {
  if (!isoDuration) return '';
  
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format view count to readable format (1.2M, 500K, etc.)
 */
export function formatViewCount(count: number | string): string {
  const num = typeof count === 'string' ? parseInt(count, 10) : count;
  
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  return num.toString();
}

export interface YouTubeVideo {
  id: string;
  url: string;
  videoId?: string;
  title?: string;
  channelName?: string;
  description?: string;
  thumbnail?: string;
}

/**
 * Process raw video data and add computed fields
 */
export function processVideoData(video: YouTubeVideo): YouTubeVideo & { videoId: string; thumbnail: string } {
  const videoId = extractVideoId(video.url) || '';
  
  return {
    ...video,
    videoId,
    thumbnail: video.thumbnail || getThumbnailUrl(videoId, 'high'),
  };
}
