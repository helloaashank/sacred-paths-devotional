import { IStorageService } from './StorageService';
import { UploadOptions, UploadResult, StorageFile, StorageResult } from './types';

/**
 * Mock Implementation of StorageService
 * 
 * Use this for:
 * - Development without backend
 * - Unit testing
 * - Demos
 */
export class MockStorageService implements IStorageService {
  private mockFiles: Map<string, { file: File; url: string }> = new Map();
  private fileCounter = 0;

  async upload(options: UploadOptions): Promise<StorageResult<UploadResult>> {
    await this.delay();

    // Simulate upload progress
    if (options.onProgress) {
      for (let i = 0; i <= 100; i += 20) {
        await this.delay(50);
        options.onProgress(i);
      }
    }

    const mockUrl = URL.createObjectURL(options.file);
    const key = `${options.bucket}/${options.path}`;
    this.mockFiles.set(key, { file: options.file, url: mockUrl });

    return {
      data: {
        url: mockUrl,
        path: options.path,
        size: options.file.size,
      },
      error: null,
    };
  }

  getPublicUrl(bucket: string, path: string): string {
    const key = `${bucket}/${path}`;
    return this.mockFiles.get(key)?.url || `https://mock-storage.example.com/${bucket}/${path}`;
  }

  async getSignedUrl(bucket: string, path: string, _expiresIn?: number): Promise<StorageResult<string>> {
    await this.delay();
    return { data: this.getPublicUrl(bucket, path), error: null };
  }

  async download(bucket: string, path: string): Promise<StorageResult<Blob>> {
    await this.delay();
    const key = `${bucket}/${path}`;
    const file = this.mockFiles.get(key)?.file;
    
    if (!file) {
      return { data: null, error: { code: 'not_found', message: 'File not found' } };
    }

    return { data: file, error: null };
  }

  async list(bucket: string, path = ''): Promise<StorageResult<StorageFile[]>> {
    await this.delay();
    
    const prefix = path ? `${bucket}/${path}/` : `${bucket}/`;
    const files: StorageFile[] = [];

    this.mockFiles.forEach((value, key) => {
      if (key.startsWith(prefix)) {
        files.push({
          name: key.split('/').pop() || '',
          path: key.replace(`${bucket}/`, ''),
          size: value.file.size,
          contentType: value.file.type,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });

    return { data: files, error: null };
  }

  async delete(bucket: string, path: string): Promise<StorageResult<void>> {
    await this.delay();
    const key = `${bucket}/${path}`;
    this.mockFiles.delete(key);
    return { data: undefined, error: null };
  }

  async move(bucket: string, fromPath: string, toPath: string): Promise<StorageResult<void>> {
    await this.delay();
    const fromKey = `${bucket}/${fromPath}`;
    const toKey = `${bucket}/${toPath}`;
    const file = this.mockFiles.get(fromKey);
    
    if (file) {
      this.mockFiles.set(toKey, file);
      this.mockFiles.delete(fromKey);
    }

    return { data: undefined, error: null };
  }

  async copy(bucket: string, fromPath: string, toPath: string): Promise<StorageResult<void>> {
    await this.delay();
    const fromKey = `${bucket}/${fromPath}`;
    const toKey = `${bucket}/${toPath}`;
    const file = this.mockFiles.get(fromKey);
    
    if (file) {
      this.mockFiles.set(toKey, { ...file });
    }

    return { data: undefined, error: null };
  }

  async createBucket(_name: string, _isPublic?: boolean): Promise<StorageResult<void>> {
    await this.delay();
    return { data: undefined, error: null };
  }

  async deleteBucket(_name: string): Promise<StorageResult<void>> {
    await this.delay();
    return { data: undefined, error: null };
  }

  private delay(ms = 200): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
