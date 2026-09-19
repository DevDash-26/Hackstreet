import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FeedActionKind } from './types';

/** Persisted interaction state for feed cards: which items the current user
 *  has registered interest in, joined, booked, claimed, etc. Keyed by
 *  `${kind}:${itemId}` so different sections never collide. */
interface FeedState {
  active: Record<string, boolean>;
  toggle: (kind: FeedActionKind, id: string) => void;
  isActive: (kind: FeedActionKind, id: string) => boolean;
}

const KEY = (kind: FeedActionKind, id: string) => `${kind}:${id}`;

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      active: {},
      toggle: (kind: FeedActionKind, id: string) => {
        const key = KEY(kind, id);
        set((state) => ({ active: { ...state.active, [key]: !state.active[key] } }));
      },
      isActive: (kind: FeedActionKind, id: string) => get().active[KEY(kind, id)] === true,
    }),
    { name: 'university-portal-feed-interactions' },
  ),
);

/** Display count = base count plus 1 when the current user has toggled it. */
export function adjustedCount(base: number | undefined, isActive: boolean): number {
  return (base ?? 0) + (isActive ? 1 : 0);
}
