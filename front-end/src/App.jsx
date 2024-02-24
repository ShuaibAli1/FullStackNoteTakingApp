// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./component/Modal";
import NoteForm from "./component/NoteForm";
import NoteList from "./component/NoteList";
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
      setNotes([]);
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
      <NoteForm
        newNote={newNote}
        setNewNote={setNewNote}
        addNote={addNote}
        saveUpdatedNote={saveUpdatedNote}
        updatingNoteId={updatingNoteId}
      />
      <NoteList notes={notes} deleteNote={deleteNote} updateNote={updateNote} />
      <Modal
        isOpen={showModal}
        onCancel={cancelDeleteNote}
        onConfirm={confirmDeleteNote}
      />
    </div>
  );
}

export default App;
