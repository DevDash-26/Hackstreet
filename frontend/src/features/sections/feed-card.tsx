import { CalendarDays, Check, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFeedStore, adjustedCount } from '@/features/sections/store';
import type { FeedActionKind, FeedItem } from './types';

const ACTION_META: Record<FeedActionKind, { label: string; activeLabel: string }> = {
  interest: { label: 'Show interest', activeLabel: 'Interested' },
  join: { label: 'Join', activeLabel: 'Joined' },
  book: { label: 'Book', activeLabel: 'Booked' },
  claim: { label: 'Claim', activeLabel: 'Claimed' },
  request: { label: 'Request', activeLabel: 'Requested' },
  save: { label: 'Save', activeLabel: 'Saved' },
};

function ActionButton({ kind, id, count }: { kind: FeedActionKind; id: string; count?: number }) {
  const isActive = useFeedStore((state) => state.isActive(kind, id));
  const toggle = useFeedStore((state) => state.toggle);
  const meta = ACTION_META[kind];
  const displayCount = adjustedCount(count, isActive);

  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      className="shrink-0"
      aria-pressed={isActive}
      onClick={() => toggle(kind, id)}
    >
      {isActive ? <Check /> : null}
      {isActive ? meta.activeLabel : meta.label}
      {count !== undefined ? <span className="tabular-nums opacity-70">{displayCount}</span> : null}
    </Button>
  );
}

function MetaIcon({ value }: { value: string }) {
  const isLocation = /(room|block|hall|centre|floor|gate|level|wing|lobby|atrium)/i.test(value);
  const Icon = isLocation ? MapPin : CalendarDays;
  return <Icon className="size-3.5 shrink-0" aria-hidden />;
}

export function FeedCard({ item }: { item: FeedItem }) {
  const Icon = item.icon;
  const meta = item.meta ?? [];
  const tags = item.tags ?? [];
  return (
    <Card size="sm" className="gap-2">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="grid grid-rows-[auto_auto] gap-1">
            <CardTitle>
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden />
                </span>
                {item.title}
              </span>
            </CardTitle>
            {item.subtitle ? <CardDescription>{item.subtitle}</CardDescription> : null}
          </div>
          {item.action ? <ActionButton kind={item.action} id={item.id} count={item.count} /> : null}
        </div>
      </CardHeader>
      {item.description ? (
        <CardContent>
          <p className="text-sm text-foreground/90">{item.description}</p>
        </CardContent>
      ) : null}
      {meta.length > 0 ? (
        <CardContent className="flex flex-col gap-1">
          {meta.map((value) => (
            <div key={value} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MetaIcon value={value} />
              <span>{value}</span>
            </div>
          ))}
        </CardContent>
      ) : null}
      {tags.length > 0 ? (
        <CardContent className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="h-5">
              {tag}
            </Badge>
          ))}
        </CardContent>
      ) : null}
    </Card>
  );
}
