import React from "react";
import styles from "./Month.module.css";
import DateTimeUtils from "../../../utils/DateTimeUtils";

const tasks = [
  {
    id: 1,
    title: "Dien Toan",
    status: "hoanthanh",
    due_date: "2026-03-23T09:00:00",
    list: "Gia đình",
  },
  {
    id: 2,
    title: "Hoc React",
    status: "danglam",
    due_date: "2026-03-23T09:00:00",
    list: "Công việc",
  },
  {
    id: 3,
    title: "Di sieu thi",
    status: "chuahoanthanh",
    due_date: "2026-03-24T14:15:00",
    list: "Gia đình",
  },
  {
    id: 4,
    title: "Tap gym",
    status: "danglam",
    due_date: "2026-03-23T09:00:00",
    list: "Cá nhân",
  },
  {
    id: 5,
    title: "Lam bai tap",
    status: "chuahoanthanh",
    due_date: "2026-03-26T18:30:00",
    list: "Học tập",
  },
  {
    id: 6,
    title: "Hop team",
    status: "hoanthanh",
    due_date: "2026-03-23T09:00:00",
    list: "Công việc",
  },
  {
    id: 7,
    title: "Doc sach",
    status: "danglam",
    due_date: "2026-03-27T21:00:00",
    list: "Cá nhân",
  },
  {
    id: 8,
    title: "Don dep nha",
    status: "chuahoanthanh",
    due_date: "2026-03-23T07:45:00",
    list: "Gia đình",
  },
  {
    id: 9,
    title: "An sang",
    status: "hoanthanh",
    due_date: "2026-03-22T07:30:00",
    list: "Cá nhân",
  },
  {
    id: 10,
    title: "Code feature A",
    status: "danglam",
    due_date: "2026-03-22T10:00:00",
    list: "Công việc",
  },
  {
    id: 11,
    title: "Goi dien cho me",
    status: "chuahoanthanh",
    due_date: "2026-03-22T20:00:00",
    list: "Gia đình",
  },
  {
    id: 12,
    title: "Hoc CSS",
    status: "danglam",
    due_date: "2026-03-23T11:00:00",
    list: "Học tập",
  },
  {
    id: 13,
    title: "Uong nuoc",
    status: "hoanthanh",
    due_date: "2026-03-23T15:00:00",
    list: "Cá nhân",
  },
  {
    id: 14,
    title: "Nau an",
    status: "chuahoanthanh",
    due_date: "2026-03-24T18:00:00",
    list: "Gia đình",
  },
  {
    id: 15,
    title: "Fix bug",
    status: "danglam",
    due_date: "2026-03-24T09:30:00",
    list: "Công việc",
  },
  {
    id: 16,
    title: "Chay bo",
    status: "hoanthanh",
    due_date: "2026-03-25T06:30:00",
    list: "Cá nhân",
  },
  {
    id: 17,
    title: "Hoc NodeJS",
    status: "chuahoanthanh",
    due_date: "2026-03-25T14:00:00",
    list: "Học tập",
  },
  {
    id: 18,
    title: "Hop khach hang",
    status: "danglam",
    due_date: "2026-03-07T16:00:00",
    list: "Công việc",
  },
  {
    id: 19,
    title: "Don phong",
    status: "hoanthanh",
    due_date: "2026-03-26T08:00:00",
    list: "Cá nhân",
  },
  {
    id: 20,
    title: "Lam viec nhom",
    status: "danglam",
    due_date: "2026-03-26T13:30:00",
    list: "Học tập",
  },
  {
    id: 21,
    title: "Di choi",
    status: "chuahoanthanh",
    due_date: "2026-03-26T19:00:00",
    list: "Cá nhân",
  },
  {
    id: 22,
    title: "Tap yoga",
    status: "hoanthanh",
    due_date: "2026-03-01T06:00:00",
    list: "Cá nhân",
  },
  {
    id: 23,
    title: "Code backend",
    status: "danglam",
    due_date: "2026-03-27T10:30:00",
    list: "Công việc",
  },
  {
    id: 24,
    title: "Hoc English aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ",
    status: "chuahoanthanh",
    due_date: "2026-03-27T20:30:00",
    list: "Học tập",
  },
  {
    id: 25,
    title: "Di sieu thi",
    status: "hoanthanh",
    due_date: "2026-03-28T09:00:00",
    list: "Gia đình",
  },
  {
    id: 26,
    title: "Xem phim",
    status: "danglam",
    due_date: "2026-03-28T21:00:00",
    list: "Cá nhân",
  },
  {
    id: 27,
    title: "Ve sinh nha",
    status: "chuahoanthanh",
    due_date: "2026-03-29T08:30:00",
    list: "Gia đình",
  },
  {
    id: 28,
    title: "Len ke hoach",
    status: "danglam",
    due_date: "2026-03-29T17:00:00",
    list: "Công việc",
  },
];

function Month() {
  const today = DateTimeUtils.now().getDate();

  const currentYear = 2026;
  const currentMonth = 2; // Tháng 3 (JS Date tháng bắt đầu từ 0)

  // Tính số ngày trong tháng và ngày bắt đầu của tháng
  const daysInMonthCount = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Chỉnh logic: Nếu getDay() = 0 (CN), ta muốn nó ở vị trí cuối (6). Nếu là 1 (T2) -> vị trí 0.
  const emptyDaysBefore = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const daysArray = Array.from({ length: daysInMonthCount }, (_, i) => i + 1);

  const getTasksByDay = (day) => {
    return tasks.filter((task) => {
      const d = new Date(task.due_date);
      return (
        d.getDate() === day &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.calendarGrid}>
        {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"].map(
          (day) => (
            <div key={day} className={styles.dayHeader}>
              {day}
            </div>
          ),
        )}

        {/* Ô trống của tháng trước */}
        {Array.from({ length: emptyDaysBefore }).map((_, i) => (
          <div key={`empty-${i}`} className={styles.dayCellEmpty}></div>
        ))}

        {/* Các ngày trong tháng */}
        {daysArray.map((day) => {
          const dayTasks = getTasksByDay(day);
          return (
            <div
              key={day}
              className={`${styles.dayCell}  ${today === day ? styles.today : ""}`}
            >
              <span className={styles.dayNumber}>{day}</span>
              <div className={styles.taskList}>
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`${styles.taskItem} ${styles[task.status]}`}
                  >
                    <span className={styles.taskTitle}>{task.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Month;
