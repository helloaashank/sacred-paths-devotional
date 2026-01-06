// Main exports for the service layer
// ================================

// Service Provider and Hooks
export {
  ServiceProvider,
  useServices,
  useAuthService,
  useDatabaseService,
  useStorageService,
} from './ServiceProvider';
export type { ServiceContainer } from './ServiceProvider';

// Auth Service
export type { IAuthService } from './auth/AuthService';
export type { 
  User, 
  Session, 
  AuthCredentials, 
  SignUpData, 
  AuthError, 
  AuthResult 
} from './auth/types';

// Database Service
export type { IDatabaseService } from './database/DatabaseService';
export type {
  Book,
  Bhajan,
  Reel,
  PanchangData,
  PoojaVidhi,
  UserProfile,
  DatabaseError,
  DatabaseResult,
  PaginatedResult,
  QueryOptions,
} from './database/types';

// Storage Service
export type { IStorageService } from './storage/StorageService';
export type {
  UploadOptions,
  UploadResult,
  StorageFile,
  StorageError,
  StorageResult,
} from './storage/types';
export { STORAGE_BUCKETS } from './storage/types';

// ================================
// HOW TO SWAP BACKENDS
// ================================
// 
// 1. Create new implementation files:
//    - src/services/auth/FirebaseAuthService.ts
//    - src/services/database/FirebaseDatabaseService.ts
//    - src/services/storage/FirebaseStorageService.ts
//
// 2. Each file must implement the corresponding interface:
//    - IAuthService
//    - IDatabaseService
//    - IStorageService
//
// 3. Update ServiceProvider.tsx:
//    - Import your new implementations
//    - Add a new case in the switch statement
//    - Change BACKEND_PROVIDER constant
//
// 4. NO UI CHANGES REQUIRED!
//
// ================================
