import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Staff } from './Staff';

describe('SheetMusicComposer/Staff/Staff', () => {
  const defaultProps = {
    music: [],
    activeNoteId: null,
    isPlaying: false,
    onNoteClick: vi.fn(),
    onDelete: vi.fn(),
    onMaximumWidthChange: vi.fn(),
  };
  it('works', () => {
    render(<Staff {...defaultProps} />);
  });
});
