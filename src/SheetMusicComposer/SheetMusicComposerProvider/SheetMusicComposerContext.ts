import { createContext } from 'react';
import type { useSongs } from '#shared/songs/useSongs';
import type { NoteName } from '#shared/types';

type SongsState = ReturnType<typeof useSongs>;

export interface SheetMusicComposerContextValue extends SongsState {
  activeNoteId: string | null;
  handleNoteSelect: (note: NoteName) => void;
  handleChordSelect: (chord: NoteName) => void;
}

export const SheetMusicComposerContext = createContext<
  SheetMusicComposerContextValue | undefined
>(undefined);
