import styles from "./FormTask.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faClock, faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { getAllListsActive } from "../../api/list";
import { getTagsByUserId } from "../../api/tag";
import { AuthService } from "../../services/auth.service";
import { useEffect, useState } from "react";
import AddSubtaskForm from "../AddSubtaskForm/AddSubtaskForm";
import { createTask, updateTask } from "../../api/task";
function FormTask({ task, onClose, onSaveSuccess }) {
  const [lists, setLists] = useState([]);
  const [tags, setTags] = useState([]);

  const user = AuthService.getUser();
  const userId = user?.id;

  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [subtasks, setSubtasks] = useState(task?.subTasks || []);

  // 🔥 FORM DATA
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    listId: "",
    dueDate: "",
    dueTime: "00:00",
    tagIds: [],
  });

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

  const handleAddSubtaskUI = (title) => {
    const newSub = {
      id: null, // id null để BE biết đây là subtask mới cần tạo
      title: title,
      completed: false,
    };
    setSubtasks((prev) => [...prev, newSub]);
    setShowSubtaskForm(false);
  };

  const handleToggleSubtask = (index) => {
    setSubtasks((prev) =>
      prev.map((sub, i) =>
        i === index ? { ...sub, completed: !sub.completed } : sub,
      ),
    );
  };

  // =============================
  // FETCH LIST
  // =============================
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await getAllListsActive();
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
      subtasks: subtasks,
    };

    try {
      let response;
      if (task?.id) {
        // CHẾ ĐỘ CẬP NHẬT
        console.log("Đang cập nhật Task:", task.id, payload);
        response = await updateTask(task.id, payload);
      } else {
        // CHẾ ĐỘ TẠO MỚI
        console.log("Đang tạo Task mới:", payload);
        response = await createTask(payload);
      }

      if (response) {
        alert(task?.id ? "Cập nhật thành công!" : "Tạo Task thành công!");
        if (onSaveSuccess) onSaveSuccess(); // Refresh danh sách ở Today.js
        onClose();
      }
    } catch (error) {
      console.error("Lỗi khi lưu Task:", error);
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        {/* HEADER */}
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
            {subtasks.map((sub, index) => (
              <div key={index} className={styles.subtaskItem}>
                <input
                  type="checkbox"
                  id={`sub-${index}`}
                  className={styles.checkbox}
                  checked={sub.completed} // Dùng checked thay vì defaultChecked
                  onChange={() => handleToggleSubtask(index)} // Gọi hàm toggle khi click
                />
                <label htmlFor={`sub-${index}`}>{sub.title}</label>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
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
