import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Staff } from '../SheetMusicComposer/Staff';
import { PlaybackControls } from '../SheetMusicComposer/PlaybackControls';
import { PlaybackProvider } from '../SheetMusicComposer/PlaybackProvider';
import { MusicTrivia } from './MusicTrivia';
import type { Song, Note, Chord } from '#shared/types';
import { DURATION_BEATS } from '#shared/constants';
import { usePlayback, useStaffLayout } from '#shared/index';
import './Songs.css';

const STORAGE_KEY = 'sheet-music-songs';

export const Songs: React.FC = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<Song[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [music, setMusic] = useState<(Note | Chord)[]>([]);
  const [error, setError] = useState<string | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      JSON.parse(stored);
      return null;
    } catch {
      return 'Error loading saved songs';
    }
  });

  const {
    handleStop,
    handlePlay,
    handlePause,
    handleTempoChange,
    isPlaying,
    tempo,
    currentPosition,
    animationRef,
    setTempo,
  } = usePlayback(music);

  const { rowsStaff, handleMaximumWidthChange } = useStaffLayout(music);

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

  const handleLoadSong = useCallback(
    (song: Song) => {
      setSelectedSong(song);
      setMusic(song.notesAndChords);
      setTempo(song.tempo);
      handleStop();
    },
    [handleStop, setTempo],
  );

  const handleDeleteSong = (id: string) => {
    const updatedSongs = songs.filter((s) => s.id !== id);
    setSongs(updatedSongs);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSongs));
    } catch {
      setError('Error deleting the song');
    }

    if (selectedSong?.id === id) {
      setSelectedSong(null);
      setMusic([]);
    }
  };

  useEffect(() => {
    const ref = animationRef;
    return () => {
      const frameId = ref.current;
      if (frameId != null) cancelAnimationFrame(frameId);
    };
  }, [animationRef]);

  return (
    <div className="songs-page">
      <div className="songs-page-header">
        <button className="back-btn" onClick={() => navigate({ to: '/' })}>
          ← Back to Composer
        </button>
        <h2>Saved Songs</h2>
      </div>

      <div className="songs-page-content">
        <div className="songs-list-section">
          {error && <p className="error-msg">{error}</p>}
          {songs.length === 0 ? (
            <p className="no-songs">No saved songs</p>
          ) : (
            songs.map((song) => (
              <div
                key={song.id}
                className={`song-item ${selectedSong?.id === song.id ? 'selected' : ''}`}
              >
                <div className="song-info">
                  <span className="song-name">{song.name}</span>
                  <span className="song-details">
                    {song.notesAndChords.length} notes - {song.tempo} BPM
                  </span>
                </div>
                <div className="song-actions">
                  <button
                    className="load-btn"
                    onClick={() => handleLoadSong(song)}
                  >
                    Load to Staff
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteSong(song.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
          <MusicTrivia />
        </div>

        <div className="staff-preview-section">
          {selectedSong ? (
            <>
              <h3>Preview: {selectedSong.name}</h3>
              <div className="staff-section">
                {rowsStaff.length > 0 &&
                  rowsStaff.map((row) => (
                    <Staff
                      key={row.position}
                      music={row.notes}
                      activeNoteId={activeNoteId}
                      isPlaying={isPlaying}
                      onDelete={() => {}}
                      onMaximumWidthChange={
                        row.position === 0
                          ? handleMaximumWidthChange
                          : undefined
                      }
                    />
                  ))}
                {rowsStaff.length === 0 && (
                  <Staff
                    music={music}
                    activeNoteId={activeNoteId}
                    isPlaying={isPlaying}
                    onDelete={() => {}}
                    onMaximumWidthChange={handleMaximumWidthChange}
                  />
                )}
              </div>
              <PlaybackProvider
                value={{
                  isPlaying,
                  tempo,
                  handlePlay,
                  handlePause,
                  handleStop,
                  handleTempoChange,
                }}
              >
                <PlaybackControls />
              </PlaybackProvider>
            </>
          ) : (
            <p className="no-selection">Select a song to preview</p>
          )}
        </div>
      </div>
    </div>
  );
};
