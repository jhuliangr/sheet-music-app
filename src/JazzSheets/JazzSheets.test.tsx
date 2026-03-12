import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JazzSheets } from './JazzSheets';
import { useJazzSheets } from './useJazzSheets';
import { usePlaybackContext } from './usePlaybackContext';

vi.mock('./JazzSheetsProvider', () => ({
  JazzSheetsProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));
vi.mock('./useJazzSheets');
vi.mock('./usePlaybackContext');
vi.mock('./Staff', () => ({ Staff: () => <div data-testid="staff" /> }));
vi.mock('./Palette', () => ({ Palette: () => <div data-testid="palette" /> }));
vi.mock('./SongList', () => ({
  SongList: () => <div data-testid="song-list" />,
}));
vi.mock('./PlaybackControls', () => ({
  PlaybackControls: () => <div data-testid="playback-controls" />,
}));

const defaultJazzSheets = {
  music: [],
  activeNoteId: null,
  isPlaying: false,
  rowsStaff: [],
  handleNoteClick: vi.fn(),
  handleDeletion: vi.fn(),
  handleStaffClick: vi.fn(),
  handleMaximumWidthChange: vi.fn(),
};

const defaultPlayback = {
  isPlaying: false,
  tempo: 120,
  handlePlay: vi.fn(),
  handlePause: vi.fn(),
  handleStop: vi.fn(),
  handleTempoChange: vi.fn(),
};

describe('JazzSheets/JazzSheets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useJazzSheets).mockReturnValue(
      defaultJazzSheets as unknown as ReturnType<typeof useJazzSheets>,
    );
    vi.mocked(usePlaybackContext).mockReturnValue(defaultPlayback);
  });

  it('works', () => {
    render(<JazzSheets />);
  });

  it('renders the Palette', () => {
    render(<JazzSheets />);
    expect(screen.getByTestId('palette')).toBeInTheDocument();
  });

  it('renders the SongList', () => {
    render(<JazzSheets />);
    expect(screen.getByTestId('song-list')).toBeInTheDocument();
  });

  it('renders PlaybackControls', () => {
    render(<JazzSheets />);
    expect(screen.getByTestId('playback-controls')).toBeInTheDocument();
  });
});
