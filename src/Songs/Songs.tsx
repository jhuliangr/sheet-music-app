import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Staff } from '../SheetMusicComposer/Staff';
import { PlaybackControls } from '../SheetMusicComposer/PlaybackControls';
import { PlaybackProvider } from '../SheetMusicComposer/PlaybackProvider';
import { MusicTrivia } from './MusicTrivia';
import type { Song, Note, Chord } from '#shared/types';
import { DURATION_BEATS } from '#shared/constants';
import { usePlayback, useStaffLayout } from '#shared/index';
import { useSongsStore } from '#shared/songs/useSongsStore';
import styles from './Songs.module.css';

export const Songs: React.FC = () => {
  const navigate = useNavigate();
  const { songs, deleteSong } = useSongsStore();
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [music, setMusic] = useState<(Note | Chord)[]>([]);

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
    deleteSong(id);
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
    <div className={styles['songs-page']}>
      <div className={styles['songs-page-header']}>
        <button
          className={styles['back-btn']}
          onClick={() => navigate({ to: '/' })}
        >
          ← Back to Composer
        </button>
        <h2>Saved Songs</h2>
      </div>

      <div className={styles['songs-page-content']}>
        <div className={styles['songs-list-section']}>
          {songs.length === 0 ? (
            <p className={styles['no-songs']}>No saved songs</p>
          ) : (
            songs.map((song) => (
              <div
                key={song.id}
                className={[
                  styles['song-item'],
                  selectedSong?.id === song.id ? styles.selected : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className={styles['song-info']}>
                  <span className={styles['song-name']}>{song.name}</span>
                  <span className={styles['song-details']}>
                    {song.notesAndChords.length} notes - {song.tempo} BPM
                  </span>
                </div>
                <div className={styles['song-actions']}>
                  <button
                    className={styles['load-btn']}
                    onClick={() => handleLoadSong(song)}
                  >
                    Load to Staff
                  </button>
                  <button
                    className={styles['delete-btn']}
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

        <div className={styles['staff-preview-section']}>
          {selectedSong ? (
            <>
              <h3>Preview: {selectedSong.name}</h3>
              <div className={styles['staff-section']}>
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
            <p className={styles['no-selection']}>Select a song to preview</p>
          )}
        </div>
      </div>
    </div>
  );
};
