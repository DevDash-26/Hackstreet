import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { PortalNavGroup } from '@/constants/navigation';

interface MobileBottomNavProps {
  nav: PortalNavGroup[];
}

/**
 * Mobile-only bottom navigation bar mirroring the mockup: shows the first 5
 * navigation items as icon+label buttons.
 */
export function MobileBottomNav({ nav }: MobileBottomNavProps) {
  const items = nav.flatMap((group) => group.items).slice(0, 5);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border/80 bg-background/95 backdrop-blur-sm lg:hidden"
      aria-label="Primary navigation"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/portal'}
            className={({ isActive }) =>
              cn(
                'flex min-w-0 flex-1 flex-col items-center gap-1 px-1 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] text-xs',
                'text-muted-foreground transition-colors hover:text-foreground',
                isActive && 'text-primary',
              )
            }
          >
            <Icon className="size-5" />
            <span className="max-w-full truncate text-[10px] leading-tight">{item.title}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
