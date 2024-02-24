import React from "react";
import Note from "./Note";

function NoteList({ notes, deleteNote, updateNote }) {
  return (
    <div className="note-list">
      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          deleteNote={deleteNote}
          updateNote={updateNote}
        />
      ))}
    </div>
  );
}

export default NoteList;
