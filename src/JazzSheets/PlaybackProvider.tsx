import { type ReactNode } from 'react';
import { PlaybackContext, type PlaybackContextValue } from './PlaybackContext';

export function PlaybackProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: PlaybackContextValue;
}) {
  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
}
