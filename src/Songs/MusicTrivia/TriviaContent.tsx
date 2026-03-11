import { useState } from 'react';
import { useMusicTrivia } from './useMusicTrivia';
import './MusicTrivia.css';
import { TriviaView } from './TriviaView';

export const TriviaContent: React.FC = () => {
  const [trivia, { refresh }] = useMusicTrivia();

  const [selected, setSelected] = useState<string | null>(null);

  const handleRefresh = () => {
    setSelected(null);
    refresh();
  };

  return (
    <TriviaView
      trivia={trivia}
      answers={trivia?.answers ?? []}
      selected={selected}
      onSelect={setSelected}
      onRefresh={handleRefresh}
    />
  );
};
