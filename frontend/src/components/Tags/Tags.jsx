import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTag, faCircle } from "@fortawesome/free-solid-svg-icons";

import styles from "./Tags.module.css";

import AddTagForm from "../AddTagForm/AddTagForm";
import UpdateTagForm from "../UpdateTagForm/UpdateTagForm";

import { useTags } from "../../contexts/TagsContext.jsx";

function Tags() {
  const { tags, loading, addTag, updateTagById } = useTags();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  // ADD TAG
  const handleAddTag = async (data) => {
    try {
      await addTag(data);
      setShowAddForm(false);
    } catch (err) {
      alert("Không thể tạo nhãn!");
    }
  };

  // UPDATE TAG
  const handleUpdateTag = async (data) => {
    try {
      await updateTagById(data);
      setShowUpdateForm(false);
      setSelectedTag(null);
    } catch (err) {
      alert("Không thể cập nhật nhãn!");
    }
  };

  const openUpdateForm = (tag) => {
    setSelectedTag(tag);
    setShowUpdateForm(true);
  };

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1>Quản lý Nhãn</h1>
          <span className={styles.badge}>{tags.length} nhãn</span>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => setShowAddForm(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Thêm nhãn mới
        </button>
      </header>

      {/* CONTENT */}
      {loading ? (
        <div className={styles.message}>Đang tải dữ liệu...</div>
      ) : tags.length === 0 ? (
        <div className={styles.emptyState}>
          <FontAwesomeIcon icon={faTag} className={styles.emptyIcon} />
          <p>Bạn chưa có nhãn nào. Hãy thêm nhãn để phân loại công việc!</p>
        </div>
      ) : (
        <div className={styles.tagGrid}>
          {tags.map((tag) => (
            <div
              key={tag.id || tag._id}
              className={styles.tagCard}
              onClick={() => openUpdateForm(tag)}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.tagInfo}>
                <div
                  className={styles.colorIndicator}
                  style={{ backgroundColor: tag.color }}
                />
                <span className={styles.tagName}>{tag.nameTag}</span>
              </div>

              <div className={styles.statusGroup}>
                <span
                  className={`${styles.statusBadge} ${
                    tag.active ? styles.active : styles.inactive
                  }`}
                >
                  <FontAwesomeIcon icon={faCircle} className={styles.dot} />
                  {tag.active ? "Đang hoạt động" : "Đã ẩn"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD MODAL */}
      {showAddForm && (
        <AddTagForm
          onClose={() => setShowAddForm(false)}
          onAdd={handleAddTag}
        />
      )}

      {/* UPDATE MODAL */}
      {showUpdateForm && (
        <UpdateTagForm
          tag={selectedTag}
          onClose={() => {
            setShowUpdateForm(false);
            setSelectedTag(null);
          }}
          onUpdate={handleUpdateTag}
        />
      )}
    </div>
  );
}

export default Tags;