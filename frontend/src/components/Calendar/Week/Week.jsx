import { useEffect, useState } from "react";
import styles from "./Week.module.css";
import { getWeekTasks } from "../../../api/task.jsx";
import TaskDetail from "../../TaskDetail/TaskDetail.jsx";

const daysOfWeek = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
];

// Parse date tránh lệch timezone
const parseDate = (dateStr) => {
  const [datePart, timePart] = dateStr.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute);
};

// Lấy thứ 2 đầu tuần
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  return new Date(d.setDate(diff));
};

function Week() {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTaskId, setSelectedTaskId] = useState(null); // ✅ thêm

  const formatDate = (date) => date.toISOString().split("T")[0];

  // FETCH API
  const fetchTasks = async (date) => {
    try {
      const res = await getWeekTasks(formatDate(date));
      setTasks(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks(currentDate);
  }, [currentDate]);

  // NAVIGATION
  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const startOfWeek = getStartOfWeek(currentDate);

  // GROUP TASKS
  const groupedTasks = {};

  (tasks || []).forEach((task) => {
    if (!task?.dueDate) return;

    const date = parseDate(task.dueDate);
    const day = date.getDay() === 0 ? 6 : date.getDay() - 1;

    if (!groupedTasks[day]) groupedTasks[day] = [];
    groupedTasks[day].push(task);
  });

  // SORT TASK THEO GIỜ
  Object.keys(groupedTasks).forEach((day) => {
    groupedTasks[day].sort(
      (a, b) => parseDate(a.dueDate) - parseDate(b.dueDate),
    );
  });

  return (
    <div className={styles.wrapper}>
      {/* NAV */}
      <div className={styles.weekNav}>
        <div className={styles.weekControls}>
          <button onClick={prevWeek} className={styles.navBtn}>
            ⬅
          </button>
          <button onClick={nextWeek} className={styles.navBtn}>
            ➡
          </button>
        </div>

        <div className={styles.weekLabel}>
          {startOfWeek.toLocaleDateString("vi-VN")} -{" "}
          {new Date(
            startOfWeek.getFullYear(),
            startOfWeek.getMonth(),
            startOfWeek.getDate() + 6,
          ).toLocaleDateString("vi-VN")}
        </div>
      </div>

      {/* HEADER */}
      <div className={styles.header}>
        {daysOfWeek.map((day, index) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + index);

          return (
            <div key={index} className={styles.dayHeader}>
              <div className={styles.dayName}>{day}</div>
              <div className={styles.dayDate}>
                {date.getDate()}/{date.getMonth() + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* BODY */}
      <div className={styles.body}>
        {daysOfWeek.map((_, index) => (
          <div key={index} className={styles.column}>
            {(groupedTasks[index] || []).map((task) => {
              const time = parseDate(task.dueDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={task.id}
                  className={styles.task}
                  onClick={() => setSelectedTaskId(task.id)} // ✅ click mở modal
                  style={{ backgroundColor: task.listColor || "#888" }}
                >
                  <div className={styles.title}>{task.title}</div>
                  <div className={styles.time}>{time}</div>
                  <div className={styles.list}>{task.nameList}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ✅ MODAL DETAIL */}
      {selectedTaskId && (
        <TaskDetail
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}

export default Week;
