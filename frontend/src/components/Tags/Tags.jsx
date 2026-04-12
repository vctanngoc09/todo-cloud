import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTag,
  faCircle,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./Tags.module.css";

import AddTagForm from "../AddTagForm/AddTagForm";
import UpdateTagForm from "../UpdateTagForm/UpdateTagForm";

import { useTags } from "../../contexts/TagsContext.jsx";

function Tags() {
  const { tags, loading, addTag, updateTagById } = useTags();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  // ===== FILTER STATE =====
  const [filter, setFilter] = useState("all"); // all | active | inactive
  const [search, setSearch] = useState("");

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

  // ===== FILTER LOGIC =====
  const filteredTags = tags
    .filter((tag) => {
      if (filter === "active") return tag.active;
      if (filter === "inactive") return !tag.active;
      return true;
    })
    .filter((tag) => tag.nameTag.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1>Quản lý Nhãn</h1>
          <span className={styles.badge}>{filteredTags.length} nhãn</span>
        </div>

        <button className={styles.addBtn} onClick={() => setShowAddForm(true)}>
          <FontAwesomeIcon icon={faPlus} /> Thêm nhãn mới
        </button>
      </header>

      {/* FILTER BAR */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {/* SEARCH */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="Tìm nhãn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "6px 10px",
              border: "1px solid #ddd",
              borderRadius: 6,
            }}
          />
        </div>

        {/* FILTER BUTTONS */}
        <button
          className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
          onClick={() => setFilter("all")}
        >
          Tất cả
        </button>

        <button
          className={`${styles.filterBtn} ${filter === "active" ? styles.active : ""}`}
          onClick={() => setFilter("active")}
        >
          Đang hoạt động
        </button>

        <button
          className={`${styles.filterBtn} ${filter === "inactive" ? styles.active : ""}`}
          onClick={() => setFilter("inactive")}
        >
          Đã ẩn
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className={styles.message}>Đang tải dữ liệu...</div>
      ) : filteredTags.length === 0 ? (
        <div className={styles.emptyState}>
          <FontAwesomeIcon icon={faTag} className={styles.emptyIcon} />
          <p>Không tìm thấy nhãn nào.</p>
        </div>
      ) : (
        <div className={styles.tagGrid}>
          {filteredTags.map((tag) => (
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