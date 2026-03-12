import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { SheetMusicComposerProvider } from './SheetMusicComposerProvider';
import { useSheetMusicComposer } from './useSheetMusicComposer';

vi.mock('#shared/useSongs', () => ({
  useSongs: () => ({
    music: [
      {
        id: 'note-1',
        note: 'C',
        octave: 4,
        accidental: '',
        duration: 'quarter',
        position: 0,
        isRest: false,
      },
    ],
    currentPosition: 0.5,
    isPlaying: false,
    tempo: 120,
    handlePlay: vi.fn(),
    handlePause: vi.fn(),
    handleStop: vi.fn(),
    handleTempoChange: vi.fn(),
    setSelectedNote: vi.fn(),
    setSelectedChord: vi.fn(),
    selectedNote: 'C',
    selectedChord: null,
    selectedDuration: 'quarter',
    selectedAccidental: '',
    selectedNoteOctave: 4,
    selectedChordQuality: 'major',
    isRest: false,
    rowsStaff: [],
    handleDeletion: vi.fn(),
    handleStaffClick: vi.fn(),
    handleLoadSong: vi.fn(),
    handleClear: vi.fn(),
    handleMaximumWidthChange: vi.fn(),
    animationRef: { current: null },
    lastTimeRef: { current: 0 },
    positionRef: { current: 0 },
    setIsPlaying: vi.fn(),
    setIsRest: vi.fn(),
    setSelectedDuration: vi.fn(),
    setSelectedAccidental: vi.fn(),
    setSelectedNoteOctave: vi.fn(),
    setSelectedChordQuality: vi.fn(),
    setTempo: vi.fn(),
  }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(SheetMusicComposerProvider, null, children);

describe('SheetMusicComposer/SheetMusicComposerProvider', () => {
  it('works', () => {
    render(
      <SheetMusicComposerProvider>
        <div />
      </SheetMusicComposerProvider>,
    );
  });

  it('renders its children', () => {
    render(
      <SheetMusicComposerProvider>
        <span>child</span>
      </SheetMusicComposerProvider>,
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('provides context accessible via useSheetMusicComposer', () => {
    const { result } = renderHook(() => useSheetMusicComposer(), { wrapper });
    expect(result.current.selectedNote).toBe('C');
    expect(result.current.music).toHaveLength(1);
  });

  it('computes activeNoteId for the current position', () => {
    const { result } = renderHook(() => useSheetMusicComposer(), { wrapper });
    expect(result.current.activeNoteId).toBe('note-1');
  });
});
