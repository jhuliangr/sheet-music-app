import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from './api';

describe('Songs/MusicTrivia/api', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('works', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ foo: 'bar' }),
    } as Response);
    await expect(get('/test')).resolves.toBeDefined();
  });

  it('returns parsed JSON on success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ value: 42 }),
    } as Response);
    const result = await get<{ value: number }>('/test');
    expect(result).toEqual({ value: 42 });
  });

  it('throws on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    } as Response);
    await expect(get('/test')).rejects.toThrow('API Error: Not Found');
  });

  it('propagates network errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
      new Error('Network failure'),
    );
    await expect(get('/test')).rejects.toThrow('Network failure');
  });
});
