import { RoleKeys } from 'shared';
import { usePortalAuth } from '@/hooks/use-portal-auth';
import { PortalPage } from '@/pages/portal';
import { LecturerDashboard } from '@/pages/dashboards/lecturer-dashboard';
import { AdminDashboard } from '@/pages/dashboards/admin-dashboard';
import { ParentDashboard } from '@/pages/dashboards/parent-dashboard';

/** Role-aware landing page. Each persona gets its own dashboard built on mock
 *  data so signing in as a different role lands on the right screen. */
export function PortalHome() {
  const { role } = usePortalAuth();

  switch (role) {
    case RoleKeys.STAFF_ACADEMIC:
      return <LecturerDashboard />;
    case RoleKeys.ADMIN:
      return <AdminDashboard />;
    case RoleKeys.PARENT:
      return <ParentDashboard />;
    case RoleKeys.STAFF_SOCIETY:
      return <LecturerDashboard />;
    default:
      return <PortalPage />;
  }
}
