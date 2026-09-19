import { createContext, useContext } from 'react';
import type { RoleKey } from 'shared';
import type { AuthUser } from '@/types';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthContextValue {
  /** Current session user (id, email, portal role). `null` when signed out. */
  user: AuthUser | null;
  /** Convenience accessor for the user's role. */
  role: RoleKey | null;
  status: AuthStatus;
  /** Re-read the role column from `user_roles` (for fresher access, e.g. after an admin changes a role). */
  refreshRole: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
