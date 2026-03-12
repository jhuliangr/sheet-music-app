import React, { useState } from 'react';
import type { Song } from '#shared/types';
import { useSongsStore } from '#shared/stores/useSongsStore';
import { generateId } from '#shared/utils';
import styles from './SongList.module.css';
import { useSheetMusicComposer } from '../useSheetMusicComposer';

export const SongList: React.FC = () => {
  const { music, tempo, handleLoadSong } = useSheetMusicComposer();
  const { songs, addSong, deleteSong } = useSongsStore();

  const [songName, setSongName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const saveSong = () => {
    if (!songName.trim()) {
      setError('Please enter a name for the song');
      return;
    }

    if (music.length === 0) {
      setError('No notes to save');
      return;
    }

    const newSong: Song = {
      id: generateId(),
      name: songName.trim(),
      notesAndChords: music,
      tempo,
    };

    addSong(newSong);
    setSongName('');
    setError(null);
  };

  return (
    <div className={styles['song-list']}>
      <h3>Saved Songs</h3>

      <div className={styles['save-section']}>
        <input
          type="text"
          placeholder="Song name"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          className={styles['song-name-input']}
        />
        <button className={styles['save-btn']} onClick={saveSong}>
          Save
        </button>
      </div>

      {error && <p className={styles['error-msg']}>{error}</p>}

      <div className={styles['songs-container']}>
        {songs.length === 0 ? (
          <p className={styles['no-songs']}>No saved songs</p>
        ) : (
          songs.map((song) => (
            <div key={song.id} className={styles['song-item']}>
              <span className={styles['song-name']}>{song.name}</span>
              <span className={styles['song-info']}>
                {song.notesAndChords.length} notes - {song.tempo} BPM
              </span>
              <div className={styles['song-actions']}>
                <button
                  className={styles['load-btn']}
                  onClick={() => handleLoadSong(song)}
                >
                  Load
                </button>
                <button
                  className={styles['delete-btn']}
                  onClick={() => deleteSong(song.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
