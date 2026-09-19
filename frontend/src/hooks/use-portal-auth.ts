import { useCallback } from 'react';
import { RoleKeys, type RoleKey } from 'shared';
import { useAuth } from '@/app/providers/auth-context';
import { useDemoSession, type DemoPersona } from '@/app/store/demo-session';
import { getRoleBadgeMeta } from '@/constants/roles';

export const FALLBACK_DISPLAY_NAME = 'Portal User';
export const FALLBACK_EMAIL = '';

interface PortalAuthValue {
  /** Effective role: real Supabase role when present, otherwise the demo persona. */
  role: RoleKey;
  /** Email shown in the user menu. */
  email: string;
  /** Name/email shown in the user menu. */
  displayName: string;
  /** Initials for the avatar. */
  initials: string;
  /** Role badge metadata for the current role. */
  badge: ReturnType<typeof getRoleBadgeMeta>;
  signOut: () => Promise<void>;
  signInAs: (persona: DemoPersona) => void;
  refreshRole: () => Promise<void>;
}

function toInitials(nameOrEmail: string): string {
  return nameOrEmail
    .split('@')[0]
    .split(/[._\s-]+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** Resolve the role + identity the portal should render with. In template mode
 *  there is no real session, so the persisted demo persona drives this; when a
 *  real session exists it takes precedence. */
export function usePortalAuth(): PortalAuthValue {
  const { role: authRole, refreshRole, signOut } = useAuth();
  const persona = useDemoSession((s) => s.persona);
  const clearPersona = useDemoSession((s) => s.clear);

  const role: RoleKey = authRole ?? persona?.role ?? RoleKeys.STUDENT;
  const email = persona?.email ?? FALLBACK_EMAIL;
  const displayName = persona?.name ?? (email !== '' ? email : FALLBACK_DISPLAY_NAME);
  const initials = toInitials(displayName);
  const badge = getRoleBadgeMeta(role);

  const handleSignOut = useCallback(async (): Promise<void> => {
    clearPersona();
    await signOut();
  }, [clearPersona, signOut]);

  const signInAs = useCallback((next: DemoPersona) => {
    useDemoSession.getState().signInAs(next);
  }, []);

  return {
    role,
    email,
    displayName,
    initials,
    badge,
    signOut: handleSignOut,
    signInAs,
    refreshRole,
  };
}
