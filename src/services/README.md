# Services Layer - Backend Abstraction

This folder contains a **complete backend abstraction layer** that allows you to swap between different backend providers (Supabase, Firebase, custom API, etc.) **without changing any UI code**.

## 📁 Structure

```
src/services/
├── auth/
│   ├── types.ts              # Auth type definitions
│   ├── AuthService.ts        # Abstract interface
│   ├── SupabaseAuthService.ts # Supabase implementation
│   ├── MockAuthService.ts    # Mock for testing/demos
│   └── index.ts
├── database/
│   ├── types.ts              # Database type definitions
│   ├── DatabaseService.ts    # Abstract interface
│   ├── SupabaseDatabaseService.ts # Supabase implementation
│   ├── MockDatabaseService.ts # Mock for testing/demos
│   └── index.ts
├── storage/
│   ├── types.ts              # Storage type definitions
│   ├── StorageService.ts     # Abstract interface
│   ├── SupabaseStorageService.ts # Supabase implementation
│   ├── MockStorageService.ts # Mock for testing/demos
│   └── index.ts
├── ServiceProvider.tsx       # React Context for DI
├── index.ts                  # Main exports
└── README.md                 # This file
```

## 🚀 Quick Start

### 1. Wrap your app with ServiceProvider

```tsx
// main.tsx
import { ServiceProvider } from './services';

ReactDOM.render(
  <ServiceProvider>
    <App />
  </ServiceProvider>,
  document.getElementById('root')
);
```

### 2. Use services in components

```tsx
import { useAuthService, useDatabaseService, useStorageService } from '@/services';

function MyComponent() {
  const auth = useAuthService();
  const database = useDatabaseService();
  const storage = useStorageService();

  const handleLogin = async () => {
    const { data, error } = await auth.signIn({ 
      email: 'user@example.com', 
      password: 'password123' 
    });
    
    if (error) {
      console.error(error.message);
      return;
    }
    
    console.log('Logged in as:', data?.user.email);
  };

  const loadBooks = async () => {
    const { data, error } = await database.getBooks({ page: 1, pageSize: 20 });
    
    if (data) {
      console.log('Books:', data.data);
    }
  };

  const uploadFile = async (file: File) => {
    const { data, error } = await storage.upload({
      bucket: 'avatars',
      path: `user-123/${file.name}`,
      file,
    });
    
    if (data) {
      console.log('Uploaded to:', data.url);
    }
  };
}
```

## 🔄 How to Swap Backends

### Step 1: Create New Implementation Files

Create implementation files for your new backend:

```
src/services/auth/FirebaseAuthService.ts
src/services/database/FirebaseDatabaseService.ts
src/services/storage/FirebaseStorageService.ts
```

### Step 2: Implement the Interfaces

Each file must implement the corresponding interface:

```typescript
// src/services/auth/FirebaseAuthService.ts
import { IAuthService } from './AuthService';
import { User, Session, AuthCredentials, SignUpData, AuthResult } from './types';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export class FirebaseAuthService implements IAuthService {
  private auth = getAuth();

  async signIn(credentials: AuthCredentials): Promise<AuthResult<Session>> {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      );
      
      return {
        data: {
          user: {
            id: result.user.uid,
            email: result.user.email,
            // ... map other fields
          },
          accessToken: await result.user.getIdToken(),
        },
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: { code: error.code, message: error.message },
      };
    }
  }

  // Implement all other methods...
}
```

### Step 3: Update ServiceProvider

Edit `src/services/ServiceProvider.tsx`:

```typescript
// Import your new implementations
import { FirebaseAuthService } from './auth/FirebaseAuthService';
import { FirebaseDatabaseService } from './database/FirebaseDatabaseService';
import { FirebaseStorageService } from './storage/FirebaseStorageService';

// Change the provider constant
const BACKEND_PROVIDER: 'supabase' | 'mock' | 'firebase' = 'firebase';

// Add case in createServices()
function createServices(): ServiceContainer {
  switch (BACKEND_PROVIDER) {
    case 'firebase':
      return {
        auth: new FirebaseAuthService(),
        database: new FirebaseDatabaseService(),
        storage: new FirebaseStorageService(),
      };
    // ... other cases
  }
}
```

### Step 4: That's it! 

**No UI changes required.** All components continue to work because they use the abstract interfaces.

## 📋 Available Interfaces

### IAuthService

| Method | Description |
|--------|-------------|
| `getCurrentUser()` | Get the current authenticated user |
| `getCurrentSession()` | Get the current session with tokens |
| `signIn(credentials)` | Sign in with email/password |
| `signUp(data)` | Create a new account |
| `signOut()` | Sign out the current user |
| `resetPassword(email)` | Send password reset email |
| `updatePassword(password)` | Update current user's password |
| `onAuthStateChange(callback)` | Listen to auth state changes |

### IDatabaseService

| Method | Description |
|--------|-------------|
| `getBooks(options?)` | Get paginated list of books |
| `getBook(id)` | Get a single book |
| `searchBooks(query)` | Search books by title/author |
| `getBhajans(options?)` | Get paginated list of bhajans |
| `getBhajan(id)` | Get a single bhajan |
| `getReels(options?)` | Get paginated list of reels |
| `createReel(reel)` | Upload a new reel |
| `deleteReel(id)` | Delete a reel |
| `likeReel(id)` | Like a reel |
| `getPanchangData(date, city)` | Get panchang for date/city |
| `getUpcomingFestivals(city)` | Get upcoming festivals |
| `getPoojaVidhis(options?)` | Get pooja vidhis |
| `getUserProfile(userId)` | Get user profile |
| `updateUserProfile(userId, data)` | Update user profile |

### IStorageService

| Method | Description |
|--------|-------------|
| `upload(options)` | Upload a file |
| `getPublicUrl(bucket, path)` | Get public URL for a file |
| `getSignedUrl(bucket, path)` | Get signed/temporary URL |
| `download(bucket, path)` | Download a file as Blob |
| `list(bucket, path?)` | List files in a bucket |
| `delete(bucket, path)` | Delete a file |
| `move(bucket, from, to)` | Move a file |
| `copy(bucket, from, to)` | Copy a file |

## 🧪 Testing with Mocks

For development or testing, switch to mock implementations:

```typescript
// In ServiceProvider.tsx
const BACKEND_PROVIDER = 'mock';
```

Mock implementations:
- Simulate network delays
- Store data in memory
- Work without any backend connection
- Include sample data for demos

## ✅ Best Practices

1. **Never import backend directly in UI components**
   ```typescript
   // ❌ DON'T
   import { supabase } from '@/integrations/supabase/client';
   
   // ✅ DO
   import { useAuthService } from '@/services';
   ```

2. **Always use the hooks**
   ```typescript
   const auth = useAuthService();
   const db = useDatabaseService();
   const storage = useStorageService();
   ```

3. **Handle errors consistently**
   ```typescript
   const { data, error } = await db.getBooks();
   if (error) {
     toast.error(error.message);
     return;
   }
   // Use data...
   ```

4. **Type your responses**
   ```typescript
   import { Book, DatabaseResult } from '@/services';
   
   const result: DatabaseResult<Book> = await db.getBook(id);
   ```

## 🔗 Current Backend: Lovable Cloud

This project currently uses **Lovable Cloud** as the backend, which provides:
- ✅ PostgreSQL database
- ✅ Authentication
- ✅ File storage
- ✅ Edge functions
- ✅ Real-time subscriptions

All managed automatically without external account setup.
