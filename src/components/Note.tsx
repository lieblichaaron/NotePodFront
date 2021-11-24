import React, { useState } from 'react';
import { FiEdit3, FiCheck, FiXCircle, FiTrash2 } from 'react-icons/fi';
import { Form } from 'react-bootstrap';
import { msToTime } from '../utils/msToTime';
import { I_NoteProps } from '../utils/types/I_NoteProps';

const ICON_SIZE = 20;
const Note = function ({
  note,
  i,
  isPaused,
  notes,
  seek,
  play,
  setNotes,
  refreshNotes,
}: I_NoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState('');

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        borderBottom:
          i !== Object.keys(notes).length - 1 ? '1px solid' : undefined,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '10px 100px',
      }}
    >
      <div
        role="button"
        onClick={() => {
          seek(note.time);
          if (isPaused) {
            play();
          }
        }}
        className="text-color"
        style={{ marginRight: 5 }}
      >{`${msToTime(note.time)}:`}</div>
      {!isEditing ? (
        <p className="text-color" style={{ flexGrow: 1, margin: '0 10px' }}>
          {note.text}
        </p>
      ) : (
        <Form.Control
          style={{ margin: '0 10px' }}
          autoFocus
          as="textarea"
          rows={5}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onFocus={() => setNewText(note.text)}
        />
      )}
      {!isEditing ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '50px',
          }}
        >
          <FiEdit3
            role="button"
            color="white"
            onClick={() => {
              setIsEditing(true);
            }}
            size={ICON_SIZE}
          />
          <FiTrash2
            role="button"
            color="red"
            onClick={() => {
              delete notes[note.time];
              setNotes(notes);
              refreshNotes();
            }}
            size={ICON_SIZE}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FiCheck
            role="button"
            color="green"
            onClick={() => {
              notes[note.time].text = newText;
              setNotes(notes);
              setIsEditing(false);
              setNewText('');
            }}
            size={ICON_SIZE}
          />
          <FiXCircle
            role="button"
            color="red"
            onClick={() => {
              setIsEditing(false);
              setNewText('');
            }}
            size={ICON_SIZE}
          />
        </div>
      )}
    </div>
  );
};

export default Note;
