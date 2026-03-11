import { useMemo, useState } from 'react';
import { Staff } from './Staff';
import { Palette } from './Palette';
import { PlaybackControls } from './PlaybackControls';
import { SongList } from './SongList';
import { useSongs } from '#shared/useSongs';
import { DURATION_BEATS } from '#shared/constants';
import type { ChordQuality, NoteName } from '#shared/types';
import './JazzSheets.css';

export function JazzSheets() {
  const {
    music,
    selectedNote,
    selectedNoteOctave,
    selectedChord,
    selectedDuration,
    selectedAccidental,
    isRest,
    tempo,
    isPlaying,
    currentPosition,
    rowsStaff,
    handleNoteClick,
    handleDeletion,
    handleStaffClick,
    handlePlay,
    handlePause,
    handleStop,
    handleTempoChange,
    handleLoadSong,
    handleClear,
    handleMaximumWidthChange,
    setIsRest,
    setSelectedNote,
    setSelectedChord,
    setSelectedDuration,
    setSelectedAccidental,
    setSelectedNoteOctave,
  } = useSongs();

  const [selectedChordQuality, setSelectedChordQuality] =
    useState<ChordQuality>('major');

  const activeNoteId = useMemo(() => {
    let accumulated = 0;
    for (const note of music) {
      const noteDuration = DURATION_BEATS[note.duration];
      if (
        currentPosition >= accumulated &&
        currentPosition < accumulated + noteDuration
      ) {
        return note.id;
      }
      accumulated += noteDuration;
    }
    return null;
  }, [currentPosition, music]);

  const handleNoteSelect = (note: NoteName) => {
    setSelectedNote(note);
    setSelectedChord(null);
  };
  const handleChordSelect = (chord: NoteName) => {
    setSelectedChord(chord);
    setSelectedNote(null);
  };

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
