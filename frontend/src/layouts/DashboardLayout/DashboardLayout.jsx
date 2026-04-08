import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMagnifyingGlass,
  faPlus,
  faChevronRight,
  faAngleDoubleRight,
  faCalendarDay,
  faCalendarAlt,
  faStickyNote,
  faGear,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./DashboardLayout.module.css";
import { useState } from "react";
import { IDTASKS, TASKS } from "../../constants/task"; // Giả định TASKS có icon & title
import Upcoming from "../../components/Upcoming/Upcoming";
import Today from "../../components/Today/Today";
import Calendar from "../../components/Calendar/Calendar";
import StickyWall from "../../components/StickyWall/StickyWall";
import AddListForm from "../../components/AddListForm/AddListForm";
import AddTagForm from "../../components/AddTagForm/AddTagForm";

// Dữ liệu giả lập khớp với Schema Database của bạn
const DUMMY_LISTS = [
  { id: 1, nameList: "Personal", color: "#ff6b6b", count: 3 },
  { id: 2, nameList: "Work", color: "#63e6be", count: 6 },
  { id: 3, nameList: "List 1", color: "#ffd43b", count: 3 },
];

const DUMMY_TAGS = [
  { id: 1, nameTag: "Tag 1", color: "#d1fadf" },
  { id: 2, nameTag: "Tag 2", color: "#fee4e2" },
];

function DashboardLayout() {
  const [active, setActive] = useState(IDTASKS.Today);
  const [isOpen, setIsOpen] = useState(true);

  const COMPONENTS = {
    [IDTASKS.Upcoming]: <Upcoming />,
    [IDTASKS.Today]: <Today />,
    [IDTASKS.Calendar]: <Calendar />,
    [IDTASKS.StickyWall]: <StickyWall />,
  };
  const [showListForm, setShowListForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  return (
    <div className={styles.wrapper}>
      {/* SIDEBAR */}
      <aside className={`${styles.sidebar} ${!isOpen ? styles.hide : ""}`}>
        <div className={styles.header}>
          <p className={styles.menuText}>Menu</p>
          <div className={styles.iconMenu} onClick={() => setIsOpen(!isOpen)}>
            <FontAwesomeIcon icon={faBars} />
          </div>
        </div>

        <div className={styles.search}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className={styles.searchIcon}
          />
          <input type="text" placeholder="Search" />
        </div>

        {/* SECTION: TASKS */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Tasks</p>
          <ul className={styles.list}>
            {TASKS.map((obj) => (
              <li
                key={obj.id}
                className={`${styles.listItem} ${obj.id === active ? styles.active : ""}`}
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

        {/* SECTION: LISTS */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Lists</p>
          <ul className={styles.list}>
            {DUMMY_LISTS.map((list) => (
              <li key={list.id} className={styles.listItem}>
                <div className={styles.left}>
                  <span
                    className={styles.colorBox}
                    style={{ backgroundColor: list.color }}
                  ></span>
                  {list.nameList}
                </div>
                <div className={styles.count}>{list.count}</div>
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

        {/* SECTION: TAGS */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Tags</p>
          <div className={styles.tagContainer}>
            {DUMMY_TAGS.map((tag) => (
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

        {/* BOTTOM NAV */}
        <div className={styles.sidebarFooter}>
          <div className={styles.footerItem}>
            <FontAwesomeIcon icon={faGear} /> Settings
          </div>
          <div className={styles.footerItem}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Sign out
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.main}>{COMPONENTS[active] || <Today />}</main>
      {showListForm && (
        <AddListForm
          onClose={() => setShowListForm(false)}
          onAdd={(data) => console.log(data)}
        />
      )}
      {showTagForm && (
        <AddTagForm
          onClose={() => setShowTagForm(false)}
          onAdd={(data) => console.log(data)}
        />
      )}
    </div>
  );
}

export default DashboardLayout;
