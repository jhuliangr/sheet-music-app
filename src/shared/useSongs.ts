import { useState, useRef, useCallback, useEffect } from 'react';

import {
  type Note,
  type Chord,
  type NoteName,
  type Duration,
  type Accidental,
  type ChordQuality,
  type Song,
} from './types';
import { usePlayback } from './usePlayback';
import { generateId } from './utils';
import { useStaffLayout } from './useStaffLayout';

const getInitialMusic = (): (Note | Chord)[] => {
  try {
    const saved = localStorage.getItem('music');
    if (saved) {
      return JSON.parse(saved) as (Note | Chord)[];
    }
    return [];
  } catch {
    return [];
  }
};

export const useSongs = () => {
  const [music, setMusic] = useState<(Note | Chord)[]>(getInitialMusic);
  const [selectedNote, setSelectedNote] = useState<NoteName | null>('C');
  const [selectedNoteOctave, setSelectedNoteOctave] = useState<number>(4);
  const [selectedChord, setSelectedChord] = useState<NoteName | null>(null);
  const [selectedChordQuality, setSelectedChordQuality] =
    useState<ChordQuality>('major');
  const [selectedDuration, setSelectedDuration] = useState<Duration>('quarter');
  const [selectedAccidental, setSelectedAccidental] = useState<Accidental>('');
  const [isRest, setIsRest] = useState<boolean>(false);

  const {
    handlePlay,
    handlePause,
    handleStop,
    handleTempoChange,
    tempo,
    currentPosition,
    animationRef,
    lastTimeRef,
    positionRef,
    setTempo,
    setIsPlaying,
    isPlaying,
  } = usePlayback(music);

  const { rowsStaff, handleMaximumWidthChange } = useStaffLayout(music);

  const skipInitialSave = useRef(false);

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

  const handleLoadSong = useCallback(
    (song: Song) => {
      setMusic(song.notesAndChords);
      setTempo(song.tempo);
      handleStop();
    },
    [handleStop, setTempo],
  );

  const handleClear = useCallback(() => {
    setMusic([]);
    handleStop();
  }, [handleStop]);

  useEffect(() => {
    const ref = animationRef;
    return () => {
      const frameId = ref.current;
      if (frameId != null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [animationRef]);

  useEffect(() => {
    if (!skipInitialSave.current) {
      skipInitialSave.current = true;
      return;
    }
    localStorage.setItem('music', JSON.stringify(music));
  }, [music]);

  return {
    music,
    selectedNote,
    selectedNoteOctave,
    selectedChord,
    selectedDuration,
    selectedAccidental,
    isRest,
    tempo,
    currentPosition,
    rowsStaff,
    handleDeletion,
    handleStaffClick,
    handlePlay,
    handlePause,
    handleStop,
    handleTempoChange,
    handleLoadSong,
    handleClear,
    handleMaximumWidthChange,
    animationRef,
    lastTimeRef,
    positionRef,
    setIsPlaying,
    setIsRest,
    setSelectedNote,
    setSelectedDuration,
    setSelectedAccidental,
    setSelectedNoteOctave,
    setSelectedChord,
    selectedChordQuality,
    setSelectedChordQuality,
    isPlaying,
  };
};
