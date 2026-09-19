import type { RoleKey } from 'shared';

/** Authenticated portal user (from the Supabase Auth session + `user_roles`). */
export interface AuthUser {
  id: string;
  email: string;
  /** Role assigned in `public.user_roles`; `null` until a role row exists. */
  role: RoleKey | null;
}
