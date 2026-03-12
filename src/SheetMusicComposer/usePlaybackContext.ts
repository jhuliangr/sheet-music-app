import { useContext } from 'react';
import { PlaybackContext } from './PlaybackContext';

export function usePlaybackContext() {
  const ctx = useContext(PlaybackContext);
  if (!ctx) {
    throw new Error('usePlaybackContext must be used within PlaybackProvider');
  }
  return ctx;
}
