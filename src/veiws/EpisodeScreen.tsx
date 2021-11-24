import React, { useState, useEffect } from 'react';
import Loader from 'react-loader-spinner';
import Player from '../components/Player';
import { I_Note } from '../utils/types/I_Note';
import NoteSection from '../components/NoteSection';
import Note from '../components/Note';
import { I_EpisodeScreenProps } from '../utils/types/I_EpisodeScreenProps';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const EpisodeScreen = function ({
  accessToken,
  podcast,
}: I_EpisodeScreenProps) {
  const [isPaused, setIsPaused] = useState(true);
  const [deviceId, setDeviceId] = useState('');
  const [initialPlayPosition, setInitialPlayPosition] = useState<number>();
  const [isPlayButtonDisabled, setIsPlayButtonDisabled] = useState(false);
  const [player, setPlayer] = useState<any>();
  const [isEpisodeQueued, setIsEpisodeQueued] = useState(false);
  const [noteTimeStamp, setNoteTimeStamp] = useState<number>();
  const [notes, setNotes] = useState<{ [key: number]: I_Note }>({});
  const [currentNote, setCurrentNote] = useState<string>('');
  const [refreshNotes, setRefreshNotes] = useState(0);

  const play = () => {
    setIsPlayButtonDisabled(true);
    if (!isEpisodeQueued) {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        body: JSON.stringify({ uris: [podcast.uri] }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      }).then(() => {
        setIsEpisodeQueued(true);
        setIsPaused(false);
        setIsPlayButtonDisabled(false);
      });
    } else {
      player.togglePlay().then(() => {
        setIsPaused(!isPaused);
        setIsPlayButtonDisabled(false);
      });
    }
  };

  const seek = (ms: number) => {
    player.seek(ms);
    setInitialPlayPosition(ms);
  };

  const startNewNote = () => {
    player.getCurrentState().then((state: any) => {
      if (state) {
        setNoteTimeStamp(state.position);
      } else {
        setNoteTimeStamp(1000);
      }
    });
  };

  const saveNote = () => {
    if (currentNote === undefined || noteTimeStamp === undefined) return;
    setNotes({
      ...notes,
      [noteTimeStamp]: { time: noteTimeStamp, text: currentNote },
    });
    setCurrentNote('');
    setNoteTimeStamp(undefined);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = false;

    document.body.appendChild(script);
    let newPlayer: any;
    window['onSpotifyWebPlaybackSDKReady'] = () => {
      newPlayer = new window['Spotify'].Player({
        name: 'Web Playback SDK',
        getOAuthToken: (cb: any) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      newPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log(device_id);
        setDeviceId(device_id);
      });
      newPlayer.addListener(
        'not_ready',
        ({ device_id }: { device_id: string }) => {
          console.log('Device ID has gone offline', device_id);
        },
      );
      newPlayer.addListener(
        'player_state_changed',
        ({ position }: { position: number }) => {
          setInitialPlayPosition(position);
        },
      );

      newPlayer.connect().then(() => {
        setPlayer(newPlayer);
      });
    };
    return () => {
      newPlayer.pause();
      newPlayer.disconnect();
      newPlayer.removeListener('ready');
      newPlayer.removeListener('not_ready');
      newPlayer.removeListener('player_state_changed');
    };
  }, [accessToken]);

  if (!accessToken) return null;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        overflowY: 'auto',
        paddingBottom: '50px',
      }}
      className="disable-scrollbars"
    >
      <img
        src={podcast.imageUrl}
        alt="podcast cover"
        style={{ height: 300, resize: 'vertical' }}
      />
      {!deviceId && !isPlayButtonDisabled && (
        <div style={{ position: 'absolute', top: 175 }}>
          <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={3000}
          />
        </div>
      )}
      <span className="my-2 text-color">{podcast.title}</span>
      <Player
        takeNote={startNewNote}
        initialValue={initialPlayPosition || 0}
        seek={seek}
        podcast={podcast}
        play={play}
        isPaused={isPaused}
        disabled={!deviceId && !isPlayButtonDisabled}
      />
      {noteTimeStamp && (
        <NoteSection
          noteTimeStamp={noteTimeStamp}
          saveNote={saveNote}
          setNoteTimeStamp={setNoteTimeStamp}
          currentNote={currentNote}
          setCurrentNote={setCurrentNote}
        />
      )}
      <h1
        style={{
          textDecoration: 'underline',
          textUnderlinePosition: 'under',
        }}
        className="text-color"
      >
        Your Notes
      </h1>
      {Object.keys(notes).map((value: string, i) => {
        return (
          <Note
            key={notes[value].time}
            note={notes[value]}
            i={i}
            isPaused={isPaused}
            notes={notes}
            seek={seek}
            play={play}
            setNotes={setNotes}
            refreshNotes={() => setRefreshNotes(refreshNotes + 1)}
          />
        );
      })}
    </div>
  );
};

export default EpisodeScreen;
