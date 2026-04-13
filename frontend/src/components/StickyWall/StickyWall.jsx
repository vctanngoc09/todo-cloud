import { useEffect, useState } from "react";
import styles from "./StickyWall.module.css";

import {
  getMyStickyNotes,
  createStickyNote,
  updateStickyNote,
  deleteStickyNote,
} from "../../api/stickynote";

const COLORS = [
  "#FDE68A", // vàng nhạt
  "#FCA5A5", // đỏ pastel
  "#FDBA74", // cam nhẹ
  "#86EFAC", // xanh lá dịu
  "#7DD3FC", // xanh da trời
  "#93C5FD", // xanh dương nhạt
  "#C4B5FD", // tím nhẹ
  "#F9A8D4", // hồng pastel
];

function StickyWall() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await getMyStickyNotes();
      setNotes(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const resetForm = () => {
    setTitle("");
    setText("");
    setColor(COLORS[0]);
    setEditId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!title.trim() && !text.trim()) {
      alert("Vui lòng nhập nội dung!");
      return;
    }

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
      console.error(err);
    }
  };

  const handleOpen = (note) => {
    if (note) {
      setEditId(note.id);
      setTitle(note.title || "");
      setText(note.text || "");
      setColor(note.color || COLORS[0]);
    } else {
      resetForm();
      setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
      setShowForm(true);
      return;
    }

    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!window.confirm("Xóa ghi chú này?")) return;

    try {
      await deleteStickyNote(editId);
      resetForm();
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {notes.map((note) => (
          <div
            key={note.id}
            className={styles.card}
            style={{ backgroundColor: note.color }}
            onClick={() => handleOpen(note)}
          >
            <h3>{note.title || "No title"}</h3>
            <p>{note.text}</p>
          </div>
        ))}

        {/* ADD */}
        <div className={styles.addCard} onClick={() => handleOpen(null)}>
          +
        </div>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className={styles.modal}>
          <div className={styles.form}>
            <div className={styles.close} onClick={resetForm}>
              ×
            </div>

            <h3>{editId ? "Cập nhật Note" : "Note mới"}</h3>

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

            {/* COLOR PICKER */}
            <div className={styles.colorPicker}>
              {COLORS.map((c) => (
                <div
                  key={c}
                  className={`${styles.colorCircle} ${
                    color === c ? styles.activeColor : ""
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>

            <div className={styles.formActions}>
              <button onClick={handleSave}>
                {editId ? "Cập nhật" : "Tạo"}
              </button>

              {editId && (
                <button className={styles.delete} onClick={handleDelete}>
                  Xóa
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StickyWall;
