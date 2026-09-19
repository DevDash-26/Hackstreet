import { BellIcon, CircleHelp, MessageCircle, MenuIcon, SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './theme-toggle';
import { Brand } from './brand';
import { usePortalAuth } from '@/hooks/use-portal-auth';
import { useNotificationsStore, timeAgo } from '@/app/store/notifications';

interface PortalHeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export function PortalHeader({ onMenuClick, onSearchClick }: PortalHeaderProps) {
  const { signOut, displayName, initials, badge } = usePortalAuth();
  const navigate = useNavigate();
  const notifications = useNotificationsStore((state) => state.notifications);
  const unread = useNotificationsStore((state) => state.unread());
  const markAllRead = useNotificationsStore((state) => state.markAllRead);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-(--breakpoint-2xl) items-center gap-2 px-3 sm:px-4">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </Button>

        <Brand className="min-w-0 flex-1 lg:flex-none" />

        <div className="mx-2 hidden flex-1 md:block">
          <button
            onClick={onSearchClick}
            className="group flex h-8 w-full max-w-64 items-center gap-2 rounded-lg border border-input bg-muted/50 px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/80"
          >
            <SearchIcon className="size-4 shrink-0" />
            <span className="flex-1 truncate text-left">Search courses, services&hellip;</span>
            <kbd className="hidden rounded border border-border bg-background px-1 font-sans text-[10px] text-muted-foreground sm:inline-flex">
              Ctrl K
            </kbd>
          </button>
        </div>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-label="Search"
            onClick={onSearchClick}
          >
            <SearchIcon />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Help and support">
            <CircleHelp />
          </Button>
          <ThemeToggle />

          <DropdownMenu onOpenChange={(open) => void (!open && markAllRead())}>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" aria-label={`Notifications (${unread} unread)`}>
                  <BellIcon />
                  {unread > 0 ? (
                    <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                      {unread}
                    </span>
                  ) : null}
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications
                  <Badge variant="secondary" className="h-5">
                    {unread} new
                  </Badge>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <DropdownMenuItem className="flex-col items-start">
                  <span className="text-sm text-muted-foreground">You&rsquo;re all caught up.</span>
                </DropdownMenuItem>
              ) : (
                notifications.slice(0, 8).map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex-col items-start">
                    <span className="flex w-full items-center justify-between gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {notification.title}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {timeAgo(notification.sentAt)}
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground">{notification.body}</span>
                    <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-primary">
                      {notification.channel.includes('whatsapp') ? (
                        <>
                          <MessageCircle className="size-3" aria-hidden />
                          WhatsApp broadcast
                        </>
                      ) : null}
                      {notification.channel.includes('whatsapp') && notification.channel.length > 1
                        ? ' · '
                        : null}
                      {notification.channel.filter((c) => c !== 'whatsapp').join(', ')}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  className="ml-1 flex items-center gap-2 rounded-full p-0.5 text-left transition-opacity hover:opacity-80"
                  aria-label="Open user menu"
                >
                  <Avatar className="size-8 ring-2 ring-border">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{displayName}</span>
                  <span className="text-xs">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </span>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help &amp; Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => void signOut().then(() => navigate('/'))}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
