import { UploadOptions, UploadResult, StorageFile, StorageResult } from './types';

/**
 * Abstract Storage Service Interface
 * 
 * This interface defines ALL file storage operations.
 * UI components should ONLY use this interface, never the implementation directly.
 * 
 * To swap backends:
 * 1. Create a new implementation (e.g., FirebaseStorageService)
 * 2. Update ServiceProvider to use the new implementation
 * 3. No UI changes required
 */
export interface IStorageService {
  // Upload
  upload(options: UploadOptions): Promise<StorageResult<UploadResult>>;
  
  // Download
  getPublicUrl(bucket: string, path: string): string;
  getSignedUrl(bucket: string, path: string, expiresIn?: number): Promise<StorageResult<string>>;
  download(bucket: string, path: string): Promise<StorageResult<Blob>>;
  
  // File Management
  list(bucket: string, path?: string): Promise<StorageResult<StorageFile[]>>;
  delete(bucket: string, path: string): Promise<StorageResult<void>>;
  move(bucket: string, fromPath: string, toPath: string): Promise<StorageResult<void>>;
  copy(bucket: string, fromPath: string, toPath: string): Promise<StorageResult<void>>;
  
  // Utilities
  createBucket(name: string, isPublic?: boolean): Promise<StorageResult<void>>;
  deleteBucket(name: string): Promise<StorageResult<void>>;
}
