import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Flat map of editable field key -> value, one entry per profile field. */
export type FieldDict = Record<string, string>;

/** Profile edits, persisted per portal identity. Keyed by the persona's
 *  email so switching roles keeps each persona's own draft independent. */
interface ProfileState {
  data: Record<string, FieldDict>;
  savedAt: Record<string, string>;
  save: (owner: string, patch: FieldDict) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      data: {},
      savedAt: {},
      save: (owner, patch) =>
        set((state) => ({
          data: { ...state.data, [owner]: { ...(state.data[owner] ?? {}), ...patch } },
          savedAt: { ...state.savedAt, [owner]: new Date().toISOString() },
        })),
    }),
    {
      name: 'university-portal-profile',
      partialize: (state) => ({ data: state.data, savedAt: state.savedAt }),
    },
  ),
);