import { User, Session, AuthCredentials, SignUpData, AuthResult } from './types';

/**
 * Abstract Authentication Service Interface
 * 
 * This interface defines ALL authentication operations.
 * UI components should ONLY use this interface, never the implementation directly.
 * 
 * To swap backends:
 * 1. Create a new implementation (e.g., FirebaseAuthService)
 * 2. Update ServiceProvider to use the new implementation
 * 3. No UI changes required
 */
export interface IAuthService {
  // Session Management
  getCurrentUser(): Promise<User | null>;
  getCurrentSession(): Promise<Session | null>;
  
  // Authentication
  signIn(credentials: AuthCredentials): Promise<AuthResult<Session>>;
  signUp(data: SignUpData): Promise<AuthResult<Session>>;
  signOut(): Promise<AuthResult<void>>;
  
  // Password Management
  resetPassword(email: string): Promise<AuthResult<void>>;
  updatePassword(newPassword: string): Promise<AuthResult<void>>;
  
  // Session Listener
  onAuthStateChange(callback: (session: Session | null) => void): () => void;
}
