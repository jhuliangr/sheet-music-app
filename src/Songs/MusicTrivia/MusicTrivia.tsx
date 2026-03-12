import React, { Suspense, useState } from 'react';
import styles from './MusicTrivia.module.css';
import { TriviaView } from './TriviaView';
import { TriviaContent } from './TriviaContent';

import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

type Props = {
  children: React.ReactNode;
  onReset: () => void;
};

export function TriviaErrorBoundary({ children, onReset }: Props) {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }: FallbackProps) => {
        return (
          <div className={styles['trivia-error']}>
            <p>
              Could not load trivia: {(error as { message: string }).message}
            </p>
            <button
              className={styles['trivia-btn']}
              onClick={() => {
                resetErrorBoundary();
              }}
            >
              Retry
            </button>
          </div>
        );
      }}
      onReset={onReset}
    >
      {children}
    </ErrorBoundary>
  );
}

export const MusicTrivia: React.FC = () => {
  const [key, setKey] = useState(0);

  const handleReset = () => {
    setKey((k) => k + 1);
  };

  return (
    <div className={styles['trivia-panel']}>
      <h3>Music Trivia</h3>
      <TriviaErrorBoundary onReset={handleReset}>
        <Suspense
          fallback={
            <TriviaView
              answers={[]}
              selected={null}
              onSelect={() => {}}
              onRefresh={() => {}}
            />
          }
        >
          <TriviaContent key={key} />
        </Suspense>
      </TriviaErrorBoundary>
    </div>
  );
};
