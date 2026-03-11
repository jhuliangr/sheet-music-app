import type { TriviaQuestion } from './types';

type Props = {
  trivia?: TriviaQuestion;
  answers: string[];
  selected: string | null;
  onSelect: (answer: string) => void;
  onRefresh: () => void;
};

export const TriviaView: React.FC<Props> = ({
  trivia,
  answers,
  selected,
  onSelect,
  onRefresh,
}) => {
  if (!trivia) {
    return (
      <div className="trivia-loading">
        <div className="trivia-skeleton" />
        <div className="trivia-skeleton short" />
      </div>
    );
  }

  const difficultyColor = {
    easy: '#27ae60',
    medium: '#e67e22',
    hard: '#e74c3c',
  }[trivia.difficulty];

  return (
    <div className="trivia-content">
      <div className="trivia-meta">
        <span className="trivia-category">{trivia.category}</span>
        <span className="trivia-difficulty" style={{ color: difficultyColor }}>
          {trivia.difficulty}
        </span>
      </div>
      <p className="trivia-question">{trivia.question}</p>
      <div className="trivia-answers">
        {answers.map((answer) => {
          let cls = 'trivia-answer-btn';
          if (selected) {
            if (answer === trivia.correct_answer) cls += ' correct';
            else if (answer === selected) cls += ' wrong';
            else cls += ' disabled';
          }
          return (
            <button
              key={answer}
              className={cls}
              onClick={() => !selected && onSelect(answer)}
              disabled={
                !!selected &&
                answer !== trivia.correct_answer &&
                answer !== selected
              }
            >
              {answer}
            </button>
          );
        })}
      </div>
      {selected && (
        <p className="trivia-result">
          {selected === trivia.correct_answer
            ? '🎵 Correct!'
            : `The answer was: ${trivia.correct_answer}`}
        </p>
      )}
      <button className="trivia-btn next-btn" onClick={onRefresh}>
        Next Question
      </button>
    </div>
  );
};
