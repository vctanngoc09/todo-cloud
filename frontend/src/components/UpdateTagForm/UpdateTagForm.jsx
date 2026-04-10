import { useState, useEffect } from "react";
import styles from "./UpdateTagForm.module.css";
import { TAG_COLORS } from "../../constants/tagColors";

function UpdateTagForm({ tag, onClose, onUpdate }) {
  const [form, setForm] = useState({
    nameTag: "",
    color: "",
    active: true,
  });

  useEffect(() => {
    if (tag) {
      setForm({
        nameTag: tag.nameTag || "",
        color: tag.color || TAG_COLORS[0],
        active: tag.active ?? true,
      });
    }
  }, [tag]);

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
      ...tag,
      ...form,
    });
  };

  if (!tag) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Cập nhật nhãn</h2>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <div className={styles.field}>
            <label>Tên nhãn</label>
            <input
              type="text"
              name="nameTag"
              value={form.nameTag}
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

          {/* ACTIVE */}
          <div className={styles.fieldRow}>
            <label className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              <span className={styles.checkmark}></span>
              Đang hoạt động
            </label>
          </div>

          {/* ACTIONS */}
          <div className={styles.actions}>
            <button type="button" onClick={onClose}>
              Hủy
            </button>
            <button type="submit">Cập nhật</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateTagForm;
