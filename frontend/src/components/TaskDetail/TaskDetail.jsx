import { useEffect, useState } from "react";
import { getTaskDetail } from "../../api/task.jsx";
import styles from "./TaskDetail.module.css";

function TaskDetail({ taskId, onClose }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getTaskDetail(taskId);
        setTask(res.data || res);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [taskId]);

  if (!taskId) return null;

  return (
    <div className={styles.wrapper} onClick={onClose}>
      <div className={styles.form} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.header}>
          <span className={styles.title}>Công việc:</span>
          <span className={styles.closeIcon} onClick={onClose}>
            ✕
          </span>
        </div>

        {loading ? (
          <div>Đang tải...</div>
        ) : task ? (
          <>
            {/* TITLE */}
            <input className={styles.inputMain} value={task.title} readOnly />

            {/* DESCRIPTION */}
            <textarea
              className={styles.textarea}
              value={task.description || "Không có mô tả"}
              readOnly
            />

            {/* LIST */}
            <div className={styles.row}>
              <label>Danh sách</label>
              <input
                className={styles.select}
                value={task.nameList || "Không có"}
                readOnly
              />
            </div>

            {/* DUE DATE */}
            <div className={styles.row}>
              <label>Ngày thực hiện</label>
              <input
                type="datetime-local"
                className={styles.dateInput}
                value={task.dueDate ? task.dueDate.slice(0, 16) : ""}
                readOnly
              />
            </div>

            {/* TAGS */}
            {task.tags?.length > 0 && (
              <div className={styles.row}>
                <label>Thẻ</label>
                <div className={styles.tagGroup}>
                  {task.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className={styles.tagBadge}
                      style={{ backgroundColor: tag.color, color: "white" }}
                    >
                      {tag.nameTag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTASKS */}
            {task.subTasks?.length > 0 && (
              <div className={styles.subtasksSection}>
                <h3 className={styles.subtaskTitle}>Công việc con:</h3>
                <div className={styles.subtaskList}>
                  {task.subTasks.map((sub) => (
                    <div key={sub.id} className={styles.subtaskItem}>
                      <span
                        className={
                          sub.completed ? styles.doneText : styles.subText
                        }
                      >
                        {sub.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FOOTER */}
            <div className={styles.actions}>
              <div></div>
              <div>
                <label>Trạng thái: </label>
                <span>{task.completed ? "Hoàn thành" : "Đang thực hiện"}</span>
              </div>
            </div>
          </>
        ) : (
          <div>Không tìm thấy thông tin</div>
        )}
      </div>
    </div>
  );
}

export default TaskDetail;
