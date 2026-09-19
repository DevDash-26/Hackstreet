import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { PortalNavGroup } from '@/constants/navigation';
import { cn } from '@/lib/utils';

interface PortalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nav: PortalNavGroup[];
}

export function PortalSearch({ open, onOpenChange, nav }: PortalSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = nav.flatMap((group) => group.items);
    if (q === '') return items.slice(0, 6);
    return items.filter((item) => item.title.toLowerCase().includes(q)).slice(0, 6);
  }, [nav, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Search across the portal.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 border-b border-border/70 pb-3">
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courses, services&hellip;"
            className="border-none shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
        </div>
        <ul className="flex flex-col gap-0.5">
          {results.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <button
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => {
                    setQuery('');
                    onOpenChange(false);
                    navigate(item.href);
                  }}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className={cn('min-w-0 flex-1 truncate')}>{item.title}</span>
                </button>
              </li>
            );
          })}
          {results.length === 0 && (
            <p className="px-2.5 py-6 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
