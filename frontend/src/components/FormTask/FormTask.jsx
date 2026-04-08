import styles from "./FormTask.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getAllLists } from "../../api/list";
import { useEffect, useState } from "react";

function FormTask({ task, onClose }) {
  const [lists, setLists] = useState([]);
  // State để quản lý dữ liệu form
  const [taskData, setTaskData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    listId: task?.todoList?.id || "", // Lưu ID của list được chọn
    dueDate: task?.dueDate || "",
  });
  // 1. Lấy danh sách list khi mở form
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await getAllLists();
        setLists(res);
      } catch (error) {
        console.error("Lỗi lấy danh sách list trong form:", error);
      }
    };
    fetchLists();
  }, []);

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.title}>Task:</span>
          <FontAwesomeIcon
            icon={faXmark}
            className={styles.closeIcon}
            onClick={onClose}
          />
        </div>

        <input
          name="title"
          className={styles.inputMain}
          placeholder="Task name"
          value={taskData.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          className={styles.textarea}
          placeholder="Description"
          value={taskData.description}
          onChange={handleChange}
        />

        {/* 2. Render danh sách List từ Backend vào <select> */}
        <div className={styles.row}>
          <label>List</label>
          <select
            name="listId"
            className={styles.select}
            value={taskData.listId}
            onChange={handleChange}
          >
            <option value="">None</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.nameList}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.row}>
          <label>Due date</label>
          <input
            name="dueDate"
            type="date"
            className={styles.dateInput}
            value={taskData.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className={styles.row}>
          <label>Tags</label>
          <div className={styles.tagGroup}>
            <span className={styles.tagBadge}>Tag 1</span>
            <button className={styles.addTagBtn}>
              <FontAwesomeIcon icon={faPlus} /> Add Tag
            </button>
          </div>
        </div>

        <div className={styles.subtasksSection}>
          <h3 className={styles.subtaskTitle}>Subtasks:</h3>
          <button className={styles.addSubtask}>
            <FontAwesomeIcon icon={faPlus} className={styles.plusIcon} />
            <span>Add New Subtask</span>
          </button>

          <div className={styles.subtaskItem}>
            <input type="checkbox" id="sub1" className={styles.checkbox} />
            <label htmlFor="sub1">Subtask</label>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className={styles.actions}>
          <button className={styles.deleteBtn}>Delete Task</button>
          <button
            className={styles.saveBtn}
            onClick={() => console.log("Dữ liệu gửi lên BE:", taskData)}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormTask;
