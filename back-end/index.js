const express = require("express");
const sqlite3 = require("sqlite3").verbose();
var cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Add this line to parse URL-encoded request bodies

const db = new sqlite3.Database(":memory:");

// Create notes table if it does not exist
db.run(
  "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, color TEXT)",
  function (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
      return;
    }
  }
);

// API routes
// Get all notes
app.get("/api/notes", (req, res) => {
  db.all("SELECT * FROM notes", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
      return;
    }
    res.json(rows);
  });
});

// Get note by ID
app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM notes WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
      return;
    }
    if (!row) {
      res.status(404).send("Note not found");
      return;
    }
    res.json(row);
  });
});

// Add a note
app.post("/api/notes", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).send("Title and content are required");
    return;
  }

  const color = getRandomColor();
  db.run(
    "INSERT INTO notes (title, content, color) VALUES (?, ?, ?)",
    [title, content, color],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).send("Server Error");
        return;
      }
      res.json({
        id: this.lastID,
        title,
        content,
        color,
      });
    }
  );
});

// Update a note
app.put("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const { title, content, color } = req.body;
  if (!title || !content || !color) {
    res.status(400).send("Title, content, and color are required");
    return;
  }

  db.run(
    "UPDATE notes SET title = ?, content = ?, color = ? WHERE id = ?",
    [title, content, color, id],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).send("Server Error");
        return;
      }
      if (this.changes === 0) {
        res.status(404).send("Note not found");
        return;
      }
      res.json({ id, title, content, color });
    }
  );
});

// Delete a note
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM notes WHERE id = ?", [id], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
      return;
    }
    if (this.changes === 0) {
      res.status(404).send("Note not found");
      return;
    }
    res.json({ message: "Note deleted successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Function to generate random background color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
