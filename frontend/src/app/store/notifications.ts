import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Channels a notification can be delivered over. WhatsApp is the focused
 *  path for admin broadcasts; the rest are kept for future wiring. */
export type NotificationChannel = 'whatsapp' | 'portal' | 'email';

/** Recipient targeting for a broadcast. */
export type NotificationAudience = 'all' | 'students' | 'staff' | 'engineering';

export interface PortalNotification {
  id: string;
  title: string;
  body: string;
  sender: string;
  channel: NotificationChannel[];
  audience: NotificationAudience;
  sentAt: string;
  read: boolean;
}

interface NotificationsState {
  notifications: PortalNotification[];
  /** Append a new notification (used by the admin composer). */
  send: (notification: Omit<PortalNotification, 'id' | 'sentAt' | 'read'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  unread: () => number;
}

const SEED: PortalNotification[] = [
  {
    id: 'seed-1',
    title: 'Assignment deadline tomorrow',
    body: 'Software Engineering – group project submission due 18:00.',
    sender: 'Academic Office',
    channel: ['portal'],
    audience: 'students',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: false,
  },
  {
    id: 'seed-2',
    title: 'Lecture room change',
    body: 'Data Structures moved to CSE 202 from room 101.',
    sender: 'CSE Department',
    channel: ['portal'],
    audience: 'students',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    read: false,
  },
  {
    id: 'seed-3',
    title: 'Guest lecture: AI ethics',
    body: 'Dr. Perera joins us via Zoom on 01 Oct at 15:00.',
    sender: 'Academic Office',
    channel: ['portal'],
    audience: 'all',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 49).toISOString(),
    read: false,
  },
];

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: SEED,
      send: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: `ntf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              sentAt: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ],
        })),
      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      unread: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: 'university-portal-notifications' },
  ),
);

/** Format an ISO timestamp as a short relative label, e.g. "2h ago". */
export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
