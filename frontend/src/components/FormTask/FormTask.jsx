import styles from "./FormTask.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";

function FormTask({ task, onClose }) {
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
          className={styles.inputMain}
          placeholder="Task name"
          defaultValue={task?.title || ""}
        />

        <textarea
          className={styles.textarea}
          placeholder="Description"
          defaultValue={task?.description || ""}
        />

        {/* Cấu trúc hàng ngang cho List, Date, Tags */}
        <div className={styles.row}>
          <label>List</label>
          <select className={styles.select}>
            <option>Personal</option>
            <option>Work</option>
            <option>Study</option>
          </select>
        </div>

        <div className={styles.row}>
          <label>Due date</label>
          <input type="date" className={styles.dateInput} />
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
          <button className={styles.saveBtn}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

export default FormTask;