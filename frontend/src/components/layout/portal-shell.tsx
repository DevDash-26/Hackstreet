import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getNavForRole } from '@/constants/navigation';
import { usePortalAuth } from '@/hooks/use-portal-auth';
import { PortalHeader } from './portal-header';
import { PortalSidebar } from './portal-sidebar';
import { MobileBottomNav } from './mobile-bottom-nav';
import { PortalSearch } from './portal-search';
import { AssistantWidget } from '@/features/assistant/assistant-widget';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Brand } from './brand';

export function PortalShell() {
  const { role } = usePortalAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const nav = getNavForRole(role);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PortalHeader
        onMenuClick={() => setMobileNavOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
      />

      <div className="mx-auto flex w-full max-w-(--breakpoint-2xl) flex-1 items-start">
        {/* Desktop sidebar */}
        <aside className="sticky top-14 hidden max-h-[calc(100dvh-3.5rem)] w-60 shrink-0 self-start overflow-y-auto border-r border-border/80 lg:block">
          <PortalSidebar />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-3 pb-20 pt-5 sm:px-5 lg:pb-8 lg:pt-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileBottomNav nav={nav} />

      {/* Mobile drawer */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="max-w-[280px] p-0 sm:max-w-[280px]"
        >
          <SheetHeader className="border-b border-border/80 px-4 py-3">
            <SheetTitle render={<Brand />} />
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <PortalSidebar onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Command-palette style search */}
      <PortalSearch open={searchOpen} onOpenChange={setSearchOpen} nav={nav} />

      {/* Mr. Damith — AI assistant on every portal page */}
      <AssistantWidget />
    </div>
  );
}
