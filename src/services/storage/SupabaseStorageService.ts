import { supabase } from '@/integrations/supabase/client';
import { IStorageService } from './StorageService';
import { UploadOptions, UploadResult, StorageFile, StorageResult, StorageError } from './types';

/**
 * Supabase Implementation of StorageService
 * 
 * This class contains ALL Supabase-specific storage logic.
 * To replace Supabase, create a new implementation of IStorageService.
 */
export class SupabaseStorageService implements IStorageService {
  
  private mapError(error: any): StorageError {
    return {
      code: error?.statusCode || error?.code || 'unknown',
      message: error?.message || 'An unknown storage error occurred',
    };
  }

  async upload(options: UploadOptions): Promise<StorageResult<UploadResult>> {
    try {
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(options.path, options.file, {
          contentType: options.contentType,
          upsert: options.upsert ?? false,
        });

      if (error) throw error;

      const publicUrl = this.getPublicUrl(options.bucket, data.path);

      return {
        data: {
          url: publicUrl,
          path: data.path,
          size: options.file.size,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: this.mapError(error) };
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async getSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<StorageResult<string>> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) throw error;

      return { data: data.signedUrl, error: null };
    } catch (error) {
      return { data: null, error: this.mapError(error) };
    }
  }

  async download(bucket: string, path: string): Promise<StorageResult<Blob>> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: this.mapError(error) };
    }
  }

  async list(bucket: string, path = ''): Promise<StorageResult<StorageFile[]>> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path);

      if (error) throw error;

      const files: StorageFile[] = (data || []).map(file => ({
        name: file.name,
        path: path ? `${path}/${file.name}` : file.name,
        size: file.metadata?.size || 0,
        contentType: file.metadata?.mimetype || 'application/octet-stream',
        createdAt: file.created_at,
        updatedAt: file.updated_at,
      }));

      return { data: files, error: null };
    } catch (error) {
      return { data: null, error: this.mapError(error) };
    }
  }

  async delete(bucket: string, path: string): Promise<StorageResult<void>> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;

      return { data: undefined, error: null };
    } catch (error) {
      return { data: null, error: this.mapError(error) };
    }
  }

  async move(bucket: string, fromPath: string, toPath: string): Promise<StorageResult<void>> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .move(fromPath, toPath);

      if (error) throw error;

      return { data: undefined, error: null };
    } catch (error) {
      return { data: null, error: this.mapError(error) };
    }
  }

  async copy(bucket: string, fromPath: string, toPath: string): Promise<StorageResult<void>> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .copy(fromPath, toPath);

      if (error) throw error;

      return { data: undefined, error: null };
    } catch (error) {
      return { data: null, error: this.mapError(error) };
    }
  }

  async createBucket(name: string, isPublic = false): Promise<StorageResult<void>> {
    try {
      const { error } = await supabase.storage.createBucket(name, {
        public: isPublic,
      });

      if (error) throw error;

      return { data: undefined, error: null };
    } catch (error) {
      return { data: null, error: this.mapError(error) };
    }
  }

  async deleteBucket(name: string): Promise<StorageResult<void>> {
    try {
      const { error } = await supabase.storage.deleteBucket(name);

      if (error) throw error;

      return { data: undefined, error: null };
    } catch (error) {
      return { data: null, error: this.mapError(error) };
    }
  }
}
