import { Navigate, Outlet } from 'react-router-dom';
import type { RoleKey } from 'shared';
import { usePortalAuth } from '@/hooks/use-portal-auth';

interface RoleRouteProps {
  roles: readonly RoleKey[];
}

/** Restricts a subtree to a set of roles. Users outside the allowed set are
 *  sent back to the portal landing page. */
export function RoleRoute({ roles }: RoleRouteProps) {
  const { role } = usePortalAuth();

  if (roles.includes(role)) return <Outlet />;
  return <Navigate to="/portal" replace />;
}