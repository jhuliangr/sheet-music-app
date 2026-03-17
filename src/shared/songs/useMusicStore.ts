import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note, Chord } from '../types';

interface MusicState {
  music: (Note | Chord)[];
  setMusic: (music: (Note | Chord)[]) => void;
}

export const useMusicStore = create<MusicState>()(
  persist(
    (set) => ({
      music: [],
      setMusic: (music) => set({ music }),
    }),
    { name: 'music' },
  ),
);
