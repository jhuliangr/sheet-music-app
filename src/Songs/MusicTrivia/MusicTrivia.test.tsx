import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MusicTrivia } from './MusicTrivia';

let shouldThrow = false;

vi.mock('./TriviaContent', () => ({
  TriviaContent: () => {
    if (shouldThrow) throw new Error('trivia fetch failed');
    return <div data-testid="trivia-content">Trivia loaded</div>;
  },
}));

describe('Songs/MusicTrivia/MusicTrivia', () => {
  beforeEach(() => {
    shouldThrow = false;
    vi.clearAllMocks();
  });

  it('works', () => {
    render(<MusicTrivia />);
  });

  it('renders the Music Trivia heading', () => {
    render(<MusicTrivia />);
    expect(screen.getByText('Music Trivia')).toBeInTheDocument();
  });

  it('renders the trivia content when loaded successfully', () => {
    render(<MusicTrivia />);
    expect(screen.getByTestId('trivia-content')).toBeInTheDocument();
  });

  it('shows error message and retry button when trivia throws', async () => {
    shouldThrow = true;
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<MusicTrivia />);
    expect(
      await screen.findByText(/Could not load trivia/),
    ).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
    await user.click(screen.getByText('Retry'));
  });
});
