import React from "react";

function NoteForm({
  newNote,
  setNewNote,
  addNote,
  saveUpdatedNote,
  updatingNoteId,
}) {
  return (
    <div className="form">
      <input
        type="text"
        placeholder="Title"
        value={newNote.title}
        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Content"
        value={newNote.content}
        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
      ></textarea>
      {updatingNoteId ? (
        <button onClick={saveUpdatedNote}>Update Note</button>
      ) : (
        <button onClick={addNote}>Add Note</button>
      )}
    </div>
  );
}

export default NoteForm;
