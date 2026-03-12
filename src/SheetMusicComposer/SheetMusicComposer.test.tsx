import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SheetMusicComposer } from './SheetMusicComposer';
import { useSheetMusicComposer } from './useSheetMusicComposer';
import { usePlaybackContext } from './usePlaybackContext';

vi.mock('./SheetMusicComposerProvider', () => ({
  SheetMusicComposerProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));
vi.mock('./useSheetMusicComposer');
vi.mock('./usePlaybackContext');
vi.mock('./Staff', () => ({ Staff: () => <div data-testid="staff" /> }));
vi.mock('./Palette', () => ({ Palette: () => <div data-testid="palette" /> }));
vi.mock('./SongList', () => ({
  SongList: () => <div data-testid="song-list" />,
}));
vi.mock('./PlaybackControls', () => ({
  PlaybackControls: () => <div data-testid="playback-controls" />,
}));

const defaultSheetMusicComposer = {
  music: [],
  activeNoteId: null,
  isPlaying: false,
  rowsStaff: [],
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

describe('SheetMusicComposer/SheetMusicComposer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSheetMusicComposer).mockReturnValue(
      defaultSheetMusicComposer as unknown as ReturnType<
        typeof useSheetMusicComposer
      >,
    );
    vi.mocked(usePlaybackContext).mockReturnValue(defaultPlayback);
  });

  it('works', () => {
    render(<SheetMusicComposer />);
  });

  it('renders the Palette', () => {
    render(<SheetMusicComposer />);
    expect(screen.getByTestId('palette')).toBeInTheDocument();
  });

  it('renders the SongList', () => {
    render(<SheetMusicComposer />);
    expect(screen.getByTestId('song-list')).toBeInTheDocument();
  });

  it('renders PlaybackControls', () => {
    render(<SheetMusicComposer />);
    expect(screen.getByTestId('playback-controls')).toBeInTheDocument();
  });
});
