import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { getNavForRole } from '@/constants/navigation';
import { usePortalAuth } from '@/hooks/use-portal-auth';
import { RoleKeys } from 'shared';
import { getSectionFeed } from '@/features/sections/data';
import { SectionFeedPage } from '@/features/sections/section-feed-page';
import { AdminFinancePage } from '@/features/finance/finance-analytics';
import { AdminNotificationComposer } from '@/features/whatsapp/composer';
import { BookingGridPage } from '@/features/bookings/booking-grid';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Route handler for every `/portal/:section`. Resolves the matching nav item
 * for the current role and renders the right content:
 *  - role-specific admin screens (finance analytics, WhatsApp broadcasts)
 *  - data-driven section feeds for everything else (courses, dining, sports…)
 *  - a fallback screen for unknown sections.
 */
export function PortalSectionPage() {
  const { section } = useParams<{ section: string }>();
  const { role } = usePortalAuth();
  const nav = getNavForRole(role);

  const item = useMemo(() => {
    if (section === undefined) return undefined;
    return nav.flatMap((group) => group.items).find((entry) => entry.href === `/portal/${section}`);
  }, [nav, section]);

  const Icon = item?.icon;

  if (role === RoleKeys.ADMIN) {
    if (section === 'finance') {
      return <AdminFinancePage />;
    }
    if (section === 'announcements') {
      return (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              Broadcast notifications
            </h1>
            <p className="text-sm text-muted-foreground">
              Send announcements to students and staff. WhatsApp messages also appear inside the
              recipient&rsquo;s portal notification bell.
            </p>
          </div>
          <AdminNotificationComposer />
        </div>
      );
    }
  }

  if (section === 'bookings') {
    return <BookingGridPage />;
  }

  const feed = getSectionFeed(section);

  if (feed) {
    return (
      <SectionFeedPage
        title={item?.title ?? section ?? 'Portal section'}
        description={feed.description}
        feed={feed}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {Icon ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Icon className="size-5 text-primary" />
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {item?.title ?? 'Portal section'}
            </h1>
          </div>
        </div>
      ) : null}

      <Card className="flex flex-col items-center justify-center gap-4 border-dashed py-14 text-center">
        <CardHeader>
          <CardTitle className="mx-auto inline-flex items-center gap-2">
            <Construction className="size-5" />
            Under construction
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Badge variant="secondary">{section}</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
