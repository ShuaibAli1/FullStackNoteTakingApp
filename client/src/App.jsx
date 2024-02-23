import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./component/Modal";
import "./index.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", content: "", color: "" });
  const [updatingNoteId, setUpdatingNoteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/notes");
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]); // Set notes to an empty array in case of error
    }
  };

  const addNote = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/notes",
        newNote
      );
      setNotes([...notes, { ...response.data }]);
      setNewNote({ title: "", content: "", color: "" });
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      setDeleteNoteId(id);
      setShowModal(true);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const confirmDeleteNote = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/notes/${deleteNoteId}`);
      setNotes(notes.filter((note) => note.id !== deleteNoteId));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const cancelDeleteNote = () => {
    setShowModal(false);
    setDeleteNoteId(null);
  };

  const updateNote = async (id) => {
    try {
      const noteToUpdate = notes.find((note) => note.id === id);
      setNewNote({
        title: noteToUpdate.title,
        content: noteToUpdate.content,
        color: noteToUpdate.color,
      });
      setUpdatingNoteId(id);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const saveUpdatedNote = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/notes/${updatingNoteId}`,
        { title: newNote.title, content: newNote.content, color: newNote.color }
      );

      const updatedNotes = notes.map((note) =>
        note.id === updatingNoteId ? { ...response.data } : note
      );
      setNotes(updatedNotes);

      setNewNote({ title: "", content: "", color: "" });
      setUpdatingNoteId(null);
    } catch (error) {
      console.error("Error saving updated note:", error);
    }
  };

  return (
    <div className="App">
      <h1>Notes</h1>
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
      <div className="note-list">
        {notes.map((note) => (
          <div
            key={note.id}
            className="note"
            style={{ backgroundColor: note.color }}
          >
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
        ))}
      </div>
      <Modal
        isOpen={showModal}
        onCancel={cancelDeleteNote}
        onConfirm={confirmDeleteNote}
      />
    </div>
  );
}

export default App;
