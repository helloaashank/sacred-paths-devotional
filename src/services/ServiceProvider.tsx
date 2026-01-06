import React, { createContext, useContext, useMemo } from 'react';

// Import service interfaces
import { IAuthService } from './auth/AuthService';
import { IDatabaseService } from './database/DatabaseService';
import { IStorageService } from './storage/StorageService';

// Import implementations - CHANGE THESE TO SWAP BACKENDS
import { SupabaseAuthService } from './auth/SupabaseAuthService';
import { SupabaseDatabaseService } from './database/SupabaseDatabaseService';
import { SupabaseStorageService } from './storage/SupabaseStorageService';

// For mock/development mode, uncomment these:
// import { MockAuthService } from './auth/MockAuthService';
// import { MockDatabaseService } from './database/MockDatabaseService';
// import { MockStorageService } from './storage/MockStorageService';

/**
 * Service Container Interface
 * 
 * This defines all available services that can be injected into components.
 * UI components use these interfaces, never the concrete implementations.
 */
export interface ServiceContainer {
  auth: IAuthService;
  database: IDatabaseService;
  storage: IStorageService;
}

/**
 * Service Context
 * 
 * React Context for dependency injection of services.
 */
const ServiceContext = createContext<ServiceContainer | null>(null);

/**
 * Determine which implementation to use
 * 
 * Options:
 * - 'supabase' (default) - Uses Lovable Cloud/Supabase backend
 * - 'mock' - Uses mock implementations for development/testing
 * - 'firebase' - Would use Firebase (implement FirebaseXxxService classes)
 * - 'custom' - Your custom backend implementation
 */
const BACKEND_PROVIDER: 'supabase' | 'mock' = 'supabase';

/**
 * Create service instances based on the selected provider
 */
function createServices(): ServiceContainer {
  switch (BACKEND_PROVIDER) {
    case 'mock':
      // Import dynamically to avoid bundling when not used
      const { MockAuthService } = require('./auth/MockAuthService');
      const { MockDatabaseService } = require('./database/MockDatabaseService');
      const { MockStorageService } = require('./storage/MockStorageService');
      return {
        auth: new MockAuthService(),
        database: new MockDatabaseService(),
        storage: new MockStorageService(),
      };
    
    case 'supabase':
    default:
      return {
        auth: new SupabaseAuthService(),
        database: new SupabaseDatabaseService(),
        storage: new SupabaseStorageService(),
      };
  }
}

/**
 * ServiceProvider Component
 * 
 * Wrap your app with this provider to enable service injection.
 * 
 * @example
 * ```tsx
 * <ServiceProvider>
 *   <App />
 * </ServiceProvider>
 * ```
 */
export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const services = useMemo(() => createServices(), []);

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
}

/**
 * useServices Hook
 * 
 * Access all services in your components.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { auth, database, storage } = useServices();
 *   
 *   const handleLogin = async () => {
 *     const result = await auth.signIn({ email, password });
 *   };
 * }
 * ```
 */
export function useServices(): ServiceContainer {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}

/**
 * Individual service hooks for convenience
 */
export function useAuthService(): IAuthService {
  return useServices().auth;
}

export function useDatabaseService(): IDatabaseService {
  return useServices().database;
}

export function useStorageService(): IStorageService {
  return useServices().storage;
}
