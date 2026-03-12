import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SongList } from './SongList';
import { useJazzSheets } from '../useJazzSheets';

vi.mock('../useJazzSheets');

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const defaultContextValue = {
  music: [],
  tempo: 120,
  handleLoadSong: vi.fn(),
};

describe('JazzSheets/SongList/SongList', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    vi.mocked(useJazzSheets).mockReturnValue(
      defaultContextValue as unknown as ReturnType<typeof useJazzSheets>,
    );
  });

  it('works', () => {
    render(<SongList />);
  });

  it('renders song name input', () => {
    render(<SongList />);
    expect(screen.getByPlaceholderText('Song name')).toBeInTheDocument();
  });

  it('renders save button', () => {
    render(<SongList />);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('shows empty state when no songs', () => {
    render(<SongList />);
    expect(screen.getByText('No saved songs')).toBeInTheDocument();
  });

  it('allows typing song name', async () => {
    const user = userEvent.setup();
    render(<SongList />);

    const input = screen.getByPlaceholderText('Song name');
    await user.type(input, 'My Song');

    expect(input).toHaveValue('My Song');
  });
});
