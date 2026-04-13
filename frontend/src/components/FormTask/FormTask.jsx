import styles from "./FormTask.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faClock, faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState, useMemo } from "react"; // PHẢI CÓ useMemo Ở ĐÂY
import AddSubtaskForm from "../AddSubtaskForm/AddSubtaskForm";
import { createTask, updateTask } from "../../api/task";

// 1. Import cả 2 Context
import { useLists } from "../../contexts/ListsContext.jsx";
import { useTags } from "../../contexts/TagsContext.jsx";

function FormTask({ task, onClose, onSaveSuccess }) {
  // 2. Lấy dữ liệu từ Contexts - XÓA BỎ các useState tags cũ
  const { lists } = useLists();
  const { tags } = useTags();

  // 3. Lọc Active bằng useMemo để tránh vòng lặp vô tận
  const activeLists = useMemo(
    () => lists.filter((list) => list.active),
    [lists],
  );
  const activeTags = useMemo(() => tags.filter((tag) => tag.active), [tags]);

  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [subtasks, setSubtasks] = useState(task?.subTasks || []);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    listId: "",
    dueDate: "",
    dueTime: "00:00",
    tagIds: [],
  });

  // 4. Đồng bộ dữ liệu khi mở Form
  useEffect(() => {
    if (task) {
      setSubtasks(task.subTasks || []);
      setTaskData({
        title: task.title || "",
        description: task.description || "",
        listId: task.listId || "",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        dueTime: task.dueDate
          ? task.dueDate.split("T")[1].substring(0, 5)
          : "00:00",
        tagIds: task.tags?.map((t) => t.id) || [],
      });
    } else {
      setSubtasks([]);
      setTaskData({
        title: "",
        description: "",
        listId: "",
        dueDate: "",
        dueTime: "00:00",
        tagIds: [],
      });
    }
  }, [task]);

  // Logic xử lý Subtask
  const handleAddSubtaskUI = (title) => {
    setSubtasks((prev) => [
      ...prev,
      { id: null, title: title, completed: false },
    ]);
    setShowSubtaskForm(false);
  };

  const handleToggleSubtask = (index) => {
    setSubtasks((prev) =>
      prev.map((sub, i) =>
        i === index ? { ...sub, completed: !sub.completed } : sub,
      ),
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSave = async () => {
    if (!taskData.title.trim()) return alert("Vui lòng nhập tên công việc!");

    const combinedDateTime = taskData.dueDate
      ? `${taskData.dueDate}T${taskData.dueTime || "00:00"}:00`
      : null;

    const payload = {
      title: taskData.title,
      description: taskData.description,
      listId: taskData.listId || null,
      dueDate: combinedDateTime,
      tagIds: taskData.tagIds,
      subtasks: subtasks,
    };

    try {
      const response = task?.id
        ? await updateTask(task.id, payload)
        : await createTask(payload);
      if (response) {
        alert(task?.id ? "Cập nhật thành công!" : "Tạo Task thành công!");
        if (onSaveSuccess) onSaveSuccess();
        onClose();
      }
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        <div className={styles.header}>
          <span className={styles.title}>
            {task?.id ? "Edit Task" : "New Task"}
          </span>
          <FontAwesomeIcon
            icon={faXmark}
            className={styles.closeIcon}
            onClick={onClose}
          />
        </div>

        <input
          name="title"
          className={styles.inputMain}
          value={taskData.title}
          onChange={handleChange}
          placeholder="Task name"
        />
        <textarea
          name="description"
          className={styles.textarea}
          value={taskData.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <div className={styles.row}>
          <label>List</label>
          <select
            name="listId"
            className={styles.select}
            value={taskData.listId}
            onChange={handleChange}
          >
            <option value="">None</option>
            {activeLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.nameList}
              </option>
            ))}
          </select>
        </div>

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

        <div className={styles.row}>
          <label>Tags</label>
          <div className={styles.tagGroup}>
            {activeTags.map((tag) => (
              <span
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`${styles.tagBadge} ${taskData.tagIds.includes(tag.id) ? styles.activeTag : ""}`}
                style={{ backgroundColor: tag.color, color: "white" }}
              >
                {tag.nameTag}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.subtasksSection}>
          <h3 className={styles.subtaskTitle}>Subtasks:</h3>
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
          <div className={styles.subtaskList}>
            {subtasks.map((sub, index) => (
              <div key={index} className={styles.subtaskItem}>
                <input
                  type="checkbox"
                  id={`sub-${index}`}
                  className={styles.checkbox}
                  checked={sub.completed}
                  onChange={() => handleToggleSubtask(index)}
                />
                <label htmlFor={`sub-${index}`}>{sub.title}</label>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.deleteBtn} type="button">
            Delete Task
          </button>
          <button type="button" className={styles.saveBtn} onClick={handleSave}>
            {task?.id ? "Update Changes" : "Save Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormTask;
