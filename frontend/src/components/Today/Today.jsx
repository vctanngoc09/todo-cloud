import styles from "./Today.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import FormTask from "../FormTask/FormTask";
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
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.header}>
          <h1>Today</h1>
          <span className={styles.count}>5</span>
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
          <button
            className={styles.item}
            onClick={() => {
              setShowForm(true);
              setSelectedTask({
                title: "Consult accountant",
                description: "",
              });
            }}
          >
            <div className={styles.itemtop}>
              <div className={styles.itemleft}>
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.title}>Research content ideas</span>
              </div>
              <FontAwesomeIcon icon={faAngleRight} className={styles.icon} />
            </div>
            <div className={styles.itembottom}>
              {/* Phần ngày tháng */}
              <div className={styles.signature}>
                <FontAwesomeIcon
                  icon={faBusinessTime}
                  className={styles.icondeadline}
                />
                <span>22-03-22</span>
              </div>

              {/* Phần Subtasks */}
              <div className={styles.signature}>
                <span className={styles.badge}>1</span>
                <span>Subtasks</span>
              </div>

              {/* Phần Category */}
              <div className={styles.signature}>
                <div className={styles.colorBox}></div>
                <span>Personal</span>
              </div>
            </div>
          </button>

          <button
            className={styles.item}
            onClick={() => {
              setShowForm(true);
              setSelectedTask({
                title: "Consult accountant",
                description: "",
              });
            }}
          >
            <div className={styles.itemtop}>
              <div className={styles.itemleft}>
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.title}>Research content ideas</span>
              </div>
              <FontAwesomeIcon icon={faAngleRight} className={styles.icon} />
            </div>
            <div className={styles.itembottom}>
              {/* Phần ngày tháng */}
              <div className={styles.signature}>
                <FontAwesomeIcon
                  icon={faBusinessTime}
                  className={styles.icondeadline}
                />
                <span>22-03-22</span>
              </div>

              {/* Phần Subtasks */}
              <div className={styles.signature}>
                <span className={styles.badge}>1</span>
                <span>Subtasks</span>
              </div>

              {/* Phần Category */}
              <div className={styles.signature}>
                <div className={styles.colorBox}></div>
                <span>Personal</span>
              </div>
            </div>
          </button>

          <button
            className={styles.item}
            onClick={() => {
              setShowForm(true);
              setSelectedTask({
                title: "Consult accountant",
                description: "",
              });
            }}
          >
            <div className={styles.itemtop}>
              <div className={styles.itemleft}>
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.title}>Research content ideas</span>
              </div>
              <FontAwesomeIcon icon={faAngleRight} className={styles.icon} />
            </div>
            <div className={styles.itembottom}>
              {/* Phần ngày tháng */}
              <div className={styles.signature}>
                <FontAwesomeIcon
                  icon={faBusinessTime}
                  className={styles.icondeadline}
                />
                <span>22-03-22</span>
              </div>

              {/* Phần Subtasks */}
              <div className={styles.signature}>
                <span className={styles.badge}>1</span>
                <span>Subtasks</span>
              </div>

              {/* Phần Category */}
              <div className={styles.signature}>
                <div className={styles.colorBox}></div>
                <span>Personal</span>
              </div>
            </div>
          </button>

          <button
            className={styles.item}
            onClick={() => {
              setShowForm(true);
              setSelectedTask({
                title: "Consult accountant",
                description: "",
              });
            }}
          >
            <div className={styles.itemtop}>
              <div className={styles.itemleft}>
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.title}>Research content ideas</span>
              </div>
              <FontAwesomeIcon icon={faAngleRight} className={styles.icon} />
            </div>
            <div className={styles.itembottom}>
              {/* Phần ngày tháng */}
              <div className={styles.signature}>
                <FontAwesomeIcon
                  icon={faBusinessTime}
                  className={styles.icondeadline}
                />
                <span>22-03-22</span>
              </div>

              {/* Phần Subtasks */}
              <div className={styles.signature}>
                <span className={styles.badge}>1</span>
                <span>Subtasks</span>
              </div>

              {/* Phần Category */}
              <div className={styles.signature}>
                <div className={styles.colorBox}></div>
                <span>Personal</span>
              </div>
            </div>
          </button>

          <button
            className={styles.item}
            onClick={() => {
              setShowForm(true);
              setSelectedTask({
                title: "Consult accountant",
                description: "",
              });
            }}
          >
            <div className={styles.itemtop}>
              <div className={styles.itemleft}>
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.title}>Research content ideas</span>
              </div>
              <FontAwesomeIcon icon={faAngleRight} className={styles.icon} />
            </div>
            <div className={styles.itembottom}>
              {/* Phần ngày tháng */}
              <div className={styles.signature}>
                <FontAwesomeIcon
                  icon={faBusinessTime}
                  className={styles.icondeadline}
                />
                <span>22-03-22</span>
              </div>

              {/* Phần Subtasks */}
              <div className={styles.signature}>
                <span className={styles.badge}>1</span>
                <span>Subtasks</span>
              </div>

              {/* Phần Category */}
              <div className={styles.signature}>
                <div className={styles.colorBox}></div>
                <span>Personal</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className={styles.right}>
        {showForm && (
          <FormTask task={selectedTask} onClose={() => setShowForm(false)} />
        )}
      </div>
    </div>
  );
}
export default Today;
