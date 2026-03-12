import type { ChordQuality, Duration, NoteName } from './types';

export const NOTE_NAMES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const DURATIONS: Duration[] = ['whole', 'half', 'quarter', 'eighth'];
export const CHORD_QUALITIES: ChordQuality[] = [
  'major',
  'minor',
  'maj7',
  'm7',
  '7',
  'maj9',
  'm9',
  '9',
  'm11',
  '11',
];

export const DURATION_BEATS: Record<Duration, number> = {
  whole: 4,
  half: 2,
  quarter: 1,
  eighth: 0.5,
};

// Semitone intervals from the root for each chord quality
export const CHORD_INTERVALS: Record<ChordQuality, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  '7': [0, 4, 7, 10],
  maj9: [0, 4, 7, 11, 14],
  m9: [0, 3, 7, 10, 14],
  '9': [0, 4, 7, 10, 14],
  m11: [0, 3, 7, 10, 14, 17],
  '11': [0, 4, 7, 10, 14, 17],
};

export const NOTE_TO_SEMITONE: Record<NoteName, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

export const ACCIDENTAL_OFFSET: Record<string, number> = {
  '': 0,
  '#': 1,
  b: -1,
};

export const SEMITONE_TO_NOTE = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];
export const STAFF_TOP = 60;
export const LINE_SPACING = 12;
export const NOTE_WIDTH = 30;
export const STAFF_PADDING = 40;
export const BEATS_PER_MEASURE = 4;
