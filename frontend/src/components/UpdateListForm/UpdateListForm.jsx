import { useState, useEffect } from "react";
import styles from "./UpdateListForm.module.css";
import { TAG_COLORS } from "../../constants/tagColors";

function UpdateListForm({ list, onClose, onUpdate }) {
  const [form, setForm] = useState({
    nameList: "",
    color: "",
    active: true,
  });

  useEffect(() => {
    if (list) {
      setForm({
        nameList: list.nameList || "",
        color: list.color || TAG_COLORS[0],
        active: list.active ?? true,
      });
    }
  }, [list]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      ...list, // Giữ lại ID và các thuộc tính cũ
      ...form, // Ghi đè dữ liệu mới từ form
    });
  };

  if (!list) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Cập nhật danh sách</h2>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <div className={styles.field}>
            <label>Tên danh sách</label>
            <input
              type="text"
              name="nameList"
              value={form.nameList}
              onChange={handleChange}
              required
            />
          </div>

          {/* COLOR PALETTE */}
          <div className={styles.field}>
            <label>Màu sắc</label>
            <div className={styles.colorList}>
              {TAG_COLORS.map((color) => (
                <div
                  key={color}
                  className={`${styles.colorItem} ${
                    form.color === color ? styles.activeColor : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      color,
                    }))
                  }
                />
              ))}
            </div>
          </div>

          {/* ACTIVE (Đây chính là tính năng Ẩn/Hiện bạn muốn) */}
          <div className={styles.fieldRow}>
            <label className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              <span className={styles.checkmark}></span>
              Hiển thị danh sách này
            </label>
          </div>

          {/* ACTIONS */}
          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Hủy
            </button>
            <button type="submit" className={styles.updateBtn}>
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateListForm;
