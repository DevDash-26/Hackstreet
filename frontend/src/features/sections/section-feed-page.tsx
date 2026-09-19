import { useMemo, useState } from 'react';
import { Search, Plus, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { SectionFeed } from './types';
import { FeedCard } from './feed-card';

interface SectionFeedPageProps {
  title: string;
  description: string;
  feed: SectionFeed;
}

export function SectionFeedPage({
  title,
  description: pageDescription,
  feed,
}: SectionFeedPageProps) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('All');
  const [submitted, setSubmitted] = useState(false);

  const tags = useMemo(() => {
    const all = feed.items.flatMap((item) => item.tags ?? []);
    return ['All', ...Array.from(new Set(all))];
  }, [feed.items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return feed.items.filter((item) => {
      const matchesTag = activeTag === 'All' || (item.tags ?? []).includes(activeTag);
      const matchesQuery =
        q.length === 0 ||
        [item.title, item.subtitle ?? '', item.description ?? '', ...(item.meta ?? [])]
          .join(' ')
          .toLowerCase()
          .includes(q);
      return matchesTag && matchesQuery;
    });
  }, [feed.items, query, activeTag]);

  const handleSubmit = () => setSubmitted(true);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{pageDescription}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search items&hellip;"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        {feed.report ? (
          <Dialog onOpenChange={() => setSubmitted(false)}>
            <DialogTrigger
              render={
                <Button variant="outline" className="sm:ml-auto">
                  <Plus />
                  {feed.report.label}
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{feed.report.title}</DialogTitle>
                <DialogDescription>{feed.report.description}</DialogDescription>
              </DialogHeader>
              <form
                className="flex flex-col gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="report-title">{feed.report.itemLabel}</Label>
                  <Input id="report-title" name="title" required placeholder="Title" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="report-details">Details</Label>
                  <Textarea
                    id="report-details"
                    name="details"
                    rows={3}
                    placeholder="Tell us the details&hellip;"
                    required
                  />
                </div>
                {submitted ? (
                  <p className="text-sm font-medium text-success">
                    Thanks! Your report has been submitted.
                  </p>
                ) : null}
                <DialogFooter showCloseButton>
                  <Button type="submit" className="sm:ml-auto">
                    <Send />
                    Submit
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant={activeTag === tag ? 'default' : 'secondary'}
            className="cursor-pointer select-none"
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No items match &ldquo;{query}&rdquo;. Try a different search or tag.
        </p>
      ) : null}
    </div>
  );
}
