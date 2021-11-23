import React, { useState, useEffect } from 'react';
import { I_SearchResult } from '../utils/types/I_SearchResult';
import Player from '../components/Player';

const EpisodeScreen = function ({
  accessToken,
  podcast,
}: {
  accessToken: string;
  podcast: I_SearchResult;
}) {
  const [isPaused, setIsPaused] = useState(true);
  const [deviceId, setDeviceId] = useState('');
  const [initialPlayPosition, setInitialPlayPosition] = useState<number>();
  const [isPlayButtonDisabled, setIsPlayButtonDisabled] = useState(false);
  const [player, setPlayer] = useState<any>();
  const [isEpisodeQueued, setIsEpisodeQueued] = useState(false);

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
      let initialSet = false;
      newPlayer.addListener(
        'player_state_changed',
        ({ position }: { position: number }) => {
          if (!initialSet) {
            setInitialPlayPosition(position);
            initialSet = true;
          }
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
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <img
        src={podcast.imageUrl}
        alt="podcast cover"
        style={{ height: 300, resize: 'vertical' }}
      />
      <span className="my-2">{podcast.title}</span>
      <Player
        initialValue={initialPlayPosition || 0}
        seek={seek}
        podcast={podcast}
        play={play}
        isPaused={isPaused}
        disabled={!deviceId && !isPlayButtonDisabled}
      />
    </div>
  );
};

export default EpisodeScreen;
