import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMusicTrivia } from './useMusicTrivia';

const mockResponse = {
  response_code: 0,
  results: [
    {
      category: 'Music',
      difficulty: 'easy',
      question: 'What is &amp; a note?',
      correct_answer: 'C',
      incorrect_answers: ['D', 'E', 'F'],
    },
  ],
};

describe('Songs/MusicTrivia/getMusicTrivia', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('works', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);
    await expect(getMusicTrivia()).resolves.toBeDefined();
  });

  it('decodes HTML entities in the question', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);
    const trivia = await getMusicTrivia();
    expect(trivia.question).not.toContain('&amp;');
    expect(trivia.question).toContain('&');
  });

  it('includes correct answer among shuffled answers', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);
    const trivia = await getMusicTrivia();
    expect(trivia.answers).toHaveLength(4);
    expect(trivia.answers).toContain('C');
  });

  it('throws when response_code is not 0', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ response_code: 1, results: [] }),
    } as Response);
    await expect(getMusicTrivia()).rejects.toThrow('No trivia available');
  });
});
