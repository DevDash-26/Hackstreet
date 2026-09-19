import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { isRoleKey, type RoleKey } from 'shared';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { AuthUser } from '@/types';
import { AuthContext, type AuthContextValue, type AuthStatus } from './auth-context';

interface RoleRow {
  role: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  // Read the role assigned in `public.user_roles` for a user. Returns `null`
  // when no role row exists yet or the RLS query fails.
  const loadRole = useCallback(async (userId: string): Promise<RoleKey | null> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle()
      .returns<RoleRow | null>();

    if (error !== null) {
      console.error('Failed to load user role', error.message);
      return null;
    }
    const role = data?.role;
    return role !== undefined && isRoleKey(role) ? role : null;
  }, []);

  const sync = useCallback(
    async (sessionUser: User | null): Promise<void> => {
      if (sessionUser === null) {
        setUser(null);
        setStatus('unauthenticated');
        return;
      }

      // Load the user's role AFTER we know who they are by reading the
      // session's user id against `user_roles`.
      const role = await loadRole(sessionUser.id);
      setUser({ id: sessionUser.id, email: sessionUser.email ?? '', role });
      setStatus('authenticated');
    },
    [loadRole],
  );

  useEffect(() => {
    const supabase = getSupabaseClient();
    let isMounted = true;

    // Initial hydration from the stored session.
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (isMounted) void sync(data.session?.user ?? null);
      })
      .catch((error: unknown) => {
        console.error('Failed to read initial session', error);
        if (isMounted) setStatus('unauthenticated');
      });

    // Then react to future sign-in / sign-out / token-refresh events.
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) void sync(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [sync]);

  const refreshRole = useCallback(async (): Promise<void> => {
    if (user === null) return;
    const role = await loadRole(user.id);
    setUser((current) => (current === null ? current : { ...current, role }));
  }, [user, loadRole]);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      await getSupabaseClient().auth.signOut();
    } catch (error) {
      console.error('Sign out failed', error);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    role: user?.role ?? null,
    status,
    refreshRole,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
