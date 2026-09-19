import { createBrowserRouter } from 'react-router-dom';
import { ROLE_KEYS } from 'shared';
import { AppLayout } from '@/components/layout/app-layout';
import { PortalShell } from '@/components/layout/portal-shell';
import { LoginPage } from '@/pages/login';
import { NotFoundPage } from '@/pages/not-found';
import { PortalHome } from '@/pages/portal-home';
import { ProtectedRoute } from './protected-route';
import { RoleRoute } from './role-route';
import { PortalSectionPage } from '@/pages/portal-section';

export const appRouter = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      {
        path: '/portal',
        element: <ProtectedRoute />,
        children: [
          {
            element: <RoleRoute roles={ROLE_KEYS} />,
            children: [
              {
                element: <PortalShell />,
                children: [
                  { index: true, element: <PortalHome /> },
                  { path: ':section', element: <PortalSectionPage /> },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
