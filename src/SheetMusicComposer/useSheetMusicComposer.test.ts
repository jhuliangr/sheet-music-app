import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { useSheetMusicComposer } from './useSheetMusicComposer';
import { SheetMusicComposerContext } from './SheetMusicComposerContext';
import type { SheetMusicComposerContextValue } from './SheetMusicComposerContext';

const mockValue = {
  music: [],
  selectedNote: 'C',
  isPlaying: false,
  activeNoteId: null,
} as unknown as SheetMusicComposerContextValue;

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(
    SheetMusicComposerContext.Provider,
    { value: mockValue },
    children,
  );

describe('SheetMusicComposer/useSheetMusicComposer', () => {
  it('works within a provider', () => {
    const { result } = renderHook(() => useSheetMusicComposer(), { wrapper });
    expect(result.current).toBeDefined();
  });

  it('throws when used outside a provider', () => {
    expect(() => renderHook(() => useSheetMusicComposer())).toThrow(
      'useSheetMusicComposer must be used within SheetMusicComposerProvider',
    );
  });

  it('returns the context value', () => {
    const { result } = renderHook(() => useSheetMusicComposer(), { wrapper });
    expect(result.current.music).toEqual([]);
    expect(result.current.selectedNote).toBe('C');
  });

  it('returns activeNoteId from context', () => {
    const { result } = renderHook(() => useSheetMusicComposer(), { wrapper });
    expect(result.current.activeNoteId).toBeNull();
  });
});
