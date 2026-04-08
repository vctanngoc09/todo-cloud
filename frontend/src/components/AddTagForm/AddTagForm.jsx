import { useState } from "react";
import styles from "./AddTagForm.module.css";

const TAG_COLORS = [
  "#FF6B6B",
  "#F06595",

  "#339AF0",
  "#22B8CF",
  "#20C997",
  "#FCC419",
  "#FF922B",
];

function AddTagForm({ onClose, onAdd }) {
  const [tagName, setTagName] = useState("");
  const [color, setColor] = useState(TAG_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái chờ API

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate cơ bản
    if (!tagName.trim()) {
      alert("Vui lòng nhập tên nhãn!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Gọi hàm onAdd (hàm này là handleAddTag ở DashboardLayout)
      await onAdd({ nameTag: tagName.trim(), color: color });

      // Nếu thành công, DashboardLayout sẽ tự động fetch lại hoặc cập nhật list
      onClose();
    } catch (error) {
      console.error("Lỗi khi thêm tag:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* onClick={onClose} ở overlay để đóng khi click ra ngoài, 
          nhưng phải có e.stopPropagation() ở formCard */}
      <form
        className={styles.formCard}
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Thêm nhãn mới</h3>

        <input
          type="text"
          placeholder="Tên nhãn..."
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          disabled={isSubmitting}
          autoFocus
        />

        <div className={styles.tagPreview}>
          <p>Xem trước:</p>
          <span style={{ backgroundColor: color, color: "white" }}>
            {tagName || "Tên nhãn"}
          </span>
        </div>

        <div className={styles.colorPicker}>
          {TAG_COLORS.map((c) => (
            <div
              key={c}
              className={`${styles.colorCircle} ${color === c ? styles.activeColor : ""}`}
              style={{ backgroundColor: c }}
              onClick={() => !isSubmitting && setColor(c)}
            />
          ))}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelBtn}
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang tạo..." : "Tạo Tag"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTagForm;
