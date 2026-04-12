import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faListUl,
  faCircle,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Lists.module.css";

import AddListForm from "../AddListForm/AddListForm";
import UpdateListForm from "../UpdateListForm/UpdateListForm";

// 1. Import hook từ Context
import { useLists } from "../../contexts/ListsContext.jsx";

function Lists() {
  // 2. Lấy dữ liệu và các hàm từ Context
  const { lists, loading, addList, updateListById } = useLists();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedList, setSelectedList] = useState(null);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const openUpdateForm = (list) => {
    setSelectedList(list);
    setShowUpdateForm(true);
  };

  // 3. Hàm xử lý Thêm (gọi API qua Context)
  const handleAddList = async (data) => {
    try {
      await addList(data);
      setShowAddForm(false);
    } catch (err) {
      alert("Lỗi khi tạo danh sách");
    }
  };

  // 4. Hàm xử lý Cập nhật (gọi API qua Context)
  const handleUpdateList = async (data) => {
    try {
      // Luôn gọi updateListById.
      // Bên trong Context, chúng ta sẽ xử lý việc gộp dữ liệu.
      await updateListById(data);

      setShowUpdateForm(false);
    } catch (err) {
      alert("Không thể cập nhật danh sách!");
    }
  };

  const filteredLists = lists
    .filter((item) => {
      if (filter === "active") return item.active;
      if (filter === "inactive") return !item.active;
      return true;
    })
    .filter((item) =>
      item.nameList.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1>Quản lý Danh sách</h1>
          <span className={styles.badge}>{filteredLists.length} danh sách</span>
        </div>
        <button className={styles.addBtn} onClick={() => setShowAddForm(true)}>
          <FontAwesomeIcon icon={faPlus} /> Thêm danh sách mới
        </button>
      </header>

      {/* FILTER BAR */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            placeholder="Tìm danh sách..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          className={`${styles.filterBtn} ${filter === "all" ? styles.activeBtn : ""}`}
          onClick={() => setFilter("all")}
        >
          Tất cả
        </button>
        <button
          className={`${styles.filterBtn} ${filter === "active" ? styles.activeBtn : ""}`}
          onClick={() => setFilter("active")}
        >
          Đang hoạt động
        </button>
        <button
          className={`${styles.filterBtn} ${filter === "inactive" ? styles.activeBtn : ""}`}
          onClick={() => setFilter("inactive")}
        >
          Đã ẩn
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className={styles.message}>Đang tải từ Server...</div>
      ) : (
        <div className={styles.listGrid}>
          {filteredLists.map((item) => (
            <div
              key={item.id}
              className={styles.listCard}
              onClick={() => openUpdateForm(item)}
            >
              <div className={styles.listInfo}>
                <div
                  className={styles.colorIndicator}
                  style={{ backgroundColor: item.color }}
                />
                <span className={styles.listName}>{item.nameList}</span>
              </div>
              <div className={styles.statusGroup}>
                <span
                  className={`${styles.statusBadge} ${item.active ? styles.active : styles.inactive}`}
                >
                  <FontAwesomeIcon icon={faCircle} className={styles.dot} />
                  {item.active ? "Đang dùng" : "Đã ẩn"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Gắn Form và truyền hàm xử lý */}
      {showAddForm && (
        <AddListForm
          onClose={() => setShowAddForm(false)}
          onAdd={handleAddList}
        />
      )}

      {showUpdateForm && (
        <UpdateListForm
          list={selectedList}
          onClose={() => setShowUpdateForm(false)}
          onUpdate={handleUpdateList}
        />
      )}
    </div>
  );
}

export default Lists;
