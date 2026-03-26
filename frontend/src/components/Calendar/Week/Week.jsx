import DateTimeUtils from "../../../utils/DateTimeUtils";
import styles from "./Week.module.css";

const tasks = [
  {
    id: 1,
    title: "Dien Toan",
    description: "Tao may chu ..........................................",
    status: "hoanthanh",
    due_date: "2026-03-23T09:00:00",
    list: "Gia đình",
  },
  {
    id: 2,
    title: "Hoc React",
    description: "Hoc useState va useEffect",
    status: "danglam",
    due_date: "2026-03-23T09:00:00",
    list: "Công việc",
  },
  {
    id: 3,
    title: "Di sieu thi",
    description: "Mua rau, thit, sua55",
    status: "chuahoanthanh",
    due_date: "2026-03-24T14:15:00",
    list: "Gia đình",
  },
  {
    id: 4,
    title: "Tap gym",
    description: "Tap chan va bung",
    status: "danglam",
    due_date: "2026-03-23T09:00:00",
    list: "Cá nhân",
  },
  {
    id: 5,
    title: "Lam bai tap",
    description: "Hoan thanh bai tap JS",
    status: "chuahoanthanh",
    due_date: "2026-03-26T18:30:00",
    list: "Học tập",
  },
  {
    id: 6,
    title: "Hop team",
    description: "Discuss project",
    status: "hoanthanh",
    due_date: "2026-03-23T09:00:00",
    list: "Công việc",
  },
  {
    id: 7,
    title: "Doc sach",
    description: "Doc 20 trang sach",
    status: "danglam",
    due_date: "2026-03-27T21:00:00",
    list: "Cá nhân",
  },
  {
    id: 8,
    title: "Don dep nha",
    description: "Lau nha, rua chen",
    status: "chuahoanthanh",
    due_date: "2026-03-23T07:45:00",
    list: "Gia đình",
  },
  {
    id: 9,
    title: "An sang",
    description: "Banh mi va sua",
    status: "hoanthanh",
    due_date: "2026-03-22T07:30:00",
    list: "Cá nhân",
  },
  {
    id: 10,
    title: "Code feature A",
    description: "Lam UI calendar",
    status: "danglam",
    due_date: "2026-03-22T10:00:00",
    list: "Công việc",
  },
  {
    id: 11,
    title: "Goi dien cho me",
    description: "Hoi tham suc khoe",
    status: "chuahoanthanh",
    due_date: "2026-03-22T20:00:00",
    list: "Gia đình",
  },
  {
    id: 12,
    title: "Hoc CSS",
    description: "Flexbox va Grid",
    status: "danglam",
    due_date: "2026-03-23T11:00:00",
    list: "Học tập",
  },
  {
    id: 13,
    title: "Uong nuoc",
    description: "2 lit nuoc",
    status: "hoanthanh",
    due_date: "2026-03-23T15:00:00",
    list: "Cá nhân",
  },
  {
    id: 14,
    title: "Nau an",
    description: "Com toi",
    status: "chuahoanthanh",
    due_date: "2026-03-24T18:00:00",
    list: "Gia đình",
  },
  {
    id: 15,
    title: "Fix bug",
    description: "Sua loi login",
    status: "danglam",
    due_date: "2026-03-24T09:30:00",
    list: "Công việc",
  },
  {
    id: 16,
    title: "Chay bo",
    description: "Chay 3km",
    status: "hoanthanh",
    due_date: "2026-03-25T06:30:00",
    list: "Cá nhân",
  },
  {
    id: 17,
    title: "Hoc NodeJS",
    description: "API co ban",
    status: "chuahoanthanh",
    due_date: "2026-03-25T14:00:00",
    list: "Học tập",
  },
  {
    id: 18,
    title: "Hop khach hang",
    description: "Trinh bay demo",
    status: "danglam",
    due_date: "2026-03-25T16:00:00",
    list: "Công việc",
  },
  {
    id: 19,
    title: "Don phong",
    description: "Sap xep ban hoc",
    status: "hoanthanh",
    due_date: "2026-03-26T08:00:00",
    list: "Cá nhân",
  },
  {
    id: 20,
    title: "Lam viec nhom",
    description: "Project React",
    status: "danglam",
    due_date: "2026-03-26T13:30:00",
    list: "Học tập",
  },
  {
    id: 21,
    title: "Di choi",
    description: "Cafe voi ban",
    status: "chuahoanthanh",
    due_date: "2026-03-26T19:00:00",
    list: "Cá nhân",
  },
  {
    id: 22,
    title: "Tap yoga",
    description: "30 phut",
    status: "hoanthanh",
    due_date: "2026-03-27T06:00:00",
    list: "Cá nhân",
  },
  {
    id: 23,
    title: "Code backend",
    description: "Lam API auth",
    status: "danglam",
    due_date: "2026-03-27T10:30:00",
    list: "Công việc",
  },
  {
    id: 24,
    title: "Hoc English",
    description: "30 tu vung",
    status: "chuahoanthanh",
    due_date: "2026-03-27T20:30:00",
    list: "Học tập",
  },
  {
    id: 25,
    title: "Di sieu thi",
    description: "Mua do an",
    status: "hoanthanh",
    due_date: "2026-03-28T09:00:00",
    list: "Gia đình",
  },
  {
    id: 26,
    title: "Xem phim",
    description: "Relax",
    status: "danglam",
    due_date: "2026-03-28T21:00:00",
    list: "Cá nhân",
  },
  {
    id: 27,
    title: "Ve sinh nha",
    description: "Tong don dep",
    status: "chuahoanthanh",
    due_date: "2026-03-29T08:30:00",
    list: "Gia đình",
  },
  {
    id: 28,
    title: "Len ke hoach",
    description: "Plan tuan moi",
    status: "danglam",
    due_date: "2026-03-29T17:00:00",
    list: "Công việc",
  },
];

function getHour(dateString) {
  return new Date(dateString).getHours();
}

function getDay(dateString) {
  return new Date(dateString).getDay();
}

function getCurrentWeek() {
  const today = new Date();
  const day = today.getDay() || 7;

  const monday = new Date(today);
  monday.setDate(today.getDate() - day + 1);

  const week = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    week.push({
      id: d.getDay(),
      title: d.getDay() === 0 ? "Chủ nhật" : `Thứ ${d.getDay() + 1}`,
      date: d,
    });
  }

  return week;
}

function Week() {
  const hours = DateTimeUtils.getHours();
  const arrDayOfWeek = getCurrentWeek();

  const taskMap = {};

  tasks.forEach((task) => {
    const day = getDay(task.due_date);
    const hour = getHour(task.due_date);

    if (!taskMap[day]) taskMap[day] = {};
    if (!taskMap[day][hour]) taskMap[day][hour] = [];

    taskMap[day][hour].push(task);
  });

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <table className={styles.headerTable}>
        <thead>
          <tr className={styles.header}>
            <th></th>
            {arrDayOfWeek.map((day) => (
              <th key={day.id}>
                <div>{day.title}</div>
                <div>{day.date.toLocaleDateString("vi-VN")}</div>
              </th>
            ))}
          </tr>
        </thead>
      </table>

      {/* BODY */}
      <div className={styles.calendar}>
        <table>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour.id} className={styles.calendarDay}>
                <td className={styles.time}>{hour.title}</td>

                {arrDayOfWeek.map((day) => {
                  const cellTasks = taskMap[day.id]?.[hour.id] || [];
                  const isToday = DateTimeUtils.isSameDay(day.date, new Date());

                  return (
                    <td
                      key={day.id}
                      className={`${styles.tasks} ${
                        isToday ? styles.todayColumn : ""
                      }`}
                    >
                      <div className={styles.tasksInner}>
                        {cellTasks.length > 0 ? (
                          cellTasks.map((task) => (
                            <div key={task.id}>{task.description}</div>
                          ))
                        ) : (
                          <div className={styles.empty}></div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Week;
