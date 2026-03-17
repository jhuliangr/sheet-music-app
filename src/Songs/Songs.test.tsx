import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Songs } from './Songs';
import { useSongsStore } from '#shared/songs/useSongsStore';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('#shared/playback/usePlayback', () => ({
  usePlayback: () => ({
    handleStop: vi.fn(),
    handlePlay: vi.fn(),
    handlePause: vi.fn(),
    handleTempoChange: vi.fn(),
    isPlaying: false,
    tempo: 120,
    currentPosition: 0,
    animationRef: { current: null },
    setTempo: vi.fn(),
  }),
}));

vi.mock('../SheetMusicComposer/Staff', () => ({
  Staff: () => <div data-testid="staff" />,
}));

vi.mock('../SheetMusicComposer/PlaybackControls', () => ({
  PlaybackControls: () => <div data-testid="playback-controls" />,
}));

vi.mock('./MusicTrivia', () => ({
  MusicTrivia: () => <div data-testid="music-trivia" />,
}));

vi.mock('#shared/songs/useSongsStore', () => ({
  useSongsStore: vi.fn(),
}));

const emptySongsStore = {
  songs: [],
  addSong: vi.fn(),
  deleteSong: vi.fn(),
};

describe('Songs/Songs', () => {
  beforeEach(() => {
    vi.mocked(useSongsStore).mockReturnValue(emptySongsStore);
  });

  it('works', () => {
    render(<Songs />);
  });

  it('renders the back button', () => {
    render(<Songs />);
    expect(screen.getByText('← Back to Composer')).toBeInTheDocument();
  });

  it('shows no-songs message when there are no saved songs', () => {
    render(<Songs />);
    expect(screen.getByText('No saved songs')).toBeInTheDocument();
  });

  it('lists saved songs from store', () => {
    vi.mocked(useSongsStore).mockReturnValue({
      songs: [{ id: '1', name: 'My Song', tempo: 120, notesAndChords: [] }],
      addSong: vi.fn(),
      deleteSong: vi.fn(),
    });
    render(<Songs />);
    expect(screen.getByText('My Song')).toBeInTheDocument();
  });
});
