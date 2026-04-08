import { useState } from "react";
import styles from "./AddListForm.module.css";

const COLORS = [
  "#ff6b6b",
  "#63e6be",
  "#ffd43b",
  "#4dabf7",
  "#be4bdb",
  "#fab005",
];

function AddListForm({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ nameList: name, color: selectedColor });
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <form className={styles.formCard} onSubmit={handleSubmit}>
        <h3>Tạo danh sách mới</h3>
        <input
          type="text"
          placeholder="Tên danh sách..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div className={styles.colorPicker}>
          {COLORS.map((color) => (
            <div
              key={color}
              className={`${styles.colorCircle} ${selectedColor === color ? styles.activeColor : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={onClose}>
            Hủy
          </button>
          <button type="submit" className={styles.submitBtn}>
            Thêm
          </button>
        </div>
      </form>
    </div>
  );
}
export default AddListForm;
