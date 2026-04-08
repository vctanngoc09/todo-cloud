import { useState } from "react";
import styles from "./AddTagForm.module.css";

const TAG_COLORS = ["#d1fadf", "#fee4e2", "#fef0c7", "#d1e9ff", "#f9f5ff"];

function AddTagForm({ onClose, onAdd }) {
  const [tagName, setTagName] = useState("");
  const [color, setColor] = useState(TAG_COLORS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tagName.trim()) return;
    onAdd({ nameTag: tagName, color: color });
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <form className={styles.formCard} onSubmit={handleSubmit}>
        <h3>Thêm nhãn mới</h3>
        <input
          type="text"
          placeholder="Tên nhãn..."
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
        />
        <div className={styles.tagPreview}>
          <span style={{ backgroundColor: color }}>
            {tagName || "Xem trước"}
          </span>
        </div>
        <div className={styles.colorPicker}>
          {TAG_COLORS.map((c) => (
            <div
              key={c}
              className={`${styles.colorCircle} ${color === c ? styles.activeColor : ""}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={onClose}>
            Hủy
          </button>
          <button type="submit" className={styles.submitBtn}>
            Tạo Tag
          </button>
        </div>
      </form>
    </div>
  );
}
export default AddTagForm;
