import React from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { CgNotes } from 'react-icons/cg';

const PlayerButton = function ({
  onClick,
  disabled,
  isPaused,
  type,
}: {
  onClick: () => void;
  disabled: boolean;
  isPaused: boolean;
  type: 'note' | 'play';
}) {
  const playButton = () => {
    return isPaused ? (
      <FaPlay style={{ top: -2, position: 'relative' }} />
    ) : (
      <FaPause style={{ top: -2, position: 'relative' }} />
    );
  };

  const noteButton = () => {
    return <CgNotes style={{ top: -2, position: 'relative' }} />;
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        border: 'none',
        backgroundColor: type === 'play' ? '#00FF00' : '#75E6DA',
        boxShadow: '0 0 4px 2px rgba(0,0,0,.2)',
        cursor: 'pointer',
        height: 50,
        outline: 'none',
        borderRadius: '100%',
        width: 50,
        margin: '5px',
      }}
    >
      {type === 'play' ? playButton() : noteButton()}
    </button>
  );
};

export default PlayerButton;
