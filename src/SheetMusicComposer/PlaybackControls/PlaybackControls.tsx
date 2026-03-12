import React from 'react';
import styles from './PlaybackControls.module.css';
import { usePlaybackContext } from '../usePlaybackContext';

export const PlaybackControls: React.FC = () => {
  const {
    isPlaying,
    tempo,
    handlePlay,
    handlePause,
    handleStop,
    handleTempoChange,
  } = usePlaybackContext();

  return (
    <div className={styles['playback-controls']}>
      <div className={styles['transport-controls']}>
        {!isPlaying ? (
          <button className={styles['control-btn']} onClick={handlePlay}>
            ▶ Play
          </button>
        ) : (
          <button className={styles['control-btn']} onClick={handlePause}>
            ⏸ Pause
          </button>
        )}
        <button
          className={`${styles['control-btn']} ${styles['stop-btn']}`}
          onClick={handleStop}
        >
          ⏹ Stop
        </button>
      </div>

      <div className={styles['tempo-control']}>
        <label htmlFor="tempo-slider">Tempo: {tempo} BPM</label>
        <input
          id="tempo-slider"
          type="range"
          min="40"
          max="200"
          value={tempo}
          onChange={(e) => handleTempoChange(Number(e.target.value))}
          className={styles['tempo-slider']}
        />
      </div>
    </div>
  );
};
