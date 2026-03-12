import { useMemo, type ReactNode } from 'react';
import { useSongs } from '#shared/useSongs';
import { DURATION_BEATS } from '#shared/constants';
import type { NoteName } from '#shared/types';
import {
  JazzSheetsContext,
  type JazzSheetsContextValue,
} from './JazzSheetsContext';
import { PlaybackProvider } from './PlaybackProvider';

export function JazzSheetsProvider({ children }: { children: ReactNode }) {
  const songs = useSongs();

  const activeNoteId = useMemo(() => {
    let accumulated = 0;
    for (const note of songs.music) {
      const noteDuration = DURATION_BEATS[note.duration];
      if (
        songs.currentPosition >= accumulated &&
        songs.currentPosition < accumulated + noteDuration
      ) {
        return note.id;
      }
      accumulated += noteDuration;
    }
    return null;
  }, [songs.currentPosition, songs.music]);

  const handleNoteSelect = (note: NoteName) => {
    songs.setSelectedNote(note);
    songs.setSelectedChord(null);
  };

  const handleChordSelect = (chord: NoteName) => {
    songs.setSelectedChord(chord);
    songs.setSelectedNote(null);
  };

  const value: JazzSheetsContextValue = {
    ...songs,
    activeNoteId,
    handleNoteSelect,
    handleChordSelect,
  };

  const playbackValue = {
    isPlaying: songs.isPlaying,
    tempo: songs.tempo,
    handlePlay: songs.handlePlay,
    handlePause: songs.handlePause,
    handleStop: songs.handleStop,
    handleTempoChange: songs.handleTempoChange,
  };

  return (
    <PlaybackProvider value={playbackValue}>
      <JazzSheetsContext.Provider value={value}>
        {children}
      </JazzSheetsContext.Provider>
    </PlaybackProvider>
  );
}
