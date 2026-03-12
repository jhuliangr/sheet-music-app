import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Songs } from './Songs';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('#shared/usePlayback', () => ({
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

vi.mock('../JazzSheets/Staff', () => ({
  Staff: () => <div data-testid="staff" />,
}));

vi.mock('../JazzSheets/PlaybackControls', () => ({
  PlaybackControls: () => <div data-testid="playback-controls" />,
}));

vi.mock('./MusicTrivia', () => ({
  MusicTrivia: () => <div data-testid="music-trivia" />,
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Songs/Songs', () => {
  beforeEach(() => localStorageMock.clear());

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

  it('lists saved songs from localStorage', () => {
    localStorageMock.setItem(
      'sheet-music-songs',
      JSON.stringify([
        { id: '1', name: 'My Song', tempo: 120, notesAndChords: [] },
      ]),
    );
    render(<Songs />);
    expect(screen.getByText('My Song')).toBeInTheDocument();
  });
});
