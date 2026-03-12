import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TriviaView } from './TriviaView';

const mockTrivia = {
  category: 'Music',
  difficulty: 'easy' as const,
  question: 'What is a C chord?',
  correct_answer: 'C E G',
  incorrect_answers: ['C D E', 'C F G', 'D F A'],
  answers: ['C E G', 'C D E', 'C F G', 'D F A'],
};

describe('Songs/MusicTrivia/TriviaView', () => {
  it('works', () => {
    render(
      <TriviaView
        answers={[]}
        selected={null}
        onSelect={vi.fn()}
        onRefresh={vi.fn()}
      />,
    );
  });

  it('shows loading skeleton when no trivia is provided', () => {
    const { container } = render(
      <TriviaView
        answers={[]}
        selected={null}
        onSelect={vi.fn()}
        onRefresh={vi.fn()}
      />,
    );
    expect(container.querySelector('.trivia-skeleton')).toBeInTheDocument();
  });

  it('renders the question and all answer buttons when trivia is provided', () => {
    render(
      <TriviaView
        trivia={mockTrivia}
        answers={mockTrivia.answers}
        selected={null}
        onSelect={vi.fn()}
        onRefresh={vi.fn()}
      />,
    );
    expect(screen.getByText('What is a C chord?')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /C|D|F/ }).length,
    ).toBeGreaterThanOrEqual(4);
  });

  it('marks the correct and wrong answers after a selection', () => {
    const { container } = render(
      <TriviaView
        trivia={mockTrivia}
        answers={mockTrivia.answers}
        selected="C D E"
        onSelect={vi.fn()}
        onRefresh={vi.fn()}
      />,
    );
    expect(container.querySelector('.correct')).toBeInTheDocument();
    expect(container.querySelector('.wrong')).toBeInTheDocument();
  });
});
