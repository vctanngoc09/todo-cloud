import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "./DashboardLayout.module.css";
import { useState } from "react";
import { IDTASKS, TASKS } from "../../constants/task";
import Upcoming from "../../components/Upcoming/Upcoming";
import Today from "../../components/Today/Today";
import Calendar from "../../components/Calendar/Calendar";
import StickyWall from "../../components/StickyWall/StickyWall";

function DashboardLayout() {
  const [active, setActive] = useState(IDTASKS.Upcoming);
  const [isOpen, setIsOpen] = useState(true);
  const COMPONENTS = {
    [IDTASKS.Upcoming]: <Upcoming />,
    [IDTASKS.Today]: <Today />,
    [IDTASKS.Calendar]: <Calendar />,
    [IDTASKS.StickyWall]: <StickyWall />,
  };
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.sidebar} ${!isOpen ? styles.hide : ""}`}>
        <div className={styles.header}>
          <p>Menu</p>
          <div className={styles.iconMenu}>
            <FontAwesomeIcon icon={faBars} onClick={() => setIsOpen(!isOpen)} />
          </div>
        </div>
        <div className={styles.search}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input type="text" placeholder="Tìm kiếm..." />
        </div>
        <div className={styles.section}>
          <p className={styles.title}>Công việc</p>
          <ul>
            {TASKS.map((ojb) => (
              <li
                key={ojb.id}
                className={`${ojb.id === active ? styles.active : ""}`}
                onClick={() => setActive(ojb.id)}
              >
                <div className={styles.left}>
                  {ojb.icon}
                  {ojb.title}
                </div>
                <div className={styles.count}>2</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.main}>{COMPONENTS[active]}</div>
    </div>
  );
}
export default DashboardLayout;
