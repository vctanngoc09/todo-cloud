import { useEffect, useState } from "react";
import styles from "./Month.module.css";
import { getMonthTasks } from "../../../api/task.jsx";
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

// parse tránh lệch timezone
const parseDate = (dateStr) => {
  const [datePart, timePart] = dateStr.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute);
};

function Month() {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [expandedDays, setExpandedDays] = useState({});

  const formatDate = (date) => date.toISOString().split("T")[0];

  const fetchTasks = async (date) => {
    try {
      const res = await getMonthTasks(formatDate(date));
      setTasks(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Fetch month tasks error:", err);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks(currentDate);
  }, [currentDate]);

  // 👉 NAVIGATION
  const nextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const prevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysInMonthCount = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const emptyDaysBefore = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const daysArray = Array.from({ length: daysInMonthCount }, (_, i) => i + 1);

  // GROUP TASK
  const groupedTasks = {};
  tasks.forEach((task) => {
    if (!task?.dueDate) return;

    const date = parseDate(task.dueDate);

    if (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    ) {
      const day = date.getDate();
      if (!groupedTasks[day]) groupedTasks[day] = [];
      groupedTasks[day].push(task);
    }
  });

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  return (
    <div className={styles.wrapper}>
      {/* 🔥 NAV */}
      <div className={styles.monthNav}>
        {/* LEFT */}
        <div className={styles.monthLeft}>
          <button onClick={prevMonth} className={styles.navBtn}>
            ⬅
          </button>

          <button onClick={goToday} className={styles.todayBtn}>
            Hôm nay
          </button>

          <button onClick={nextMonth} className={styles.navBtn}>
            ➡
          </button>
        </div>

        {/* RIGHT */}
        <div className={styles.monthRight}>
          <div className={styles.monthLabel}>
            Tháng {currentMonth + 1} / {currentYear}
          </div>
        </div>
      </div>

      <div className={styles.calendarGrid}>
        {daysOfWeek.map((day) => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}

        {Array.from({ length: emptyDaysBefore }).map((_, i) => (
          <div key={i} className={styles.dayCellEmpty}></div>
        ))}

        {daysArray.map((day) => {
          const dayTasks = groupedTasks[day] || [];
          const isExpanded = expandedDays[day];

          const visibleTasks = isExpanded ? dayTasks : dayTasks.slice(0, 3);

          return (
            <div
              key={day}
              className={`${styles.dayCell} ${
                today.getDate() === day &&
                today.getMonth() === currentMonth &&
                today.getFullYear() === currentYear
                  ? styles.today
                  : ""
              }`}
            >
              <span className={styles.dayNumber}>{day}</span>

              <div className={styles.taskList}>
                {visibleTasks.map((task) => (
                  <div
                    key={task.id}
                    className={styles.taskItem}
                    onClick={() => setSelectedTaskId(task.id)}
                    style={{
                      backgroundColor: task.listColor || "#888",
                    }}
                  >
                    <span className={styles.taskTitle}>{task.title}</span>
                  </div>
                ))}

                {dayTasks.length > 3 && (
                  <div className={styles.more} onClick={() => toggleDay(day)}>
                    {isExpanded
                      ? "Thu gọn"
                      : `+${dayTasks.length - 3} xem thêm`}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selectedTaskId && (
        <TaskDetail
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}

export default Month;
