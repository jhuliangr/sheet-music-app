import type { TriviaQuestion } from './types';
import styles from './MusicTrivia.module.css';

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
      <div className={styles['trivia-loading']}>
        <div className={styles['trivia-skeleton']} />
        <div className={`${styles['trivia-skeleton']} ${styles.short}`} />
      </div>
    );
  }

  const difficultyColor = {
    easy: '#27ae60',
    medium: '#e67e22',
    hard: '#e74c3c',
  }[trivia.difficulty];

  return (
    <div className={styles['trivia-content']}>
      <div className={styles['trivia-meta']}>
        <span className={styles['trivia-category']}>{trivia.category}</span>
        <span
          className={styles['trivia-difficulty']}
          style={{ color: difficultyColor }}
        >
          {trivia.difficulty}
        </span>
      </div>
      <p className={styles['trivia-question']}>{trivia.question}</p>
      <div className={styles['trivia-answers']}>
        {answers.map((answer) => {
          const answerState = selected
            ? answer === trivia.correct_answer
              ? styles.correct
              : answer === selected
                ? styles.wrong
                : styles.disabled
            : '';
          const cls = [styles['trivia-answer-btn'], answerState]
            .filter(Boolean)
            .join(' ');
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
        <p className={styles['trivia-result']}>
          {selected === trivia.correct_answer
            ? '🎵 Correct!'
            : `The answer was: ${trivia.correct_answer}`}
        </p>
      )}
      <button
        className={`${styles['trivia-btn']} ${styles['next-btn']}`}
        onClick={onRefresh}
      >
        Next Question
      </button>
    </div>
  );
};
