import { useState } from 'react';
import { useMusicTrivia } from './useMusicTrivia';
import { useTriviaStore } from '#shared/stores/useTriviaStore';
import './MusicTrivia.css';
import { TriviaView } from './TriviaView';

export const TriviaContent: React.FC = () => {
  const [trivia, { refresh }] = useMusicTrivia();
  const recordAnswer = useTriviaStore((s) => s.recordAnswer);

  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (answer: string) => {
    setSelected(answer);
    recordAnswer(answer === trivia?.correct_answer);
  };

  const handleRefresh = () => {
    setSelected(null);
    refresh();
  };

  return (
    <TriviaView
      trivia={trivia}
      answers={trivia?.answers ?? []}
      selected={selected}
      onSelect={handleSelect}
      onRefresh={handleRefresh}
    />
  );
};
