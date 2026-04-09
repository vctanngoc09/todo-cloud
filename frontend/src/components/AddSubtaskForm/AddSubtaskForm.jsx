import { useState } from "react";
import styles from "./AddSubtaskForm.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

function AddSubtaskForm({ onAdd, onClose }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd(title.trim());
    setTitle(""); // Clear input sau khi thêm
  };

  return (
    <form className={styles.inlineForm} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <FontAwesomeIcon icon={faPlus} className={styles.icon} />
        <input
          type="text"
          placeholder="Tên subtask..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
      </div>
      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.addBtn}
          disabled={!title.trim()}
        >
          Thêm
        </button>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </form>
  );
}

export default AddSubtaskForm;