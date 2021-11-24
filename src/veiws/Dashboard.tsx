import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import EpisodeScreen from './EpisodeScreen';
import useAuth from '../utils/useAuth';
import PodcastSearchResult from '../components/PodcastSearchResult';
import { I_DashboardProps } from '../utils/types/I_DashboardProps';
import { I_SearchResult } from '../utils/types/I_SearchResult';
import spotifyApi from '../utils/spotifyApi';

const Dashboard = function ({ code }: I_DashboardProps) {
  const [search, setSearch] = useState('');
  const [podcastSearchResults, setPodcastSearchResults] = useState<
    I_SearchResult[]
  >([]);
  const [episodeSearchResults, setEpisodeSearchResults] = useState<
    I_SearchResult[]
  >([]);
  const [selectedPodcast, setSelectedPodcast] = useState<I_SearchResult>();
  const [selectedEpisode, setSelecteEpisode] = useState<I_SearchResult>();
  const [offset, setOffset] = useState(0);
  const accessToken = useAuth(code);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    setSelectedPodcast(undefined);
    if (!search) {
      setPodcastSearchResults([]);
      return;
    }
    if (!accessToken) return;
    let cancel = false;
    spotifyApi.searchShows(search).then((res) => {
      if (cancel) return;
      if (res.body.shows) {
        setPodcastSearchResults(
          res.body.shows.items.map((show) => {
            return {
              title: show.name,
              uri: show.uri,
              imageUrl: show.images[show.images.length - 2].url,
              id: show.id,
            };
          }),
        );
      }
    });

    return () => {
      cancel = true;
    };
  }, [accessToken, search]);

  useEffect(() => {
    if (!selectedPodcast) return;
    spotifyApi
      .getShowEpisodes(selectedPodcast.id, { limit: 50 })
      .then((res) => {
        setOffset(res.body.items.length + 1);
        if (res.body.items) {
          setEpisodeSearchResults(
            res.body.items.map((episode) => {
              return {
                title: episode.name,
                uri: episode.uri,
                imageUrl: episode.images[episode.images.length - 2].url,
                id: episode.id,
                time: episode.duration_ms,
              };
            }),
          );
        }
      });
  }, [selectedPodcast]);

  const handlePagination = (e: any) => {
    if (!selectedPodcast) return;
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      spotifyApi
        .getShowEpisodes(selectedPodcast.id, { limit: 50, offset })
        .then((res) => {
          setOffset(offset + res.body.items.length + 1);
          if (res.body.items) {
            setEpisodeSearchResults([
              ...episodeSearchResults,
              ...res.body.items.map((episode) => {
                return {
                  title: episode.name,
                  uri: episode.uri,
                  imageUrl: episode.images[episode.images.length - 2].url,
                  id: episode.id,
                  time: episode.duration_ms,
                };
              }),
            ]);
          }
        });
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        backgroundColor: '#3b3b3b',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 20px 0px 20px',
        margin: 0,
      }}
    >
      {!selectedEpisode ? (
        <>
          {!selectedPodcast ? (
            <Form.Control
              className="my-2"
              type="search"
              placeholder="Search Podcasts"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          ) : (
            <Button
              className="btn btn-secondary btn-lg my-2"
              onClick={() => setSelectedPodcast(undefined)}
            >
              Back to Podcasts
            </Button>
          )}
          <div
            onScroll={handlePagination}
            style={{
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {selectedPodcast
              ? episodeSearchResults.map((result) => (
                  <PodcastSearchResult
                    isEpisode={!!selectedPodcast}
                    searchResult={result}
                    key={result.uri}
                    choosePodcast={setSelectedPodcast}
                    chooseEpisode={setSelecteEpisode}
                  />
                ))
              : podcastSearchResults.map((result) => (
                  <PodcastSearchResult
                    isEpisode={!!selectedPodcast}
                    searchResult={result}
                    key={result.uri}
                    choosePodcast={setSelectedPodcast}
                    chooseEpisode={setSelecteEpisode}
                  />
                ))}
          </div>
        </>
      ) : (
        <Button
          className="btn btn-secondary btn-lg my-2"
          onClick={() => setSelecteEpisode(undefined)}
        >
          Back to episodes
        </Button>
      )}
      {accessToken && selectedEpisode && selectedPodcast && (
        <EpisodeScreen accessToken={accessToken} podcast={selectedEpisode} />
      )}
    </div>
  );
};

export default Dashboard;
