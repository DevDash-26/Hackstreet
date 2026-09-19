import { Outlet } from 'react-router-dom';
import type { RoleKey } from 'shared';

interface RoleRouteProps {
  roles: readonly RoleKey[];
}

export function RoleRoute({ roles: _roles }: RoleRouteProps) {
  return <Outlet />;
}
