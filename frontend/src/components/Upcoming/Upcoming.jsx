import { useEffect, useState, useRef } from "react";
import styles from "./Upcoming.module.css";

import {
  getTodayTasks,
  getTasksByDate,
  getWeekTasks,
  toggleTaskCompleted,
  getTaskDetail,
} from "../../api/task.jsx";

import { getAllListsActive } from "../../api/list.jsx";
import FormTask from "../FormTask/FormTask";

const formatDate = (date) => date.toISOString().split("T")[0];

export default function Upcoming() {
  const [todayTasks, setTodayTasks] = useState([]);
  const [tomorrowTasks, setTomorrowTasks] = useState([]);
  const [weekTasks, setWeekTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef();

  const [showFormTask, setShowFormTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchAllTasks = async () => {
    try {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      const [todayRes, tomorrowRes, weekRes] = await Promise.all([
        getTodayTasks(),
        getTasksByDate(formatDate(tomorrow)),
        getWeekTasks(formatDate(today)),
      ]);

      setTodayTasks(todayRes.data || todayRes);
      setTomorrowTasks(tomorrowRes.data || tomorrowRes);
      setWeekTasks(weekRes.data || weekRes);
    } catch (err) {
      console.error("Lỗi fetch tasks:", err);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await fetchAllTasks();
        const listRes = await getAllListsActive();
        setLists(listRes.data || listRes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterTasks = (tasks) => {
    const data = Array.isArray(tasks) ? tasks : [];
    if (!selectedList) return data;
    return data.filter((t) => t.listId === selectedList.id);
  };

  const handleEditTask = async (task) => {
    try {
      const response = await getTaskDetail(task.id);
      setSelectedTask(response.data || response);
      setShowFormTask(true);
    } catch (err) {
      setSelectedTask(task);
      setShowFormTask(true);
    }
  };

  const renderTask = (task) => (
    <div
      key={task.id}
      className={styles.taskItem}
      onClick={() => handleEditTask(task)}
    >
      <div className={styles.left}>
        <input
          type="checkbox"
          checked={task.completed}
          onClick={(e) => e.stopPropagation()}
          onChange={async () => {
            try {
              await toggleTaskCompleted(task.id);
              await fetchAllTasks();
            } catch (err) {
              console.error(err);
            }
          }}
        />
        <span>{task.title}</span>
      </div>
      <div className={styles.right}>
        {task.subtaskCount > 0 && (
          <span className={styles.subtask}>{task.subtaskCount} Subtasks</span>
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

  return (
    <div className={styles.layoutContainer}>
      <div className={styles.wrapper}>
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

        <div className={styles.section}>
          <h2>Hôm nay</h2>
          <div className={styles.card}>
            <div
              className={styles.addTask}
              onClick={() => {
                setSelectedTask(null);
                setShowFormTask(true);
              }}
            >
              + Add New Task
            </div>
            {filterTasks(todayTasks).map(renderTask)}
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.section}>
            <h2>Ngày mai</h2>
            <div className={styles.card}>
              {filterTasks(tomorrowTasks).map(renderTask)}
            </div>
          </div>
          <div className={styles.section}>
            <h2>Tuần này</h2>
            <div className={styles.card}>
              {filterTasks(weekTasks).map(renderTask)}
            </div>
          </div>
        </div>
      </div>

      {showFormTask && (
        <aside className={styles.sideForm}>
          <FormTask
            task={selectedTask}
            onClose={() => {
              setShowFormTask(false);
              setSelectedTask(null);
            }}
            onSaveSuccess={fetchAllTasks}
          />
        </aside>
      )}
    </div>
  );
}
