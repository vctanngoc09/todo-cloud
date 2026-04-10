import { useState } from "react";
import styles from "./AddTagForm.module.css";
import { TAG_COLORS } from "../../constants/tagColors";


function AddTagForm({ onClose, onAdd }) {
  const [tagName, setTagName] = useState("");
  const [color, setColor] = useState(TAG_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tagName.trim()) {
      alert("Vui lòng nhập tên nhãn!");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        nameTag: tagName.trim(),
        color,
        active: true,
      });

      onClose();
    } catch (error) {
      console.error("Lỗi khi thêm tag:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Thêm nhãn mới</h2>

        {/* NAME */}
        <div className={styles.field}>
          <label>Tên nhãn</label>
          <input
            type="text"
            placeholder="Nhập tên nhãn..."
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        {/* PREVIEW */}
        <div className={styles.preview}>
          <span
            className={styles.previewTag}
            style={{ backgroundColor: color }}
          >
            {tagName || "Tên nhãn"}
          </span>
        </div>

        {/* COLOR PALETTE */}
        <div className={styles.field}>
          <label>Màu sắc</label>

          <div className={styles.colorList}>
            {TAG_COLORS.map((c) => (
              <div
                key={c}
                className={`${styles.colorItem} ${
                  color === c ? styles.activeColor : ""
                }`}
                style={{ backgroundColor: c }}
                onClick={() => !isSubmitting && setColor(c)}
              />
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang tạo..." : "Tạo nhãn"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTagForm;