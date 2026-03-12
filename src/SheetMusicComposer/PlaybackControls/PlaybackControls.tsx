import React from 'react';
import './PlaybackControls.css';
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
    <div className="playback-controls">
      <div className="transport-controls">
        {!isPlaying ? (
          <button className="control-btn play-btn" onClick={handlePlay}>
            ▶ Play
          </button>
        ) : (
          <button className="control-btn pause-btn" onClick={handlePause}>
            ⏸ Pause
          </button>
        )}
        <button className="control-btn stop-btn" onClick={handleStop}>
          ⏹ Stop
        </button>
      </div>

      <div className="tempo-control">
        <label htmlFor="tempo-slider">Tempo: {tempo} BPM</label>
        <input
          id="tempo-slider"
          type="range"
          min="40"
          max="200"
          value={tempo}
          onChange={(e) => handleTempoChange(Number(e.target.value))}
          className="tempo-slider"
        />
      </div>
    </div>
  );
};
