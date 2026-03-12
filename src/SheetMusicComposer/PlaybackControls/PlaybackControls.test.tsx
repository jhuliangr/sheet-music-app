import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlaybackControls } from './PlaybackControls';
import { usePlaybackContext } from '../usePlaybackContext';

vi.mock('../usePlaybackContext');

const handlePlay = vi.fn();
const handlePause = vi.fn();
const handleStop = vi.fn();
const handleTempoChange = vi.fn();

const defaultContextValue = {
  isPlaying: false,
  tempo: 120,
  handlePlay,
  handlePause,
  handleStop,
  handleTempoChange,
};

describe('SheetMusicComposer/PlaybackControls/PlaybackControls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePlaybackContext).mockReturnValue(
      defaultContextValue as unknown as ReturnType<typeof usePlaybackContext>,
    );
  });

  it('works', () => {
    render(<PlaybackControls />);
  });

  it('renders play button when not playing', () => {
    render(<PlaybackControls />);
    expect(screen.getByText('▶ Play')).toBeInTheDocument();
  });

  it('renders pause button when playing', () => {
    vi.mocked(usePlaybackContext).mockReturnValue({
      ...defaultContextValue,
      isPlaying: true,
    } as unknown as ReturnType<typeof usePlaybackContext>);
    render(<PlaybackControls />);
    expect(screen.getByText('⏸ Pause')).toBeInTheDocument();
  });

  it('renders stop button', () => {
    render(<PlaybackControls />);
    expect(screen.getByText('⏹ Stop')).toBeInTheDocument();
  });

  it('displays current tempo', () => {
    render(<PlaybackControls />);
    expect(screen.getByText('Tempo: 120 BPM')).toBeInTheDocument();
  });

  it('has tempo slider', () => {
    render(<PlaybackControls />);
    const slider = screen.getByLabelText(/tempo/i);
    expect(slider).toHaveValue('120');
  });

  it('calls onPlay when play button is clicked', async () => {
    const user = userEvent.setup();
    render(<PlaybackControls />);
    await user.click(screen.getByText('▶ Play'));
    expect(handlePlay).toHaveBeenCalledTimes(1);
  });

  it('calls onPause when pause button is clicked', async () => {
    vi.mocked(usePlaybackContext).mockReturnValue({
      ...defaultContextValue,
      isPlaying: true,
    } as unknown as ReturnType<typeof usePlaybackContext>);
    const user = userEvent.setup();
    render(<PlaybackControls />);
    await user.click(screen.getByText('⏸ Pause'));
    expect(handlePause).toHaveBeenCalledTimes(1);
  });

  it('calls onStop when stop button is clicked', async () => {
    const user = userEvent.setup();
    render(<PlaybackControls />);
    await user.click(screen.getByText('⏹ Stop'));
    expect(handleStop).toHaveBeenCalledTimes(1);
  });

  it('calls onTempoChange when slider is changed', () => {
    render(<PlaybackControls />);
    const slider = screen.getByLabelText(/tempo/i);
    fireEvent.change(slider, { target: { value: '150' } });
    expect(handleTempoChange).toHaveBeenCalled();
  });
});
