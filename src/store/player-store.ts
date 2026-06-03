import type { Routine } from '@good-bodies/types';
import { create } from 'zustand';

interface PlayerState {
  // The routine currently open in the full-screen player, or null if closed.
  activeRoutine: Routine | null;
  open: (routine: Routine) => void;
  close: () => void;
}

/** Tracks which routine (if any) is playing in the full-screen player. */
export const usePlayerStore = create<PlayerState>((set) => ({
  activeRoutine: null,
  open: (routine) => set({ activeRoutine: routine }),
  close: () => set({ activeRoutine: null }),
}));
