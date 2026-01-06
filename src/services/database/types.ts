// Database Types - Backend Agnostic

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  language: string;
  year: number;
  category: string;
  price?: number;
  pdfUrl?: string;
}

export interface BhajanCredits {
  singers: string[];
  label: string;
  producer: string;
  lyricist: string;
  composer: string;
  copyright: string;
  year: string;
  source: string;
}

export interface Bhajan {
  id: string;
  title: string;
  artist?: string;
  duration?: string;
  audioFile: string;  // Path to audio file
  audioUrl?: string;  // Alternative URL format
  thumbnail?: string;
  thumbnailUrl?: string;
  lrcFile?: string;
  lyrics?: string;
  lyricsUrl?: string;
  category?: string;
  language?: string;
  deity?: string;
  credits?: BhajanCredits;
}

export interface Reel {
  id: string;
  userId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  likes: number;
  views: number;
  createdAt: string;
  user?: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
}

export interface PanchangData {
  date: string;
  city: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  festivals: string[];
  muhurtas: Record<string, string>;
}

export interface PoojaVidhiStep {
  title: string;
  description: string;
}

export interface PoojaVidhi {
  id: string;
  title: string;
  description: string;
  deity: string;
  duration: string;
  difficulty: string;
  materials: string[];
  steps: PoojaVidhiStep[];
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  preferences?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseError {
  code: string;
  message: string;
}

export interface DatabaseResult<T> {
  data: T | null;
  error: DatabaseError | null;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface QueryOptions {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  filters?: Record<string, unknown>;
}
