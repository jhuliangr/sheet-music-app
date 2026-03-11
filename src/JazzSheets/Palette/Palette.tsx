import React from 'react';
import './Palette.css';
import type {
  Accidental,
  ChordQuality,
  Duration,
  NoteName,
} from '#shared/types';
import { CHORD_QUALITIES, DURATIONS, NOTE_NAMES } from '#shared/constants';
import { Button } from '@radix-ui/themes';

interface PaletteProps {
  selectedNote: NoteName | null;
  selectedChord: NoteName | null;
  selectedChordQuality: ChordQuality;
  selectedDuration: Duration;
  selectedAccidental: Accidental;
  isRest: boolean;
  selectedNoteOctave: number;
  setSelectedNoteOctave: React.Dispatch<React.SetStateAction<number>>;
  onNoteSelect: (note: NoteName) => void;
  onChordSelect: (note: NoteName) => void;
  onChordQualitySelect: (quality: ChordQuality) => void;
  onDurationSelect: (duration: Duration) => void;
  onAccidentalToggle: (accidental: Accidental) => void;
  onRestToggle: () => void;
  onClear: () => void;
}

export const Palette: React.FC<PaletteProps> = ({
  selectedNote,
  selectedChord,
  selectedChordQuality,
  selectedDuration,
  selectedAccidental,
  isRest,
  onNoteSelect,
  onChordSelect,
  onChordQualitySelect,
  onDurationSelect,
  onAccidentalToggle,
  onRestToggle,
  onClear,
  setSelectedNoteOctave,
  selectedNoteOctave,
}) => {
  return (
    <div className="note-palette">
      <div className="palette-section">
        <div className="flex">
          <h3>Note</h3>
          <div className="flex">
            <h3>Octave: {selectedNoteOctave}</h3>
            <Button
              className="less-y-padding"
              onClick={() =>
                setSelectedNoteOctave((prev) => {
                  if (prev <= 3) return prev;
                  else {
                    return prev - 1;
                  }
                })
              }
            >
              -
            </Button>
            <Button
              className="less-y-padding"
              onClick={() =>
                setSelectedNoteOctave((prev) => {
                  if (prev >= 5) return prev;
                  else {
                    return prev + 1;
                  }
                })
              }
            >
              +
            </Button>
          </div>
        </div>
        <div className="palette-buttons">
          {NOTE_NAMES.map((note) => (
            <Button
              key={note}
              className={`palette-btn ${selectedNote === note && !isRest ? 'active' : ''}`}
              onClick={() => onNoteSelect(note)}
            >
              {note}
            </Button>
          ))}
        </div>
      </div>
      <div className="palette-section">
        <h3>Chord</h3>
        <div className="palette-buttons">
          {NOTE_NAMES.map((note) => (
            <Button
              key={note}
              className={`palette-btn ${selectedChord === note && !isRest ? 'active' : ''}`}
              onClick={() => onChordSelect(note)}
            >
              {note}
            </Button>
          ))}
        </div>
        <div className="palette-buttons" style={{ marginTop: '8px' }}>
          {CHORD_QUALITIES.map((quality) => (
            <Button
              key={quality}
              className={`palette-btn ${selectedChordQuality === quality ? 'active' : ''}`}
              onClick={() => onChordQualitySelect(quality)}
            >
              {quality}
            </Button>
          ))}
        </div>
      </div>

      <div className="palette-section">
        <h3>Duration</h3>
        <div className="palette-buttons">
          {DURATIONS.map((duration) => (
            <Button
              key={duration}
              className={`palette-btn ${selectedDuration === duration ? 'active' : ''}`}
              onClick={() => onDurationSelect(duration)}
            >
              {duration === 'whole' && '1'}
              {duration === 'half' && '1/2'}
              {duration === 'quarter' && '1/4'}
              {duration === 'eighth' && '1/8'}
            </Button>
          ))}
        </div>
      </div>

      <div className="palette-section">
        <h3>Accidental</h3>
        <div className="palette-buttons">
          <Button
            className={`palette-btn ${selectedAccidental === '' ? 'active' : ''}`}
            onClick={() => onAccidentalToggle('')}
          >
            Natural (♮)
          </Button>
          <Button
            className={`palette-btn ${selectedAccidental === '#' ? 'active' : ''}`}
            onClick={() => onAccidentalToggle('#')}
          >
            ♯
          </Button>
          <Button
            className={`palette-btn ${selectedAccidental === 'b' ? 'active' : ''}`}
            onClick={() => onAccidentalToggle('b')}
          >
            ♭
          </Button>
        </div>
      </div>

      <div className="palette-section">
        <h3>Rest</h3>
        <div className="palette-buttons">
          <Button
            className={`palette-btn ${isRest ? 'active' : ''}`}
            onClick={onRestToggle}
          >
            Rest
          </Button>
        </div>
      </div>

      <div className="palette-section">
        <h3>Controls</h3>
        <Button className="palette-btn clear-btn" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
};
