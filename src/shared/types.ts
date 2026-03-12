export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Accidental = '' | '#' | 'b';
export type Duration = 'whole' | 'half' | 'quarter' | 'eighth';
export type ChordQuality =
  | 'major'
  | 'minor'
  | 'maj7'
  | 'm7'
  | '7'
  | 'maj9'
  | 'm9'
  | '9'
  | 'm11'
  | '11';

export interface Note {
  id: string;
  note: NoteName | null;
  accidental: Accidental;
  octave: number;
  duration: Duration;
  position: number;
  isRest: boolean;
}

export interface Chord {
  id: string;
  note: NoteName | null;
  position: number;
  duration: Duration;
  accidental: Accidental;
  quality: ChordQuality;
  features: Feature[];
}

export interface Feature {
  name: string;
  value: string;
}

export interface Song {
  id: string;
  name: string;
  notesAndChords: (Note | Chord)[];
  tempo: number;
}
