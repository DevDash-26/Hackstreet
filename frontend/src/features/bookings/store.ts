import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BookingRoom {
  id: string;
  name: string;
  building: string;
  capacity: number;
  features: string[];
}

export interface BookingSlot {
  index: number;
  label: string;
}

export interface BookingRecord {
  id: string;
  roomId: string;
  roomName: string;
  slotIndex: number;
  slotLabel: string;
  dateOffset: number;
  purpose: string;
  groupSize: number;
  notes?: string;
  createdAt: string;
}

export const BOOKING_ROOMS: BookingRoom[] = [
  {
    id: 'b204',
    name: 'Study Room B-204',
    building: 'CSE Block · Floor 2',
    capacity: 6,
    features: ['Whiteboard', 'Wi-Fi', 'Power outlets'],
  },
  {
    id: 'cse101',
    name: 'Seminar Room CSE 101',
    building: 'CSE Block · Floor 1',
    capacity: 40,
    features: ['Projector', 'AV', 'Whiteboard'],
  },
  {
    id: 'hub5',
    name: 'Innovation Room 5',
    building: 'Innovation Hub',
    capacity: 12,
    features: ['Whiteboard', 'TV screen', 'Wi-Fi'],
  },
  {
    id: 'pod2',
    name: 'Library Pod 2',
    building: 'Library · Level 2',
    capacity: 5,
    features: ['Quiet', 'Wi-Fi', 'Power outlets'],
  },
  {
    id: 'b3',
    name: 'Breakout Room 3',
    building: 'Student Centre · Level 1',
    capacity: 8,
    features: ['Whiteboard', 'Wi-Fi'],
  },
];

/** Bookable hours shown in the grid (09:00 – 18:00). */
export const BOOKING_SLOTS: BookingSlot[] = Array.from({ length: 9 }, (_, i) => ({
  index: i,
  label: `${String(9 + i).padStart(2, '0')}:00–${String(10 + i).padStart(2, '0')}:00`,
}));

/** Upcoming bookable days (today + next 6). */
export function bookingDateLabel(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

/** Stable pseudo-random 0..1 from a string key, so availability is
 *  deterministic across renders and reloads (NFR – robustness). */
function hash01(key: string): number {
  let h = 7;
  for (let i = 0; i < key.length; i += 1) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return (h % 10000) / 10000;
}

export function cellKey(roomId: string, dateOffset: number, slotIndex: number): string {
  return `${roomId}:${dateOffset}:${slotIndex}`;
}

interface BookingState {
  /** Key -> `true` for a slot the current user has tentatively picked. */
  selection: Record<string, boolean>;
  /** Confirmed booking requests. */
  bookings: BookingRecord[];
  toggleSlot: (roomId: string, dateOffset: number, slotIndex: number) => void;
  clearSelection: () => void;
  confirm: (input: {
    roomId: string;
    slotIndex: number;
    dateOffset: number;
    purpose: string;
    groupSize: number;
    notes?: string;
  }) => void;
  /** Whether a room+slot is already occupied (deterministic + confirmed). */
  isOccupied: (roomId: string, dateOffset: number, slotIndex: number) => boolean;
  isSelected: (roomId: string, dateOffset: number, slotIndex: number) => boolean;
  /** Serializable payload of confirmed rooms occupied across all future dates. */
  occupiedCount: () => number;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      selection: {},
      bookings: [],
      toggleSlot: (roomId, dateOffset, slotIndex) => {
        const key = cellKey(roomId, dateOffset, slotIndex);
        if (get().isOccupied(roomId, dateOffset, slotIndex)) return;
        set((state) => ({
          selection: { ...state.selection, [key]: !state.selection[key] },
        }));
      },
      clearSelection: () => set({ selection: {} }),
      confirm: ({ roomId, slotIndex, dateOffset, purpose, groupSize, notes }) => {
        const room = BOOKING_ROOMS.find((r) => r.id === roomId);
        const slot = BOOKING_SLOTS.find((s) => s.index === slotIndex);
        const key = cellKey(roomId, dateOffset, slotIndex);
        const record: BookingRecord = {
          id: `bk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          roomId,
          roomName: room?.name ?? roomId,
          slotIndex,
          slotLabel: slot?.label ?? `${slotIndex}:00`,
          dateOffset,
          purpose,
          groupSize,
          notes,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          bookings: [...state.bookings, record],
          selection: Object.fromEntries(Object.entries(state.selection).filter(([k]) => k !== key)),
        }));
      },
      isOccupied: (roomId, dateOffset, slotIndex) => {
        if (hash01(cellKey(roomId, dateOffset, slotIndex) + '-seed') < 0.22) return true;
        return get().bookings.some(
          (b) => b.roomId === roomId && b.dateOffset === dateOffset && b.slotIndex === slotIndex,
        );
      },
      isSelected: (roomId, dateOffset, slotIndex) =>
        get().selection[cellKey(roomId, dateOffset, slotIndex)] === true,
      occupiedCount: () => get().bookings.length,
    }),
    { name: 'university-portal-bookings' },
  ),
);
