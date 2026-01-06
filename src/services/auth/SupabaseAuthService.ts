import { supabase } from '@/integrations/supabase/client';
import { IAuthService } from './AuthService';
import { User, Session, AuthCredentials, SignUpData, AuthResult, AuthError } from './types';

/**
 * Supabase Implementation of AuthService
 * 
 * This class contains ALL Supabase-specific auth logic.
 * To replace Supabase, create a new implementation of IAuthService.
 */
export class SupabaseAuthService implements IAuthService {
  
  private mapSupabaseUser(supabaseUser: any): User | null {
    if (!supabaseUser) return null;
    return {
      id: supabaseUser.id,
      email: supabaseUser.email ?? null,
      displayName: supabaseUser.user_metadata?.display_name || supabaseUser.user_metadata?.full_name,
      avatarUrl: supabaseUser.user_metadata?.avatar_url,
      createdAt: supabaseUser.created_at,
    };
  }

  private mapSupabaseSession(session: any): Session | null {
    if (!session) return null;
    return {
      user: this.mapSupabaseUser(session.user)!,
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at,
    };
  }

  private mapError(error: any): AuthError {
    return {
      code: error?.code || 'unknown',
      message: error?.message || 'An unknown error occurred',
    };
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return this.mapSupabaseUser(user);
  }

  async getCurrentSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return this.mapSupabaseSession(session);
  }

  async signIn(credentials: AuthCredentials): Promise<AuthResult<Session>> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return { data: null, error: this.mapError(error) };
    }

    return { data: this.mapSupabaseSession(data.session), error: null };
  }

  async signUp(signUpData: SignUpData): Promise<AuthResult<Session>> {
    const { data, error } = await supabase.auth.signUp({
      email: signUpData.email,
      password: signUpData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          display_name: signUpData.displayName,
          ...signUpData.metadata,
        },
      },
    });

    if (error) {
      return { data: null, error: this.mapError(error) };
    }

    return { data: this.mapSupabaseSession(data.session), error: null };
  }

  async signOut(): Promise<AuthResult<void>> {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { data: null, error: this.mapError(error) };
    }

    return { data: undefined, error: null };
  }

  async resetPassword(email: string): Promise<AuthResult<void>> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { data: null, error: this.mapError(error) };
    }

    return { data: undefined, error: null };
  }

  async updatePassword(newPassword: string): Promise<AuthResult<void>> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { data: null, error: this.mapError(error) };
    }

    return { data: undefined, error: null };
  }

  onAuthStateChange(callback: (session: Session | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        callback(this.mapSupabaseSession(session));
      }
    );

    return () => subscription.unsubscribe();
  }
}
