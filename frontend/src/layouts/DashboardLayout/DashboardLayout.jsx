import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMagnifyingGlass,
  faPlus,
  faSignOutAlt,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./DashboardLayout.module.css";

import { IDTASKS, TASKS } from "../../constants/task";

import Upcoming from "../../components/Upcoming/Upcoming";
import Today from "../../components/Today/Today";
import Calendar from "../../components/Calendar/Calendar";
import StickyWall from "../../components/StickyWall/StickyWall";
import AddListForm from "../../components/AddListForm/AddListForm";
import AddTagForm from "../../components/AddTagForm/AddTagForm";
import Tags from "../../components/Tags/Tags";
import Lists from "../../components/Lists/Lists";

import { AuthService } from "../../services/auth.service";

import { useLists } from "../../contexts/ListsContext.jsx";
import { useTags } from "../../contexts/TagsContext.jsx";

function DashboardLayout() {
  const [active, setActive] = useState(IDTASKS.Today);
  const [isOpen, setIsOpen] = useState(true);

  const [showListForm, setShowListForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);

  const [showAllLists, setShowAllLists] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  const { tags, addTag } = useTags();
  const { lists, addList } = useLists();

  const user = AuthService.getUser();

  const COMPONENTS = {
    [IDTASKS.Upcoming]: <Upcoming />,
    [IDTASKS.Today]: <Today />,
    [IDTASKS.Calendar]: <Calendar />,
    [IDTASKS.StickyWall]: <StickyWall />,
    [IDTASKS.Tags]: <Tags />,
    [IDTASKS.List]: <Lists />,
  };

  const LISTS_LIMIT = 3;
  const TAGS_LIMIT = 5;

  // =========================
  // CHỈ LẤY TAG ACTIVE
  // =========================
  const activeLists = lists.filter((list) => list.active);
  const activeTags = tags.filter((tag) => tag.active);

  const visibleLists = showAllLists
    ? activeLists
    : activeLists.slice(0, LISTS_LIMIT);
  const visibleTags = showAllTags
    ? activeTags
    : activeTags.slice(0, TAGS_LIMIT);

  const hiddenTagsCount = Math.max(0, activeTags.length - TAGS_LIMIT);

  // ADD TAG
  const handleAddTag = async (data) => {
    try {
      await addTag(data);
      setShowTagForm(false);
    } catch (error) {
      alert("Lỗi khi tạo nhãn!");
    }
  };

  // ADD LIST
  const handleAddList = async (data) => {
    try {
      await addList(data); // Context sẽ tự lo việc gọi API và cập nhật state lists toàn cục
      setShowListForm(false);
    } catch (error) {
      alert("Lỗi khi tạo danh sách!");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      AuthService.logout();
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
                  {obj.icon} {obj.title}
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
                  />
                  {list.nameList}
                </div>
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
                key={tag.id || tag._id}
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

            {showAllTags && activeTags.length > TAGS_LIMIT && (
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
          <div
            className={styles.footerItem}
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
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
