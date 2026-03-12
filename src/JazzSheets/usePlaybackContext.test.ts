import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { usePlaybackContext } from './usePlaybackContext';
import { PlaybackContext } from './PlaybackContext';
import type { PlaybackContextValue } from './PlaybackContext';

const mockValue: PlaybackContextValue = {
  isPlaying: false,
  tempo: 120,
  handlePlay: vi.fn(),
  handlePause: vi.fn(),
  handleStop: vi.fn(),
  handleTempoChange: vi.fn(),
};

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(PlaybackContext.Provider, { value: mockValue }, children);

describe('JazzSheets/usePlaybackContext', () => {
  it('works within a provider', () => {
    const { result } = renderHook(() => usePlaybackContext(), { wrapper });
    expect(result.current).toBeDefined();
  });

  it('throws when used outside a provider', () => {
    expect(() => renderHook(() => usePlaybackContext())).toThrow(
      'usePlaybackContext must be used within PlaybackProvider',
    );
  });

  it('returns isPlaying and tempo', () => {
    const { result } = renderHook(() => usePlaybackContext(), { wrapper });
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.tempo).toBe(120);
  });

  it('returns all handler functions', () => {
    const { result } = renderHook(() => usePlaybackContext(), { wrapper });
    expect(typeof result.current.handlePlay).toBe('function');
    expect(typeof result.current.handleStop).toBe('function');
    expect(typeof result.current.handleTempoChange).toBe('function');
  });
});
