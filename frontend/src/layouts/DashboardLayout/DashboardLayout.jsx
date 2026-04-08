import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMagnifyingGlass,
  faPlus,
  faGear,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./DashboardLayout.module.css";
import { useEffect, useState } from "react";

import { IDTASKS, TASKS } from "../../constants/task";
import Upcoming from "../../components/Upcoming/Upcoming";
import Today from "../../components/Today/Today";
import Calendar from "../../components/Calendar/Calendar";
import StickyWall from "../../components/StickyWall/StickyWall";
import AddListForm from "../../components/AddListForm/AddListForm";
import AddTagForm from "../../components/AddTagForm/AddTagForm";

import { AuthService } from "../../services/auth.service";
import { getTagsByUserId, createTag } from "../../api/tag";
import { getAllLists,createList } from "../../api/list";

function DashboardLayout() {
  const [active, setActive] = useState(IDTASKS.Today);
  const [isOpen, setIsOpen] = useState(true);

  const [showListForm, setShowListForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);

  const [tags, setTags] = useState([]);

  const user = AuthService.getUser();
  const userId = user?.id;
  const [lists, setLists] = useState([]);

  const COMPONENTS = {
    [IDTASKS.Upcoming]: <Upcoming />,
    [IDTASKS.Today]: <Today />,
    [IDTASKS.Calendar]: <Calendar />,
    [IDTASKS.StickyWall]: <StickyWall />,
  };

  useEffect(() => {
    if (!userId) return;

    const fetchTags = async () => {
      try {
        const res = await getTagsByUserId(userId);
        setTags(res);
      } catch (error) {
        console.error("Lỗi lấy tags:", error);
      }
    };

    fetchTags();
  }, [userId]);

  const handleAddTag = async (data) => {
    try {
      const newTag = await createTag({
        ...data,
        userId: userId,
      });

      // cập nhật UI ngay
      setTags((prev) => [...prev, newTag]);
    } catch (error) {
      console.error("Lỗi tạo tag:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await getAllLists();
        setLists(res); // axiosInstance đã trả về res.data rồi
      } catch (error) {
        console.error("Lỗi lấy danh sách list:", error);
      }
    };
    fetchLists();
  }, []);

  // 3. Hàm xử lý thêm List mới
  const handleAddList = async (data) => {
    try {
      const newList = await createList(data);
      setLists((prev) => [...prev, newList]); // Cập nhật UI ngay lập tức
      setShowListForm(false);
    } catch (error) {
      alert("Lỗi khi tạo danh sách!");
      console.error(error);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* SIDEBAR */}
      <aside className={`${styles.sidebar} ${!isOpen ? styles.hide : ""}`}>
        {/* HEADER */}
        <div className={styles.header}>
          <p className={styles.menuText}>Menu</p>
          <div className={styles.iconMenu} onClick={() => setIsOpen(!isOpen)}>
            <FontAwesomeIcon icon={faBars} />
          </div>
        </div>

        {/* SEARCH */}
        <div className={styles.search}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className={styles.searchIcon}
          />
          <input type="text" placeholder="Search" />
        </div>

        {/* TASKS */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Tasks</p>
          <ul className={styles.list}>
            {TASKS.map((obj) => (
              <li
                key={obj.id}
                className={`${styles.listItem} ${
                  obj.id === active ? styles.active : ""
                }`}
                onClick={() => setActive(obj.id)}
              >
                <div className={styles.left}>
                  <span className={styles.iconWrapper}>{obj.icon}</span>
                  {obj.title}
                </div>
                <div className={styles.count}>5</div>
              </li>
            ))}
          </ul>
        </div>

        {/* LISTS */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Lists</p>
          <ul className={styles.list}>
            {/* 4. Render danh sách từ API */}
            {lists.map((list) => (
              <li key={list.id} className={styles.listItem}>
                <div className={styles.left}>
                  <span
                    className={styles.colorBox}
                    style={{ backgroundColor: list.color }}
                  ></span>
                  {list.nameList}
                </div>
                {/* Tạm thời để count là 0 hoặc tính toán sau */}
                <div className={styles.count}>{list.tasks?.length || 0}</div>
              </li>
            ))}

            <li
              className={styles.addItem}
              onClick={() => setShowListForm(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add New List</span>
            </li>
          </ul>
        </div>

        {/* TAGS */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Tags</p>
          <div className={styles.tagContainer}>
            {tags.map((tag) => (
              <span
                key={tag.id}
                className={styles.tagItem}
                style={{ backgroundColor: tag.color }}
              >
                {tag.nameTag}
              </span>
            ))}

            <span
              className={styles.addTagBtn}
              onClick={() => setShowTagForm(true)}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Tag
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.sidebarFooter}>
          <div className={styles.footerItem}>
            <FontAwesomeIcon icon={faGear} /> Settings
          </div>
          <div className={styles.footerItem}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Sign out
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>{COMPONENTS[active] || <Today />}</main>

      {/* MODALS */}
      {showListForm && (
        <AddListForm
          onClose={() => setShowListForm(false)}
          onAdd={handleAddList}
        />
      )}

      {showTagForm && (
        <AddTagForm
          onClose={() => setShowTagForm(false)}
          onAdd={handleAddTag}
        />
      )}
    </div>
  );
}

export default DashboardLayout;
