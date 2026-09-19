export const RoleKeys = {
  STUDENT: 'student',
  STAFF_ACADEMIC: 'staff_academic',
  STAFF_SOCIETY: 'staff_society',
  ADMIN: 'admin',
  PARENT: 'parent',
} as const;

export type RoleKey = (typeof RoleKeys)[keyof typeof RoleKeys];

export const ROLE_KEYS: readonly RoleKey[] = Object.values(RoleKeys);

export function isRoleKey(value: string): value is RoleKey {
  return ROLE_KEYS.includes(value as RoleKey);
}
