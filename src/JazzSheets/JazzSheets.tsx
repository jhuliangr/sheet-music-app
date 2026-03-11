import { useState, useRef, useCallback, useEffect } from 'react';
import * as Tone from 'tone';
import { Staff } from './Staff';
import { Palette } from './Palette';
import { PlaybackControls } from './PlaybackControls';
import { SongList } from './SongList';
import { generateId } from '#shared/types';
import {
  DURATION_BEATS,
  CHORD_INTERVALS,
  NOTE_TO_SEMITONE,
  ACCIDENTAL_OFFSET,
  SEMITONE_TO_NOTE,
} from '#shared/constants';
import type {
  Note,
  NoteName,
  Duration,
  Accidental,
  Chord,
  ChordQuality,
  Song,
} from '#shared/types';
import './JazzSheets.css';
import { NOTE_WIDTH, STAFF_PADDING } from './Staff/utils/constants';

const masterGain = new Tone.Gain(1).toDestination();
const pianoSampler = new Tone.Sampler({
  urls: {
    C4: 'C4.mp3',
    'D#4': 'Ds4.mp3',
    'F#4': 'Fs4.mp3',
    A4: 'A4.mp3',
  },
  baseUrl: 'https://tonejs.github.io/audio/salamander/',
  release: 1,
}).connect(masterGain);

const noteNameToTone = (
  note: string,
  octave: number,
  accidental: string,
): string => {
  return `${note}${accidental}${octave}`;
};

export function JazzSheets() {
  const [music, setMusic] = useState<(Note | Chord)[]>(() => {
    const saved = localStorage.getItem('music');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedNote, setSelectedNote] = useState<NoteName | null>('C');
  const [selectedNoteOctave, setSelectedNoteOctave] = useState<number>(4);
  const [selectedChord, setSelectedChord] = useState<NoteName | null>('C');
  const [selectedChordQuality, setSelectedChordQuality] =
    useState<ChordQuality>('major');

  const [selectedDuration, setSelectedDuration] = useState<Duration>('quarter');
  const [selectedAccidental, setSelectedAccidental] = useState<Accidental>('');
  const [isRest, setIsRest] = useState<boolean>(false);
  const [tempo, setTempo] = useState<number>(120);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const positionRef = useRef<number>(0);

  const getTotalBeats = useCallback(() => {
    return music.reduce(
      (total, note) => total + DURATION_BEATS[note.duration],
      0,
    );
  }, [music]);
  const [rowsStaff, setRowsStaff] = useState<
    { notes: (Note | Chord)[]; position: number }[]
  >([]);
  const skipInitialSave = useRef(false);
  const lastWidthRef = useRef(0);

  const handleNoteClick = useCallback((position: number) => {
    console.log('noteClick ', position);
    // setMusic((prev) => prev.filter((n) => n.position !== position));
  }, []);

  const handleDeletion = (id: string) => {
    setMusic((prev) =>
      prev.filter((n) => n.id !== id).map((n, i) => ({ ...n, position: i })),
    );
  };

  const handleStaffClick = () => {
    if (selectedNote === null && selectedChord === null) return;

    const maxPosition =
      music.length > 0 ? Math.max(...music.map((n) => n.position)) + 1 : 0;
    let newItem: Chord | Note;

    if (selectedNote) {
      newItem = {
        id: generateId(),
        note: selectedNote,
        accidental: selectedAccidental,
        octave: selectedNoteOctave,
        duration: selectedDuration,
        position: maxPosition,
        isRest: isRest,
      };
    } else {
      newItem = {
        id: generateId(),
        note: selectedChord,
        duration: selectedDuration,
        position: maxPosition,
        accidental: selectedAccidental,
        quality: selectedChordQuality,
        features: [],
      };
    }

    const newMusic = [...music, newItem].sort(
      (a, b) => a.position - b.position,
    );
    setMusic(newMusic);
  };

  const handlePlay = useCallback(async () => {
    if (music.length === 0) return;

    await Tone.start();

    // Cancel any previously scheduled transport events and reset
    Tone.getTransport().cancel(0);
    Tone.getTransport().stop();
    Tone.getTransport().bpm.value = tempo;

    setIsPlaying(true);
    positionRef.current = 0;
    setActiveNoteId(null);
    lastTimeRef.current = performance.now();

    const getChordNotes = (chord: Chord): string[] => {
      if (!chord.note) return [];
      const rootMidi =
        12 * (4 + 1) +
        NOTE_TO_SEMITONE[chord.note] +
        ACCIDENTAL_OFFSET[chord.accidental];
      const quality: ChordQuality = chord.quality ?? 'major';
      return CHORD_INTERVALS[quality].map((interval) => {
        const midi = rootMidi + interval;
        const octave = Math.floor(midi / 12) - 1;
        const noteName = SEMITONE_TO_NOTE[midi % 12];
        return `${noteName}${octave}`;
      });
    };

    let currentBeat = 0;
    music.forEach((noteItem) => {
      const beats = DURATION_BEATS[noteItem.duration];

      if (!('isRest' in noteItem && noteItem.isRest) && noteItem.note) {
        const beatOffset = currentBeat;
        const duration = DURATION_BEATS[noteItem.duration] / (tempo / 60);

        if ('features' in noteItem) {
          const notes = getChordNotes(noteItem);
          if (notes.length > 0) {
            Tone.getTransport().schedule(
              (time) => {
                pianoSampler.triggerAttackRelease(notes, duration, time);
              },
              beatOffset / (tempo / 60),
            );
          }
        } else {
          const noteString = noteNameToTone(
            noteItem.note,
            noteItem.octave,
            noteItem.accidental,
          );
          Tone.getTransport().schedule(
            (time) => {
              pianoSampler.triggerAttackRelease(noteString, duration, time);
            },
            beatOffset / (tempo / 60),
          );
        }
      }

      currentBeat += beats;
    });

    Tone.getTransport().start();

    const computeActiveNoteId = (beatPosition: number): string | null => {
      let accumulated = 0;
      for (const note of music) {
        const noteDuration = DURATION_BEATS[note.duration];
        if (
          beatPosition >= accumulated &&
          beatPosition < accumulated + noteDuration
        ) {
          return note.id;
        }
        accumulated += noteDuration;
      }
      return null;
    };

    const animate = (time: number) => {
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const beatsPerSecond = tempo / 60;
      positionRef.current += delta * beatsPerSecond;

      const totalBeats = getTotalBeats();
      if (positionRef.current >= totalBeats) {
        positionRef.current = 0;
        setActiveNoteId(null);
        setIsPlaying(false);
        Tone.getTransport().stop();
        Tone.getTransport().cancel(0);
        return;
      }

      setActiveNoteId(computeActiveNoteId(positionRef.current));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [music, tempo, getTotalBeats]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    Tone.getTransport().stop();
    Tone.getTransport().cancel(0);
    pianoSampler.releaseAll();
  }, []);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    positionRef.current = 0;
    setActiveNoteId(null);
    Tone.getTransport().stop();
    Tone.getTransport().cancel(0);
    pianoSampler.releaseAll();
  }, []);

  const handleTempoChange = useCallback((newTempo: number) => {
    setTempo(newTempo);
  }, []);

  const handleLoadSong = useCallback(
    (song: Song) => {
      setMusic(song.notesAndChords);
      setTempo(song.tempo);
      handleStop();
    },
    [handleStop],
  );

  const handleClear = useCallback(() => {
    setMusic([]);
    handleStop();
  }, [handleStop]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleNoteSelect = useCallback((note: NoteName | null) => {
    setSelectedNote(note);
    if (note !== null) setSelectedChord(null);
  }, []);

  const handleChordSelect = useCallback((chord: NoteName | null) => {
    setSelectedChord(chord);
    if (chord !== null) setSelectedNote(null);
  }, []);

  /**
   * We pass the actual width of the staff and we use it to calculate the number of notes per row
   * We calculate internally the max width of the staff and we use it to calculate the number of notes per row
   *
   * @param actualWidth - The actual width of the staff
   * @returns void
   */
  const handleMaximumWidthChange = useCallback(
    (actualWidth: number) => {
      lastWidthRef.current = actualWidth;
      const width = STAFF_PADDING * 2 + (music.length + 1) * NOTE_WIDTH;

      //We have enough space, we don't need to have more rows
      if (actualWidth >= width) {
        setRowsStaff([
          {
            notes: music.map((note, i) => ({ ...note, position: i })),
            position: 0,
          },
        ]);
        return;
      }

      /**
       *
       * @param arr - The array of notes or chords
       * @param notesPerRow - The number of notes per row
       * @returns The array of notes or chords grouped by the number of notes per row
       */
      const chunkMusic = (
        arr: (Note | Chord)[],
        notesPerRow: number,
      ): (Note | Chord)[][] => {
        const chunks: (Note | Chord)[][] = [];
        for (let start = 0; start < arr.length; start += notesPerRow) {
          chunks.push(arr.slice(start, start + notesPerRow));
        }
        return chunks;
      };

      const usableWidth = actualWidth - 2 * STAFF_PADDING;
      const notesPerRow = Math.max(1, Math.floor(usableWidth / NOTE_WIDTH));

      //We set the rows staff
      setRowsStaff(
        chunkMusic(music, notesPerRow).map((chunk, index) => ({
          notes: chunk.map((note, i) => ({ ...note, position: i })),
          position: index,
        })),
      );
    },
    [music],
  );

  //useEffect for reacting to changes in the music array and saving the music to the localStorage
  //and for handling the maximum width change of the staff
  useEffect(() => {
    if (!skipInitialSave.current) {
      skipInitialSave.current = true;
      return;
    }
    localStorage.setItem('music', JSON.stringify(music));
    if (lastWidthRef.current !== 0) {
      handleMaximumWidthChange(lastWidthRef.current);
    }
  }, [music, handleMaximumWidthChange]);

  return (
    <div className="main-content">
      <div className="staff-section" style={{ maxWidth: '100%' }}>
        {rowsStaff.length > 0 &&
          rowsStaff.map((row, index) => (
            <div
              key={row.position}
              onClick={
                index === rowsStaff.length - 1 ? handleStaffClick : undefined
              }
              className="staff-row"
            >
              <Staff
                key={row.position}
                music={row.notes}
                activeNoteId={activeNoteId}
                isPlaying={isPlaying}
                onNoteClick={
                  index === rowsStaff.length - 1 ? handleNoteClick : undefined
                }
                onDelete={handleDeletion}
                onMaximumWidthChange={
                  index === 0 ? handleMaximumWidthChange : undefined
                }
              />
            </div>
          ))}
        {rowsStaff.length === 0 && (
          <div className="single-staff" style={{ maxWidth: '100%' }}>
            <Staff
              music={music}
              activeNoteId={activeNoteId}
              isPlaying={isPlaying}
              onNoteClick={handleNoteClick}
              onDelete={handleDeletion}
              onMaximumWidthChange={handleMaximumWidthChange}
            />
          </div>
        )}
      </div>
      <div className="palette-and-saved-songs">
        <Palette
          selectedNote={selectedNote}
          selectedChord={selectedChord}
          selectedChordQuality={selectedChordQuality}
          selectedDuration={selectedDuration}
          selectedAccidental={selectedAccidental}
          isRest={isRest}
          selectedNoteOctave={selectedNoteOctave}
          setSelectedNoteOctave={setSelectedNoteOctave}
          onNoteSelect={handleNoteSelect}
          onChordSelect={handleChordSelect}
          onChordQualitySelect={setSelectedChordQuality}
          onDurationSelect={setSelectedDuration}
          onAccidentalToggle={setSelectedAccidental}
          onRestToggle={() => setIsRest(!isRest)}
          onClear={handleClear}
        />
        <SongList
          currentNotes={music}
          currentTempo={tempo}
          onLoadSong={handleLoadSong}
        />
      </div>

      <PlaybackControls
        isPlaying={isPlaying}
        tempo={tempo}
        onPlay={handlePlay}
        onPause={handlePause}
        onStop={handleStop}
        onTempoChange={handleTempoChange}
      />
    </div>
  );
}
