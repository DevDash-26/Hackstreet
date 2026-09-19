import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  at: string;
}

interface ChatState {
  open: boolean;
  messages: ChatMessage[];
  pending: boolean;
  setOpen: (open: boolean) => void;
  send: (content: string, reply: string) => void;
  setPending: (pending: boolean) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      open: false,
      messages: [],
      pending: false,
      setOpen: (open) => set({ open }),
      send: (content, reply) =>
        set((state) => ({
          pending: false,
          messages: [
            ...state.messages,
            { id: `u-${Date.now()}`, role: 'user', content, at: new Date().toISOString() },
            {
              id: `a-${Date.now()}`,
              role: 'assistant',
              content: reply,
              at: new Date().toISOString(),
            },
          ],
        })),
      setPending: (pending) => set({ pending }),
      clear: () => set({ messages: [], pending: false }),
    }),
    { name: 'university-portal-assistant', partialize: (state) => ({ messages: state.messages }) },
  ),
);

export const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hi, I\u2019m Mr. Damith \u2014 your campus assistant. Ask me about timetables, room bookings, fees or campus support.',
  at: new Date().toISOString(),
};
