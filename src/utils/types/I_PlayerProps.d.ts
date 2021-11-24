import { I_SearchResult } from './I_SearchResult';

export interface I_PlayerProps {
  initialValue: number;
  seek: (v: number) => void;
  podcast: I_SearchResult;
  play: () => void;
  isPaused: boolean;
  disabled: boolean;
  takeNote: () => void;
}
