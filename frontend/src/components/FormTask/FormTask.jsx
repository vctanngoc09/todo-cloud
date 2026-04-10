import styles from "./FormTask.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faClock, faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { getAllLists } from "../../api/list";
import { getTagsByUserId } from "../../api/tag";
import { AuthService } from "../../services/auth.service";
import { useEffect, useState } from "react";
import AddSubtaskForm from "../AddSubtaskForm/AddSubtaskForm";
import { createTask } from "../../api/task";
function FormTask({ task, onClose }) {
  const [lists, setLists] = useState([]);
  const [tags, setTags] = useState([]);

  const user = AuthService.getUser();
  const userId = user?.id;

  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [subtasks, setSubtasks] = useState(task?.subTasks || []);

  // 🔥 FORM DATA
  const [taskData, setTaskData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    listId: task?.todoList?.id || "",
    dueDate: task?.dueDate ? task.dueDate.split("T")[0] : "", // Lấy phần YYYY-MM-DD
    dueTime: task?.dueDate
      ? task.dueDate.split("T")[1].substring(0, 5)
      : "00:00", // Lấy HH:mm
    tagIds: task?.tags?.map((t) => t.id) || [],
  });

  const handleAddSubtaskUI = (title) => {
    // Tạm thời chỉ cập nhật UI để bạn thấy
    const newSub = { id: Date.now(), title, completed: false };
    setSubtasks((prev) => [...prev, newSub]);
    setShowSubtaskForm(false); // Đóng form sau khi add
    console.log("Subtask mới:", title);
  };

  // =============================
  // FETCH LIST
  // =============================
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await getAllLists();
        setLists(res);
      } catch (error) {
        console.error("Lỗi list:", error);
      }
    };
    fetchLists();
  }, []);

  // =============================
  // FETCH TAG
  // =============================
  useEffect(() => {
    if (!userId) return;

    const fetchTags = async () => {
      try {
        const res = await getTagsByUserId(userId);
        setTags(res);
      } catch (error) {
        console.error("Lỗi tag:", error);
      }
    };

    fetchTags();
  }, [userId]);

  // =============================
  // INPUT CHANGE
  // =============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  // =============================
  // TOGGLE TAG
  // =============================
  const toggleTag = (tagId) => {
    setTaskData((prev) => {
      const exists = prev.tagIds.includes(tagId);

      return {
        ...prev,
        tagIds: exists
          ? prev.tagIds.filter((id) => id !== tagId)
          : [...prev.tagIds, tagId],
      };
    });
  };

  // =============================
  // AUTO TEXT COLOR
  // =============================

  const handleSave = async () => {
    if (!taskData.title.trim()) {
      alert("Vui lòng nhập tên công việc!");
      return;
    }

    const combinedDateTime = taskData.dueDate
      ? `${taskData.dueDate}T${taskData.dueTime || "00:00"}:00`
      : null;

    const payload = {
      title: taskData.title,
      description: taskData.description,
      listId: taskData.listId || null,
      dueDate: combinedDateTime,
      tagIds: taskData.tagIds,
      subtasks: subtasks.map((s) => s.title),
    };

    try {
      console.log("Đang gửi dữ liệu:", payload);
      const response = await createTask(payload);
      if (response) {
        alert("Tạo Task thành công!");
        onClose();
      }
    } catch (error) {
      console.error("Lỗi khi tạo Task:", error);
      alert("Có lỗi xảy ra: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        {/* HEADER */}
        <div className={styles.header}>
          <span className={styles.title}>Task:</span>
          <FontAwesomeIcon
            icon={faXmark}
            className={styles.closeIcon}
            onClick={onClose}
          />
        </div>

        {/* TITLE */}
        <input
          name="title"
          className={styles.inputMain}
          placeholder="Task name"
          value={taskData.title}
          onChange={handleChange}
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          className={styles.textarea}
          placeholder="Description"
          value={taskData.description}
          onChange={handleChange}
        />

        {/* LIST */}
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

        {/* DATE */}
        <div className={styles.row}>
          <label>Due date</label>
          <div className={styles.inputWrapper}>
            <input
              name="dueDate"
              type="date"
              className={styles.dateInput}
              value={taskData.dueDate}
              onChange={handleChange}
            />
            <FontAwesomeIcon
              icon={faCalendarDays}
              className={styles.inputIcon}
            />
          </div>
        </div>

        {/* TIME */}
        <div className={styles.row}>
          <label>Time</label>
          <div className={styles.inputWrapper}>
            <input
              name="dueTime"
              type="time"
              className={styles.dateInput}
              value={taskData.dueTime}
              onChange={handleChange}
            />
            <FontAwesomeIcon icon={faClock} className={styles.inputIcon} />
          </div>
        </div>

        {/* ========================= */}
        {/* TAGS */}
        {/* ========================= */}
        <div className={styles.row}>
          <label>Tags</label>
          <div className={styles.tagGroup}>
            {tags.map((tag) => {
              const isActive = taskData.tagIds.includes(tag.id);

              return (
                <span
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`${styles.tagBadge} ${
                    isActive ? styles.activeTag : ""
                  }`}
                  style={{
                    backgroundColor: tag.color,
                    color: "white",
                  }}
                >
                  {tag.nameTag}
                </span>
              );
            })}
          </div>
        </div>

        <div className={styles.subtasksSection}>
          <h3 className={styles.subtaskTitle}>Subtasks:</h3>

          {/* 1. Đưa nút Add và Form lên đầu danh sách */}
          {showSubtaskForm ? (
            <AddSubtaskForm
              onAdd={handleAddSubtaskUI}
              onClose={() => setShowSubtaskForm(false)}
            />
          ) : (
            <button
              className={styles.addSubtask}
              onClick={() => setShowSubtaskForm(true)}
            >
              <FontAwesomeIcon icon={faPlus} className={styles.plusIcon} />
              <span>Add New Subtask</span>
            </button>
          )}

          {/* 2. Danh sách subtasks hiện ở dưới nút thêm */}
          <div className={styles.subtaskList}>
            {subtasks.map((sub) => (
              <div key={sub.id} className={styles.subtaskItem}>
                <input
                  type="checkbox"
                  id={`sub-${sub.id}`}
                  className={styles.checkbox}
                  defaultChecked={sub.completed}
                />
                <label htmlFor={`sub-${sub.id}`}>{sub.title}</label>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.actions}>
          <button className={styles.deleteBtn} type="button">
            Delete Task
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSave} // 2. Gọi hàm handleSave thay vì console.log
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormTask;
