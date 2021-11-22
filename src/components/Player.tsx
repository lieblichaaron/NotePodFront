import React, { useState, useEffect } from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaPlay, FaPause } from 'react-icons/fa';
import { I_SearchResult } from '../utils/types/I_SearchResult';

const Player = function ({
  initialValue,
  seek,
  podcast,
  play,
  isPaused,
  disabled,
}: {
  initialValue: number;
  seek: (v: number) => void;
  podcast: I_SearchResult;
  play: () => void;
  isPaused: boolean;
  disabled: boolean;
}) {
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
  function msToTime(duration: number) {
    let seconds: string | number = Math.floor((duration / 1000) % 60);
    let minutes: string | number = Math.floor((duration / (1000 * 60)) % 60);
    let hours: string | number = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${hours}:${minutes}:${seconds}`;
  }
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
      <button
        type="button"
        disabled={disabled}
        onClick={play}
        style={{
          border: 'none',
          backgroundColor: 'green',
          boxShadow: '0 0 4px 2px rgba(0,0,0,.2)',
          cursor: 'pointer',
          height: 50,
          outline: 'none',
          borderRadius: '100%',
          width: 50,
          position: 'relative',
        }}
      >
        {isPaused ? (
          <FaPlay style={{ top: 17, left: 18, position: 'absolute' }} />
        ) : (
          <FaPause style={{ top: 17, left: 17, position: 'absolute' }} />
        )}
      </button>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ width: 100 }}>{msToTime(currentPlace)}</span>
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
