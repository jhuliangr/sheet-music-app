import { describe, it, expect } from 'vitest';
import { getNoteY, noteToYPosition } from './getNoteY';
import { STAFF_TOP } from '#shared/constants';
import type { Note } from '#shared/types';

const makeNote = (note: Note['note'], octave = 4): Note => ({
  id: '1',
  note,
  octave,
  accidental: '',
  duration: 'quarter',
  position: 0,
  isRest: false,
});

describe('SheetMusicComposer/Staff/utils/getNoteY', () => {
  it('works', () => {
    expect(getNoteY(makeNote('C'))).toBeDefined();
  });

  it('returns a fixed rest position when note is null', () => {
    expect(getNoteY(makeNote(null))).toBe(STAFF_TOP - 10);
  });

  it('noteToYPosition returns 0 for C at octave 4 (base reference)', () => {
    expect(noteToYPosition('C', 4)).toBe(0);
  });

  it('noteToYPosition shifts by 7 positions per octave', () => {
    expect(noteToYPosition('C', 5)).toBe(7);
    expect(noteToYPosition('C', 3)).toBe(-7);
  });
});
