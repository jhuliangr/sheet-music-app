import React from 'react';
import styles from './Palette.module.css';
import { CHORD_QUALITIES, DURATIONS, NOTE_NAMES } from '#shared/constants';
import { Button } from '@radix-ui/themes';
import { useSheetMusicComposer } from '../SheetMusicComposerProvider';

export const Palette: React.FC = () => {
  const {
    selectedNote,
    selectedChord,
    selectedChordQuality,
    selectedDuration,
    selectedAccidental,
    isRest,
    selectedNoteOctave,
    setSelectedNoteOctave,
    handleNoteSelect,
    handleChordSelect,
    setSelectedChordQuality,
    setSelectedDuration,
    setSelectedAccidental,
    setIsRest,
    handleClear,
  } = useSheetMusicComposer();

  return (
    <div className={styles['note-palette']}>
      <div className={styles['palette-section']}>
        <div className={styles.flex}>
          <h3>Note</h3>
          <div className={styles.flex}>
            <h3>Octave: {selectedNoteOctave}</h3>
            <Button
              className={styles['less-y-padding']}
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
              className={styles['less-y-padding']}
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
        <div className={styles['palette-buttons']}>
          {NOTE_NAMES.map((note) => (
            <Button
              key={note}
              className={[
                styles['palette-btn'],
                selectedNote === note && !isRest ? styles.active : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleNoteSelect(note)}
            >
              {note}
            </Button>
          ))}
        </div>
      </div>
      <div className={styles['palette-section']}>
        <h3>Chord</h3>
        <div className={styles['palette-buttons']}>
          {NOTE_NAMES.map((note) => (
            <Button
              key={note}
              className={[
                styles['palette-btn'],
                selectedChord === note && !isRest ? styles.active : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleChordSelect(note)}
            >
              {note}
            </Button>
          ))}
        </div>
        <div className={styles['palette-buttons']} style={{ marginTop: '8px' }}>
          {CHORD_QUALITIES.map((quality) => (
            <Button
              key={quality}
              className={[
                styles['palette-btn'],
                selectedChordQuality === quality ? styles.active : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setSelectedChordQuality(quality)}
            >
              {quality}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles['palette-section']}>
        <h3>Duration</h3>
        <div className={styles['palette-buttons']}>
          {DURATIONS.map((duration) => (
            <Button
              key={duration}
              className={[
                styles['palette-btn'],
                selectedDuration === duration ? styles.active : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setSelectedDuration(duration)}
            >
              {duration === 'whole' && '1'}
              {duration === 'half' && '1/2'}
              {duration === 'quarter' && '1/4'}
              {duration === 'eighth' && '1/8'}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles['palette-section']}>
        <h3>Accidental</h3>
        <div className={styles['palette-buttons']}>
          <Button
            className={[
              styles['palette-btn'],
              selectedAccidental === '' ? styles.active : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setSelectedAccidental('')}
          >
            Natural (♮)
          </Button>
          <Button
            className={[
              styles['palette-btn'],
              selectedAccidental === '#' ? styles.active : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setSelectedAccidental('#')}
          >
            ♯
          </Button>
          <Button
            className={[
              styles['palette-btn'],
              selectedAccidental === 'b' ? styles.active : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => setSelectedAccidental('b')}
          >
            ♭
          </Button>
        </div>
      </div>

      <div className={styles['palette-section']}>
        <h3>Rest</h3>
        <div className={styles['palette-buttons']}>
          <Button
            className={[styles['palette-btn'], isRest ? styles.active : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => setIsRest(!isRest)}
          >
            Rest
          </Button>
        </div>
      </div>

      <div className={styles['palette-section']}>
        <h3>Controls</h3>
        <Button
          className={`${styles['palette-btn']} ${styles['clear-btn']}`}
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
