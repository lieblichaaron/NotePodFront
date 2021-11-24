export interface I_NoteSectionProps {
  noteTimeStamp: number;
  saveNote: () => void;
  setNoteTimeStamp: (ms: number | undefined) => void;
  currentNote: string;
  setCurrentNote: (text: string) => void;
}
