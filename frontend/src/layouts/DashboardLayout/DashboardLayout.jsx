import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMagnifyingGlass,
  faPlus,
  faGear,
  faSignOutAlt,
  faChevronDown,
  faChevronUp,
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
import { getAllLists, createList } from "../../api/list";

function DashboardLayout() {
  const [active, setActive] = useState(IDTASKS.Today);
  const [isOpen, setIsOpen] = useState(true);

  const [showListForm, setShowListForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);

  const [tags, setTags] = useState([]);
  const [lists, setLists] = useState([]);

  const [showAllLists, setShowAllLists] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  const user = AuthService.getUser();
  const userId = user?.id;

  const COMPONENTS = {
    [IDTASKS.Upcoming]: <Upcoming />,
    [IDTASKS.Today]: <Today />,
    [IDTASKS.Calendar]: <Calendar />,
    [IDTASKS.StickyWall]: <StickyWall />,
  };

  const LISTS_LIMIT = 3;
  const TAGS_LIMIT = 5;

  const visibleLists = showAllLists ? lists : lists.slice(0, LISTS_LIMIT);
  const visibleTags = showAllTags ? tags : tags.slice(0, TAGS_LIMIT);
  const hiddenTagsCount = tags.length - TAGS_LIMIT;

  useEffect(() => {
    if (!userId) return;

    const fetchTags = async () => {
      try {
        const res = await getTagsByUserId(userId);
        setTags(res);
      } catch (error) {
        console.error("Lỗi lấy nhãn:", error);
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
      setTags((prev) => [...prev, newTag]);
    } catch (error) {
      console.error("Lỗi tạo nhãn:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await getAllLists();
        setLists(res);
      } catch (error) {
        console.error("Lỗi lấy danh sách:", error);
      }
    };
    fetchLists();
  }, []);

  const handleAddList = async (data) => {
    try {
      const newList = await createList(data);
      setLists((prev) => [...prev, newList]);
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
          <input type="text" placeholder="Tìm kiếm" />
        </div>

        {/* TASKS */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Công việc</p>
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
          <p className={styles.sectionTitle}>Danh sách</p>
          <ul className={styles.list}>
            {visibleLists.map((list) => (
              <li key={list.id} className={styles.listItem}>
                <div className={styles.left}>
                  <span
                    className={styles.colorBox}
                    style={{ backgroundColor: list.color }}
                  ></span>
                  {list.nameList}
                </div>
                <div className={styles.count}>{list.tasks?.length || 0}</div>
              </li>
            ))}

            {lists.length > LISTS_LIMIT && (
              <li
                className={styles.showMoreBtn}
                onClick={() => setShowAllLists(!showAllLists)}
              >
                <FontAwesomeIcon
                  icon={showAllLists ? faChevronUp : faChevronDown}
                />
                <span>
                  {showAllLists
                    ? "Thu gọn"
                    : `Xem thêm ${lists.length - LISTS_LIMIT}`}
                </span>
              </li>
            )}

            <li
              className={styles.addItem}
              onClick={() => setShowListForm(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Thêm danh sách</span>
            </li>
          </ul>
        </div>

        {/* TAGS */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Nhãn</p>
          <div className={styles.tagContainer}>
            {visibleTags.map((tag) => (
              <span
                key={tag.id}
                className={styles.tagItem}
                style={{ backgroundColor: tag.color }}
              >
                {tag.nameTag}
              </span>
            ))}

            {!showAllTags && hiddenTagsCount > 0 && (
              <span
                className={styles.moreTagsBtn}
                onClick={() => setShowAllTags(true)}
              >
                +{hiddenTagsCount} nhãn
              </span>
            )}

            {showAllTags && tags.length > TAGS_LIMIT && (
              <span
                className={styles.showLessTagsBtn}
                onClick={() => setShowAllTags(false)}
              >
                Thu gọn
              </span>
            )}

            <span
              className={styles.addTagBtn}
              onClick={() => setShowTagForm(true)}
            >
              <FontAwesomeIcon icon={faPlus} /> Thêm nhãn
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.sidebarFooter}>
          <div className={styles.footerItem}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
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
