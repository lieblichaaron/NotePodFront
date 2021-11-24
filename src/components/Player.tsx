import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import PlayerButton from './PlayerButton';
import { I_PlayerProps } from '../utils/types/PropTypes/I_PlayerProps';
import { msToTime } from '../utils/msToTime';

const Player = function ({
  initialValue,
  seek,
  podcast,
  play,
  isPaused,
  disabled,
  takeNote,
}: I_PlayerProps) {
  const [currentPlace, setCurrentPlace] = useState(initialValue);

  useEffect(() => {
    setCurrentPlace(initialValue);
  }, [initialValue]);

  useEffect(() => {
    let interval: any;
    if (!isPaused) {
      interval = setInterval(() => {
        setCurrentPlace((prev) => prev + 1000);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  const noteHandler = () => {
    if (!isPaused) {
      play();
    }
    takeNote();
  };

  if (!podcast.time) return null;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <PlayerButton
          disabled={disabled}
          isPaused={isPaused}
          onClick={play}
          type="play"
        />
        <PlayerButton
          disabled={disabled}
          isPaused={isPaused}
          onClick={noteHandler}
          type="note"
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ width: 100 }} className="text-color">
          {msToTime(currentPlace)}
        </span>
        <Slider
          min={0}
          max={podcast.time - (podcast.time % 100)}
          step={100}
          value={currentPlace}
          onChange={(v) => setCurrentPlace(v)}
          onAfterChange={(v) => seek(v)}
          disabled={disabled}
        />
        <span
          className="text-color"
          style={{
            width: 100,
            textAlign: 'end',
          }}
        >
          {msToTime(podcast.time)}
        </span>
      </div>
    </div>
  );
};

export default Player;
