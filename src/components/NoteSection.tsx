import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { msToTime } from '../utils/msToTime';
import { I_NoteSectionProps } from '../utils/types/I_NoteSectionProps';

const NoteSection = function ({
  noteTimeStamp,
  saveNote,
  setNoteTimeStamp,
  currentNote,
  setCurrentNote,
}: I_NoteSectionProps) {
  return (
    <Form.Group
      className="m-3"
      controlId="note input"
      style={{ width: '100%' }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 5,
        }}
      >
        <Form.Label className="text-color">
          {msToTime(noteTimeStamp)}
        </Form.Label>
        <div>
          <Button style={{ margin: 5 }} variant="success" onClick={saveNote}>
            Save Note
          </Button>
          <Button
            style={{ margin: 5 }}
            variant="danger"
            onClick={() => setNoteTimeStamp(undefined)}
          >
            Delete Note
          </Button>
        </div>
      </div>
      <Form.Control
        autoFocus
        as="textarea"
        rows={5}
        value={currentNote}
        onChange={(e) => setCurrentNote(e.target.value)}
      />
    </Form.Group>
  );
};

export default NoteSection;
