import { NavLink, useNavigate } from 'react-router-dom';
import { LogOutIcon, LifeBuoy, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getNavForRole, type PortalNavGroup } from '@/constants/navigation';
import { APP_NAME } from '@/constants';
import { usePortalAuth } from '@/hooks/use-portal-auth';

function NavItemLink({
  to,
  end,
  icon: Icon,
  label,
  badge,
  onNavigate,
}: {
  to: string;
  end?: boolean;
  icon: LucideIcon;
  label: string;
  badge?: number;
  onNavigate?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors',
          'text-muted-foreground hover:bg-muted hover:text-foreground',
          isActive &&
            'bg-primary/10 font-medium text-primary hover:bg-primary/10 hover:text-primary',
        )
      }
    >
      <Icon className="size-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
          {badge}
        </Badge>
      )}
    </NavLink>
  );
}

function SidebarNav({ nav, onNavigate }: { nav: PortalNavGroup[]; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-5 px-2 py-3">
      {nav.map((group) => (
        <div key={group.label} className="flex flex-col gap-0.5">
          <p className="mb-1 px-2.5 text-xs font-medium tracking-wide text-muted-foreground/80 uppercase">
            {group.label}
          </p>
          {group.items.map((item) => (
            <NavItemLink
              key={item.href}
              to={item.href}
              end={item.href === '/portal'}
              icon={item.icon}
              label={item.title}
              badge={item.badge}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface PortalSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function PortalSidebar({ className, onNavigate }: PortalSidebarProps) {
  const { signOut } = usePortalAuth();
  const navigate = useNavigate();
  const { role } = usePortalAuth();
  const nav = getNavForRole(role);

  return (
    <div className={cn('flex h-full w-60 flex-col', className)}>
      <SidebarNav nav={nav} onNavigate={onNavigate} />

      <div className="mt-auto flex flex-col gap-3 border-t border-border/80 p-3">
        <div className="flex items-start gap-2.5 rounded-lg bg-primary/5 p-3">
          <LifeBuoy className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Need help?</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Browse the help centre or contact IT support.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void signOut().then(() => navigate('/'))}
        >
          <LogOutIcon />
          Sign out
        </Button>
      </div>
    </div>
  );
}

export function PortalSidebarTitle() {
  const { badge } = usePortalAuth();
  return (
    <div className="flex items-center justify-between border-b border-border/80 px-4 py-3">
      <span className="font-heading text-sm font-semibold text-foreground">{APP_NAME}</span>
      <Badge variant="secondary" className={badge.className}>
        {badge.label}
      </Badge>
    </div>
  );
}
