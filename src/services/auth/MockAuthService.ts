import { IAuthService } from './AuthService';
import { User, Session, AuthCredentials, SignUpData, AuthResult } from './types';

/**
 * Mock Implementation of AuthService
 * 
 * Use this for:
 * - Development without backend
 * - Unit testing
 * - Demos
 */
export class MockAuthService implements IAuthService {
  private currentSession: Session | null = null;
  private listeners: Set<(session: Session | null) => void> = new Set();

  private mockUser: User = {
    id: 'mock-user-123',
    email: 'demo@example.com',
    displayName: 'Demo User',
    avatarUrl: undefined,
    createdAt: new Date().toISOString(),
  };

  async getCurrentUser(): Promise<User | null> {
    return this.currentSession?.user ?? null;
  }

  async getCurrentSession(): Promise<Session | null> {
    return this.currentSession;
  }

  async signIn(credentials: AuthCredentials): Promise<AuthResult<Session>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
      this.currentSession = {
        user: this.mockUser,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + 3600000,
      };
      this.notifyListeners();
      return { data: this.currentSession, error: null };
    }

    return {
      data: null,
      error: { code: 'invalid_credentials', message: 'Invalid email or password' },
    };
  }

  async signUp(data: SignUpData): Promise<AuthResult<Session>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      displayName: data.displayName || data.email.split('@')[0],
      createdAt: new Date().toISOString(),
    };

    this.currentSession = {
      user: newUser,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresAt: Date.now() + 3600000,
    };

    this.notifyListeners();
    return { data: this.currentSession, error: null };
  }

  async signOut(): Promise<AuthResult<void>> {
    this.currentSession = null;
    this.notifyListeners();
    return { data: undefined, error: null };
  }

  async resetPassword(_email: string): Promise<AuthResult<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: undefined, error: null };
  }

  async updatePassword(_newPassword: string): Promise<AuthResult<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: undefined, error: null };
  }

  onAuthStateChange(callback: (session: Session | null) => void): () => void {
    this.listeners.add(callback);
    // Immediately call with current state
    callback(this.currentSession);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentSession));
  }
}
