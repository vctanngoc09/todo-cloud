import { useEffect, useState, useRef } from "react";
import styles from "./Day.module.css";
import { getTasksByDate } from "../../../api/task.jsx";
import TaskDetail from "../../TaskDetail/TaskDetail.jsx";

const generateHours = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    id: i,
    title: `${i.toString().padStart(2, "0")}:00`,
  }));
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function Day() {
  const hours = generateHours();
  const today = new Date().toLocaleDateString("en-CA");

  const [selectedDate, setSelectedDate] = useState(today);
  const [tasks, setTasks] = useState([]);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const hourRefs = useRef({});

  // cập nhật giờ realtime
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasksByDate(selectedDate);
        const data = res?.data || res;
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi lấy tasks:", err);
        setTasks([]);
      }
    };
    fetchTasks();
  }, [selectedDate]);

  // scroll tới giờ hiện tại
  const scrollToCurrentHour = () => {
    const current = new Date().getHours();
    const el = hourRefs.current[current];

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // auto scroll khi load
  useEffect(() => {
    setTimeout(() => {
      scrollToCurrentHour();
    }, 300);
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerRight}>
          <button onClick={scrollToCurrentHour} className={styles.nowBtn}>
            Bây giờ
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={styles.datePicker}
          />
        </div>
        <div className={styles.headerLeft}>
          {new Date(selectedDate).toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </div>
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        {hours.map((hour) => {
          const tasksInHour = tasks
            .filter((task) => new Date(task.dueDate).getHours() === hour.id)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

          const isCurrentHour =
            selectedDate === today && currentHour === hour.id;

          return (
            <div
              key={hour.id}
              ref={(el) => (hourRefs.current[hour.id] = el)}
              className={`${styles.calendarDay} ${
                isCurrentHour ? styles.currentHourRow : ""
              }`}
            >
              <div className={styles.time}>
                {isCurrentHour && <div className={styles.currentDot}></div>}
                {hour.title}
              </div>

              <div className={styles.tasks}>
                {tasksInHour.map((task) => (
                  <div
                    key={task.id}
                    className={styles.taskCard}
                    onClick={() => setSelectedTaskId(task.id)}
                    style={{
                      backgroundColor: task.completed
                        ? "#e5e5e5"
                        : task.listColor || "#888",
                      opacity: task.completed ? 0.7 : 1,
                    }}
                  >
                    <div className={styles.taskHeader}>
                      <span className={styles.taskTitle}>{task.title}</span>
                      <span className={styles.taskTime}>
                        {formatTime(task.dueDate)}
                      </span>
                    </div>
                  </div>
                ))}
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

export default Day;
