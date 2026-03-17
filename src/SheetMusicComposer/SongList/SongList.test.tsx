import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SongList } from './SongList';
import { useSheetMusicComposer } from '../SheetMusicComposerProvider';
import { useSongsStore } from '#shared/songs/useSongsStore';

vi.mock('../SheetMusicComposerProvider');
vi.mock('#shared/songs/useSongsStore', () => ({
  useSongsStore: vi.fn(),
}));

const defaultContextValue = {
  music: [],
  tempo: 120,
  handleLoadSong: vi.fn(),
};

const defaultStoreValue = {
  songs: [],
  addSong: vi.fn(),
  deleteSong: vi.fn(),
};

describe('SheetMusicComposer/SongList/SongList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSheetMusicComposer).mockReturnValue(
      defaultContextValue as unknown as ReturnType<
        typeof useSheetMusicComposer
      >,
    );
    vi.mocked(useSongsStore).mockReturnValue(defaultStoreValue);
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
