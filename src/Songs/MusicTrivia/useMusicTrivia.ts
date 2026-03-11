import useAsync from '#shared/useAsync';
import { get } from './api';
import type { TriviaQuestion, TriviaResponse } from './types';

function decodeHtml(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

export async function getMusicTrivia(): Promise<TriviaQuestion> {
  const data = await get<TriviaResponse>(
    'https://opentdb.com/api.php?amount=1&category=12&type=multiple',
  );
  if (data.response_code !== 0 || data.results.length === 0) {
    throw new Error('No trivia available');
  }
  const q = data.results[0];
  const correct_answer = decodeHtml(q.correct_answer);
  const incorrect_answers = q.incorrect_answers.map(decodeHtml);
  const answers = [...incorrect_answers, correct_answer].sort(
    () => Math.random() - 0.5,
  );
  return {
    ...q,
    question: decodeHtml(q.question),
    correct_answer,
    incorrect_answers,
    answers,
  };
}

export function useMusicTrivia() {
  return useAsync(getMusicTrivia);
}
