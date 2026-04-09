import { useEffect, useState } from "react";
import styles from "./Day.module.css";
import { getTasksByDate } from "../../../api/task.jsx";

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

const getTaskColor = (task) => {
  if (task.completed) return styles.taskCompleted;
  const colors = [
    styles.taskBlue,
    styles.taskGreen,
    styles.taskOrange,
    styles.taskPurple,
  ];
  return colors[task.listId % colors.length] || styles.taskBlue;
};

function Day() {
  const hours = generateHours();
  const today = new Date().toLocaleDateString("en-CA");

  const [selectedDate, setSelectedDate] = useState(today);
  const [tasks, setTasks] = useState([]);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  // update giờ hiện tại
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // fetch tasks theo ngày chọn
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasksByDate(selectedDate);
        if (res?.data && Array.isArray(res.data)) {
          setTasks(res.data);
        } else if (Array.isArray(res)) {
          setTasks(res);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error("Lỗi lấy tasks:", err);
        setTasks([]);
      }
    };
    fetchTasks();
  }, [selectedDate]);

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {new Date(selectedDate).toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </div>

        <div className={styles.headerRight}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={styles.datePicker}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className={styles.content}>
        {hours.map((hour) => {
          const tasksInHour = tasks.filter((task) => {
            const d = new Date(task.dueDate);
            return (
              d.toLocaleDateString("en-CA") === selectedDate &&
              d.getHours() === hour.id
            );
          });

          const isCurrentHour =
            selectedDate === today && currentHour === hour.id;

          return (
            <div
              key={hour.id}
              className={`${styles.calendarDay} ${
                isCurrentHour ? styles.currentHourRow : ""
              }`}
            >
              {/* TIME */}
              <div className={styles.time}>
                {isCurrentHour && <div className={styles.currentDot}></div>}
                {hour.title}
              </div>

              {/* TASK */}
              <div className={styles.tasks}>
                {tasksInHour.length > 0 ? (
                  tasksInHour.map((task) => (
                    <div
                      key={task.id}
                      className={`${styles.taskCard} ${getTaskColor(task)}`}
                    >
                      <div className={styles.taskHeader}>
                        <span className={styles.taskTitle}>
                          {task.title}
                        </span>
                        <span className={styles.taskTime}>
                          {formatTime(task.dueDate)}
                        </span>
                      </div>

                      {task.description && (
                        <div className={styles.taskDesc}>
                          {task.description}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className={styles.empty}></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Day;