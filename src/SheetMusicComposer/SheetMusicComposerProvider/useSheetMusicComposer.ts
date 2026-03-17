import { useContext } from 'react';
import { SheetMusicComposerContext } from './SheetMusicComposerContext';

export function useSheetMusicComposer() {
  const ctx = useContext(SheetMusicComposerContext);
  if (!ctx) {
    throw new Error(
      'useSheetMusicComposer must be used within SheetMusicComposerProvider',
    );
  }
  return ctx;
}
