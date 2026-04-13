import styles from "./Today.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import FormTask from "../FormTask/FormTask";
import { getTaskDetail, getTodayTasks, toggleTaskStatus } from "../../api/task";
import {
  faAngleRight,
  faBusinessTime,
  faCalendarDay,
  faNoteSticky,
  faCalendarDays,
  faPlus,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
function Today() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]); // State lưu danh sách task
  const [loading, setLoading] = useState(true);

  // Hàm fetch dữ liệu
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTodayTasks();
      setTasks(data);
    } catch (error) {
      console.error("Lỗi khi lấy task hôm nay:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompleted = async (e, taskId) => {
    e.stopPropagation(); // Chặn sự kiện nổi bọt để không mở FormTask

    try {
      await toggleTaskStatus(taskId);
      // Cách 1: Fetch lại toàn bộ danh sách (Dễ nhất)
      fetchTasks();

      // Cách 2: Tối ưu hơn - Cập nhật state tại chỗ để không phải load lại
      /*
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ));
      */
    } catch (error) {
      console.error("Lỗi khi đổi trạng thái task:", error);
      alert("Không thể cập nhật trạng thái công việc.");
    }
  };

  // Gọi API khi load trang
  useEffect(() => {
    fetchTasks();
  }, []);

  // Hàm định dạng ngày tháng hiển thị (VD: 2026-04-09 -> 09-04-26)
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const handleTaskClick = async (taskId) => {
    try {
      setLoading(true);
      const detailData = await getTaskDetail(taskId); // Gọi API lấy đầy đủ tags và subtasks
      setSelectedTask(detailData);
      setShowForm(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết task:", error);
      alert("Không thể tải thông tin chi tiết công việc.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.header}>
          <h1>Today</h1>
          <span className={styles.count}>{tasks.length}</span>
        </div>

        <button
          className={styles.addnewtask}
          onClick={() => {
            setShowForm(true);
            setSelectedTask(null);
          }}
        >
          <FontAwesomeIcon icon={faPlus} className={styles.iconadd} />
          <span>Add New Task</span>
        </button>

        <div className={styles.list}>
          {loading ? (
            <p>Đang tải công việc...</p>
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <button
                key={task.id}
                className={styles.item}
                onClick={() => handleTaskClick(task.id)} // Sử dụng hàm handleTaskClick mới
              >
                <div className={styles.itemtop}>
                  <div className={styles.itemleft}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={task.completed}
                      onChange={(e) => handleToggleCompleted(e, task.id)} // Dùng onChange thay vì onClick
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className={styles.title}>{task.title}</span>
                  </div>
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    className={styles.icon}
                  />
                </div>

                <div className={styles.itembottom}>
                  {/* Ngày tháng */}
                  <div className={styles.signature}>
                    <FontAwesomeIcon
                      icon={faBusinessTime}
                      className={styles.icondeadline}
                    />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>

                  {/* Số lượng Subtasks */}
                  <div className={styles.signature}>
                    <span className={styles.badge}>{task.subtaskCount}</span>
                    <span>Subtasks</span>
                  </div>

                  {/* Tên List và Màu sắc */}
                  {task.nameList && (
                    <div className={styles.signature}>
                      <div
                        className={styles.colorBox}
                        style={{ backgroundColor: task.listColor || "#ddd" }}
                      ></div>
                      <span>{task.nameList}</span>
                    </div>
                  )}
                </div>
              </button>
            ))
          ) : (
            <p className={styles.empty}>Hôm nay bạn chưa có công việc nào!</p>
          )}
        </div>
      </div>

      <div className={styles.right}>
        {showForm && (
          <FormTask
            task={selectedTask}
            onClose={() => setShowForm(false)}
            onSaveSuccess={fetchTasks} // Refresh lại danh sách sau khi lưu
          />
        )}
      </div>
    </div>
  );
}
export default Today;
