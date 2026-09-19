import { RoleKeys, type RoleKey } from 'shared';

export interface RoleBadgeMeta {
  label: string;
  /** tailwind classes for the badge (bg/text colors). */
  className: string;
  /** short label used on small screens. */
  shortLabel: string;
}

const ROLE_BADGE_META: Record<RoleKey, RoleBadgeMeta> = {
  [RoleKeys.STUDENT]: {
    label: 'Student',
    shortLabel: 'Student',
    className: 'bg-primary/10 text-primary',
  },
  [RoleKeys.STAFF_ACADEMIC]: {
    label: 'Academic Staff',
    shortLabel: 'Staff',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  },
  [RoleKeys.STAFF_SOCIETY]: {
    label: 'Societies Staff',
    shortLabel: 'Societies',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  },
  [RoleKeys.ADMIN]: {
    label: 'Administrator',
    shortLabel: 'Admin',
    className: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
  },
  [RoleKeys.PARENT]: {
    label: 'Parent / Guardian',
    shortLabel: 'Parent',
    className: 'bg-sky-500/10 text-sky-700 dark:text-sky-400',
  },
};

export const DEFAULT_RESOLVED_ROLE: RoleKey = RoleKeys.STUDENT;

export function getRoleBadgeMeta(role: RoleKey | null): RoleBadgeMeta {
  if (role !== null && ROLE_BADGE_META[role] !== undefined) {
    return ROLE_BADGE_META[role];
  }
  return ROLE_BADGE_META[DEFAULT_RESOLVED_ROLE];
}
