// Auth Types - Backend Agnostic
export interface User {
  id: string;
  email: string | null;
  displayName?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface Session {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends AuthCredentials {
  displayName?: string;
  metadata?: Record<string, unknown>;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthResult<T> {
  data: T | null;
  error: AuthError | null;
}
