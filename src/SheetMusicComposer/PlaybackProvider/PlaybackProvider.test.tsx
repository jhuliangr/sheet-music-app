import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlaybackProvider } from './PlaybackProvider';
import { usePlaybackContext } from './usePlaybackContext';

const mockValue = {
  isPlaying: false,
  tempo: 140,
  handlePlay: vi.fn(),
  handlePause: vi.fn(),
  handleStop: vi.fn(),
  handleTempoChange: vi.fn(),
};

function Consumer() {
  const { tempo } = usePlaybackContext();
  return <div>{tempo}</div>;
}

describe('SheetMusicComposer/PlaybackProvider', () => {
  it('works', () => {
    render(
      <PlaybackProvider value={mockValue}>
        <div />
      </PlaybackProvider>,
    );
  });

  it('renders its children', () => {
    render(
      <PlaybackProvider value={mockValue}>
        <span>child content</span>
      </PlaybackProvider>,
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('makes the value available to consumers', () => {
    render(
      <PlaybackProvider value={mockValue}>
        <Consumer />
      </PlaybackProvider>,
    );
    expect(screen.getByText('140')).toBeInTheDocument();
  });

  it('consumer throws when rendered without provider', () => {
    expect(() => render(<Consumer />)).toThrow();
  });
});
