import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { useJazzSheets } from './useJazzSheets';
import { JazzSheetsContext } from './JazzSheetsContext';
import type { JazzSheetsContextValue } from './JazzSheetsContext';

const mockValue = {
  music: [],
  selectedNote: 'C',
  isPlaying: false,
  activeNoteId: null,
} as unknown as JazzSheetsContextValue;

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(
    JazzSheetsContext.Provider,
    { value: mockValue },
    children,
  );

describe('JazzSheets/useJazzSheets', () => {
  it('works within a provider', () => {
    const { result } = renderHook(() => useJazzSheets(), { wrapper });
    expect(result.current).toBeDefined();
  });

  it('throws when used outside a provider', () => {
    expect(() => renderHook(() => useJazzSheets())).toThrow(
      'useJazzSheets must be used within JazzSheetsProvider',
    );
  });

  it('returns the context value', () => {
    const { result } = renderHook(() => useJazzSheets(), { wrapper });
    expect(result.current.music).toEqual([]);
    expect(result.current.selectedNote).toBe('C');
  });

  it('returns activeNoteId from context', () => {
    const { result } = renderHook(() => useJazzSheets(), { wrapper });
    expect(result.current.activeNoteId).toBeNull();
  });
});
