import { I_Note } from '../GeneralTypes/I_Note';

export interface I_NoteProps {
  note: I_Note;
  i: number;
  isPaused: boolean;
  notes: { [key: number]: I_Note };
  seek: (ms: number) => void;
  play: () => void;
  setNotes: Dispatch<SetStateAction<{ [key: number]: I_Note }>>;
  refreshNotes: Dispatch<SetStateAction<number>>;
}
