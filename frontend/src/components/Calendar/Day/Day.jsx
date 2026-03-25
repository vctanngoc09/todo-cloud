import styles from "./Day.module.css";

import DateTimeUtils from "../../../utils/DateTimeUtils";
const tasks = [
  {
    id: 1,
    title: "Dien Toan",
    description: "Tao may chu ..........................................",
    status: "hoanthanh",
    due_date: "2026-03-15T10:30:00",
    list: "Gia đình",
  },
  {
    id: 2,
    title: "Hoc React",
    description: "Hoc useState va useEffect",
    status: "danglam",
    due_date: "2026-03-16T09:00:00",
    list: "Công việc",
  },
  {
    id: 3,
    title: "Di sieu thi",
    description: "Mua rau, thit, sua55",
    status: "chuahoanthanh",
    due_date: "2026-03-18T14:15:00",
    list: "Gia đình",
  },
  {
    id: 4,
    title: "Tap gym",
    description: "Tap chan va bung",
    status: "danglam",
    due_date: "2026-03-20T18:00:00",
    list: "Cá nhân",
  },
  {
    id: 5,
    title: "Lam bai tap",
    description: "Hoan thanh bai tap JS",
    status: "chuahoanthanh",
    due_date: "2026-03-25T18:30:00",
    list: "Học tập",
  },
  {
    id: 6,
    title: "Hop team",
    description: "Discuss project",
    status: "hoanthanh",
    due_date: "2026-04-02T08:30:00",
    list: "Công việc",
  },
  {
    id: 7,
    title: "Doc sach",
    description: "Doc 20 trang sach",
    status: "danglam",
    due_date: "2026-04-10T21:00:00",
    list: "Cá nhân",
  },
  {
    id: 8,
    title: "Don dep nha",
    description: "Lau nha, rua chen",
    status: "chuahoanthanh",
    due_date: "2026-04-15T07:45:00",
    list: "Gia đình",
  },
];

function getHour(dateString) {
  return new Date(dateString).getHours();
}
function Day() {
  const hours = DateTimeUtils.getHours();
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>Thứ 3</div>
      <div className={styles.content}>
        {hours.map((hour, index) => (
          <div key={hour} className={styles.calendarDay}>
            <div className={styles.time}>{hour}</div>
            <div className={styles.tasks}>
              {tasks
                .filter((task) => getHour(task.due_date) === index)
                .map((task) => (
                  <div key={task.id} className={styles.description}>
                    {task.description}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Day;
