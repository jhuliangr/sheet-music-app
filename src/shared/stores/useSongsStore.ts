import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Song } from '../types';

interface SongsState {
  songs: Song[];
  addSong: (song: Song) => void;
  deleteSong: (id: string) => void;
}

export const useSongsStore = create<SongsState>()(
  persist(
    (set) => ({
      songs: [],
      addSong: (song) => set((state) => ({ songs: [...state.songs, song] })),
      deleteSong: (id) =>
        set((state) => ({ songs: state.songs.filter((s) => s.id !== id) })),
    }),
    { name: 'sheet-music-songs' },
  ),
);
