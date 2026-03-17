import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TriviaContent } from './TriviaContent';

const refreshMock = vi.fn();

const mockTrivia = {
  category: 'Music',
  difficulty: 'easy' as const,
  question: 'Which note is middle C?',
  correct_answer: 'C4',
  incorrect_answers: ['D4', 'E4', 'F4'],
  answers: ['C4', 'D4', 'E4', 'F4'],
};

vi.mock('./useMusicTrivia', () => ({
  useMusicTrivia: vi.fn(() => [mockTrivia, { refresh: refreshMock }]),
}));

vi.mock('#shared/trivia/useTriviaStore', () => ({
  useTriviaStore: (
    selector: (s: { recordAnswer: ReturnType<typeof vi.fn> }) => unknown,
  ) => selector({ recordAnswer: vi.fn() }),
}));

describe('Songs/MusicTrivia/TriviaContent', () => {
  beforeEach(() => vi.clearAllMocks());

  it('works', () => {
    render(<TriviaContent />);
  });

  it('renders the trivia question', () => {
    render(<TriviaContent />);
    expect(screen.getByText('Which note is middle C?')).toBeInTheDocument();
  });

  it('renders all answer buttons', () => {
    render(<TriviaContent />);
    expect(screen.getByText('C4')).toBeInTheDocument();
    expect(screen.getByText('D4')).toBeInTheDocument();
  });

  it('shows the result feedback after selecting an answer', async () => {
    const user = userEvent.setup();
    render(<TriviaContent />);
    await user.click(screen.getByText('C4'));
    expect(screen.getByText('🎵 Correct!')).toBeInTheDocument();
  });
});
