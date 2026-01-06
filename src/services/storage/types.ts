// Storage Types - Backend Agnostic

export interface UploadOptions {
  bucket: string;
  path: string;
  file: File;
  contentType?: string;
  upsert?: boolean;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  url: string;
  path: string;
  size: number;
}

export interface StorageFile {
  name: string;
  path: string;
  size: number;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

export interface StorageError {
  code: string;
  message: string;
}

export interface StorageResult<T> {
  data: T | null;
  error: StorageError | null;
}

// Common bucket names
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  REELS: 'reels',
  THUMBNAILS: 'thumbnails',
  PDFS: 'pdfs',
  AUDIO: 'audio',
} as const;

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];
