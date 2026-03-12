import React, { useState } from 'react';
import type { Song } from '#shared/types';
import { useSongsStore } from '#shared/stores/useSongsStore';
import { generateId } from '#shared/utils';
import './SongList.css';
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
    <div className="song-list">
      <h3>Saved Songs</h3>

      <div className="save-section">
        <input
          type="text"
          placeholder="Song name"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          className="song-name-input"
        />
        <button className="save-btn" onClick={saveSong}>
          Save
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="songs-container">
        {songs.length === 0 ? (
          <p className="no-songs">No saved songs</p>
        ) : (
          songs.map((song) => (
            <div key={song.id} className="song-item">
              <span className="song-name">{song.name}</span>
              <span className="song-info">
                {song.notesAndChords.length} notes - {song.tempo} BPM
              </span>
              <div className="song-actions">
                <button
                  className="load-btn"
                  onClick={() => handleLoadSong(song)}
                >
                  Load
                </button>
                <button
                  className="delete-btn"
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
