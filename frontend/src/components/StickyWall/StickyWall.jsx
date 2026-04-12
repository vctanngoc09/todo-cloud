import { useEffect, useState } from "react";
import styles from "./StickyWall.module.css";

import {
  getMyStickyNotes,
  createStickyNote,
  updateStickyNote,
  deleteStickyNote,
} from "../../api/stickynote"; // chỉnh lại path nếu khác

function StickyWall() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [color, setColor] = useState("#fff200");

  const [editId, setEditId] = useState(null);

  // GET LIST
  const fetchNotes = async () => {
    try {
      setLoading(true);

      const res = await getMyStickyNotes();
      setNotes(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Load notes error:", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setTitle("");
    setText("");
    setColor("#fff200");
    setEditId(null);
  };

  // CREATE / UPDATE
  const handleSave = async () => {
    const payload = { title, text, color };

    try {
      if (editId) {
        await updateStickyNote(editId, payload);
      } else {
        await createStickyNote(payload);
      }

      resetForm();
      fetchNotes();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // EDIT
  const handleEdit = (note) => {
    setEditId(note.id);
    setTitle(note.title || "");
    setText(note.text || "");
    setColor(note.color || "#fff200");
  };

  // DELETE (CONFIRM ADDED)
  const handleDelete = async (id) => {
    const isConfirm = window.confirm("Bạn có muốn xóa ghi chú này không?");

    if (!isConfirm) return;

    try {
      await deleteStickyNote(id);
      fetchNotes();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* FORM */}
      <div className={styles.form}>
        <input
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          value={text}
          placeholder="Write something..."
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <button onClick={handleSave}>
          {editId ? "Update Note" : "New Note"}
        </button>

        {editId && <button onClick={resetForm}>Cancel</button>}
      </div>

      {/* LIST */}
      <div className={styles.listSection}>
        <h2>My Notes</h2>

        {loading && <p>Loading...</p>}

        {!loading && notes.length === 0 && <p>Chưa có ghi chú nào 👀</p>}

        <div className={styles.grid}>
          {notes.map((note) => (
            <div
              key={note.id}
              className={styles.card}
              style={{ backgroundColor: note.color || "#fff" }}
            >
              <h3>{note.title || "No title"}</h3>
              <p>{note.text || ""}</p>

              <div className={styles.actions}>
                <button onClick={() => handleEdit(note)}>Edit</button>
                <button onClick={() => handleDelete(note.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StickyWall;
