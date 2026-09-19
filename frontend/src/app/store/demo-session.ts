import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RoleKey } from 'shared';

/** A persona chosen on the login screen. Used while the app runs in
 *  "template mode" — no Supabase session exists, so the demo role routing
 *  is driven entirely by this persisted selection. */
export interface DemoPersona {
  role: RoleKey;
  name: string;
  email: string;
}

interface DemoSessionState {
  persona: DemoPersona | null;
  signInAs: (persona: DemoPersona) => void;
  clear: () => void;
}

export const useDemoSession = create<DemoSessionState>()(
  persist(
    (set) => ({
      persona: null,
      signInAs: (persona: DemoPersona) => set({ persona }),
      clear: () => set({ persona: null }),
    }),
    { name: 'university-portal-demo-session' },
  ),
);
