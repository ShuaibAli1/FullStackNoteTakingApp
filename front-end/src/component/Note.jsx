import React from "react";

function Note({ note, deleteNote, updateNote }) {
  return (
    <div className="note" style={{ backgroundColor: note.color }}>
      <h3 style={{ color: "white" }}>{note.title}</h3>
      <p style={{ color: "white" }}>{note.content}</p>
      <div className="button-group">
        <div className="delete">
          <button onClick={() => deleteNote(note.id)}>Delete</button>
        </div>
        <div className="update">
          <button onClick={() => updateNote(note.id)}>Update</button>
        </div>
      </div>
    </div>
  );
}

export default Note;
