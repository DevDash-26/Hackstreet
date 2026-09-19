import type { LucideIcon } from 'lucide-react';

/** Kinds of one-tap interactions the feed cards support. */
export type FeedActionKind = 'interest' | 'join' | 'book' | 'claim' | 'request' | 'save';

/** A single row/card in a section feed. */
export interface FeedItem {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  description?: string;
  /** Compact meta rows such as time, room, contact. */
  meta?: string[];
  tags?: string[];
  /** Optional one-tap action on the card. */
  action?: FeedActionKind;
  /** Base count shown with the action (e.g. number of interested people). */
  count?: number;
}

/** Report-a-new-item configuration for sections that accept submissions. */
export interface SectionReport {
  label: string;
  title: string;
  description: string;
  itemLabel: string;
}

/** Static content for a portal section, defined per role-visible slug. */
export interface SectionFeed {
  description: string;
  /** Optional CTA to let the user add/report an item (lost&found, issues...). */
  report?: SectionReport;
  items: FeedItem[];
}
