import React, { SetStateAction, Dispatch } from 'react';
import { I_SearchResult } from '../utils/types/I_SearchResult';

const PodcastSearchResult = function ({
  searchResult,
  choosePodcast,
  chooseEpisode,
  isEpisode,
}: {
  searchResult: I_SearchResult;
  choosePodcast: Dispatch<SetStateAction<I_SearchResult | undefined>>;
  chooseEpisode: Dispatch<SetStateAction<I_SearchResult | undefined>>;
  isEpisode: boolean;
}) {
  const selectPodcast = () => {
    choosePodcast(searchResult);
  };

  const selectEpisode = () => {
    chooseEpisode(searchResult);
  };
  return (
    <span
      style={{
        cursor: 'pointer',
        margin: 5,
      }}
      onClick={isEpisode ? selectEpisode : selectPodcast}
      role="button"
    >
      <img
        src={searchResult.imageUrl}
        alt="track img"
        style={{ height: '300px', width: '300px' }}
      />

      <p
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          maxWidth: '300px',
        }}
      >
        {searchResult.title}
      </p>
    </span>
  );
};

export default PodcastSearchResult;