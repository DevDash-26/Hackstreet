import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/auth-context';
import { useDemoSession } from '@/app/store/demo-session';

/** Gate for the `/portal` area: requires a real session or a demo persona.
 *  Anonymous visitors are sent back to the login screen. */
export function ProtectedRoute() {
  const { user, status } = useAuth();
  const persona = useDemoSession((s) => s.persona);

  if (status === 'loading') return null;
  if (user !== null || persona !== null) return <Outlet />;
  return <Navigate to="/" replace />;
}