import { useEffect, useState, useRef } from "react";
import styles from "./Upcoming.module.css";

import {
  getTodayTasks,
  getTasksByDate,
  getWeekTasks,
} from "../../api/task.jsx";

import { getAllListsActive } from "../../api/list.jsx";

const formatDate = (date) => date.toISOString().split("T")[0];

export default function Upcoming() {
  const [todayTasks, setTodayTasks] = useState([]);
  const [tomorrowTasks, setTomorrowTasks] = useState([]);
  const [weekTasks, setWeekTasks] = useState([]);

  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);

  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const [todayRes, tomorrowRes, weekRes, listRes] = await Promise.all([
          getTodayTasks(),
          getTasksByDate(formatDate(tomorrow)),
          getWeekTasks(formatDate(today)),
          getAllListsActive(),
        ]);

        setTodayTasks(todayRes);
        setTomorrowTasks(tomorrowRes);
        setWeekTasks(weekRes);
        setLists(listRes);

        setSelectedList(null); // mặc định tất cả
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FILTER
  const filterTasks = (tasks) => {
    if (!selectedList) return tasks;
    return tasks.filter((t) => t.listId === selectedList.id);
  };

  const renderTask = (task) => (
    <div key={task.id} className={styles.taskItem}>
      <div className={styles.left}>
        <input type="checkbox" />
        <span>{task.title}</span>
      </div>

      <div className={styles.right}>
        {task.subtaskCount > 0 && (
          <span className={styles.subtask}>{task.subtaskCount} việc con</span>
        )}

        {task.nameList && (
          <span className={styles.tag} style={{ background: task.listColor }}>
            {task.nameList}
          </span>
        )}

        <span className={styles.arrow}>›</span>
      </div>
    </div>
  );

  const renderList = (tasks) => {
    const filtered = filterTasks(tasks);
    if (!filtered.length) return <p className={styles.empty}>Không có task</p>;
    return filtered.map(renderTask);
  };

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.dropdownWrapper} ref={dropdownRef}>
          <div
            className={styles.dropdownHeader}
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            {selectedList ? (
              <>
                <span
                  className={styles.colorDot}
                  style={{ background: selectedList.color }}
                />
                {selectedList.nameList}
              </>
            ) : (
              "Tất cả danh sách"
            )}
          </div>

          {openDropdown && (
            <div className={styles.dropdownMenu}>
              <div
                className={styles.dropdownItem}
                onClick={() => {
                  setSelectedList(null);
                  setOpenDropdown(false);
                }}
              >
                Tất cả danh sách
              </div>

              {lists.map((list) => (
                <div
                  key={list.id}
                  className={styles.dropdownItem}
                  onClick={() => {
                    setSelectedList(list);
                    setOpenDropdown(false);
                  }}
                >
                  <span
                    className={styles.colorDot}
                    style={{ background: list.color }}
                  />
                  {list.nameList}
                </div>
              ))}
            </div>
          )}
        </div>

        <span className={styles.count}>
          {filterTasks(todayTasks).length +
            filterTasks(tomorrowTasks).length +
            filterTasks(weekTasks).length}
        </span>
      </div>

      {/* TODAY */}
      <div className={styles.section}>
        <h2>Hôm nay</h2>
        <div className={styles.card}>
          <div className={styles.addTask}>+ Thêm công việc</div>
          {renderList(todayTasks)}
        </div>
      </div>

      {/* GRID */}
      <div className={styles.grid}>
        <div className={styles.section}>
          <h2>Ngày mai</h2>
          <div className={styles.card}>
            {/* <div className={styles.addTask}>+ Thêm công việc</div> */}
            {renderList(tomorrowTasks)}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Tuần này</h2>
          <div className={styles.card}>
            {/* <div className={styles.addTask}>+ Thêm công việc</div> */}
            {renderList(weekTasks)}
          </div>
        </div>
      </div>
    </div>
  );
}
