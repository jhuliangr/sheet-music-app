export type TriviaQuestion = {
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  answers: string[];
};

export type TriviaResponse = {
  response_code: number;
  results: TriviaQuestion[];
};
