import { useState, useCallback, useEffect } from 'react';

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
import { useMusicStore } from './stores/useMusicStore';

export const useSongs = () => {
  const { music, setMusic } = useMusicStore();
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

  const handleDeletion = (id: string) => {
    setMusic(
      music.filter((n) => n.id !== id).map((n, i) => ({ ...n, position: i })),
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

    setMusic([...music, newItem].sort((a, b) => a.position - b.position));
  };

  const handleLoadSong = useCallback(
    (song: Song) => {
      setMusic(song.notesAndChords);
      setTempo(song.tempo);
      handleStop();
    },
    [handleStop, setMusic, setTempo],
  );

  const handleClear = useCallback(() => {
    setMusic([]);
    handleStop();
  }, [handleStop, setMusic]);

  useEffect(() => {
    const ref = animationRef;
    return () => {
      const frameId = ref.current;
      if (frameId != null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [animationRef]);

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
