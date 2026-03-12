import { createContext } from 'react';

export interface PlaybackContextValue {
  isPlaying: boolean;
  tempo: number;
  handlePlay: () => void;
  handlePause: () => void;
  handleStop: () => void;
  handleTempoChange: (tempo: number) => void;
}

export const PlaybackContext = createContext<PlaybackContextValue | undefined>(
  undefined,
);
