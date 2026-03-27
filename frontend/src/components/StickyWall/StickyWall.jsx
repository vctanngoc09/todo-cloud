import { useState } from "react";
import styles from "./StickyWall.module.css";
import FormTask from "../FormTask/FormTask";

function StickyWall() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // 👉 Save note (add + update)
  const handleSave = (newNote) => {
    const exists = notes.find((n) => n.id === newNote.id);

    if (exists) {
      setNotes(notes.map((n) => (n.id === newNote.id ? newNote : n)));
    } else {
      setNotes([...notes, newNote]);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* LEFT */}
      <div className={styles.left}>
        <div className={styles.header}>
          <h1>Sticky Wall</h1>
          <span>{notes.length}</span>
        </div>

        {/* ADD NOTE */}
        <button
          className={styles.addBtn}
          onClick={() => {
            setSelectedNote(null);
            setShowForm(true);
          }}
        >
          + Add Note
        </button>

        {/* LIST NOTES */}
        <div className={styles.grid}>
          {notes.length === 0 && <p>Chưa có ghi chú</p>}

          {notes.map((note) => (
            <div
              key={note.id}
              className={styles.card}
              onClick={() => {
                setSelectedNote(note);
                setShowForm(true);
              }}
            >
              <h3>{note.title || "No title"}</h3>
              <p>{note.description || "No content"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT (FORM) */}
      <div className={styles.right}>
        {showForm && (
          <FormTask
            task={selectedNote}
            onClose={() => setShowForm(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}

export default StickyWall;
