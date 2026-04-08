import styles from "./FormTask.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getAllLists } from "../../api/list";
import { getTagsByUserId } from "../../api/tag";
import { AuthService } from "../../services/auth.service";
import { useEffect, useState } from "react";

function FormTask({ task, onClose }) {
  const [lists, setLists] = useState([]);
  const [tags, setTags] = useState([]);

  const user = AuthService.getUser();
  const userId = user?.id;

  // 🔥 FORM DATA
  const [taskData, setTaskData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    listId: task?.todoList?.id || "",
    dueDate: task?.dueDate || "",
    tagIds: task?.tags?.map((t) => t.id) || [],
  });

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
          <input
            name="dueDate"
            type="date"
            className={styles.dateInput}
            value={taskData.dueDate}
            onChange={handleChange}
          />
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

          <button className={styles.addSubtask}>
            <FontAwesomeIcon icon={faPlus} className={styles.plusIcon} />
            <span>Add New Subtask</span>
          </button>

          <div className={styles.subtaskItem}>
            <input type="checkbox" id="sub1" className={styles.checkbox} />
            <label htmlFor="sub1">Subtask</label>
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.actions}>
          <button className={styles.deleteBtn}>Delete Task</button>
          <button
            className={styles.saveBtn}
            onClick={() => console.log("DATA:", taskData)}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormTask;