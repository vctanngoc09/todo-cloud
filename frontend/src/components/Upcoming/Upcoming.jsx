// Upcoming.jsx
// Header filter bar hiển thị TodoList của user (không phải type cố định).
// Card: accent color = listColor, badge list + badge tags, subtask expandable.
// AddForm: chọn list (dropdown) + chọn tag (chip) + tạo tag mới (AddTagForm inline).

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faChevronDown,
  faChevronUp,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useUpcoming } from "./useUpcoming";
import s from "./Upcoming.module.css";
import AddTagForm from "../AddTagForm/AddTagForm"; // điều chỉnh path
import FormTask from "../FormTask/FormTask";

// ── Card ─────────────────────────────────────────────────────────────────────
function Card({ item, onDelete, onAddSubTask, onToggleSubTask, onDeleteSubTask, onClick }) {
  const [out, setOut]             = useState(false);
  const [expanded, setExpanded]   = useState(false);
  const [addingRow, setAddingRow] = useState(false);
  const [newSub, setNewSub]       = useState("");

  const remove = () => {
    setOut(true);
    setTimeout(() => onDelete(item.id), 250);
  };

  const submitSub = async () => {
    if (!newSub.trim()) return;
    await onAddSubTask(item.id, { title: newSub.trim() });
    setNewSub("");
    setAddingRow(false);
  };

  const subTasks  = item.subTasks ?? [];
  const doneCount = subTasks.filter((s) => s.completed).length;

  // Màu accent: ưu tiên listColor → tag đầu tiên → xám
  const accent = item.listColor ?? item.tags?.[0]?.color ?? "#ccc";

  return (
    <div className={`${s.card} ${out ? s.out : ""}`} onClick={() => onClick(item)}>
      <div className={s.accent} style={{ background: accent }} />

      <div className={s.body}>
        {/* Badges + time */}
        <div className={s.top}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", flex: 1 }}>
            {/* List badge */}
            {item.nameList && (
              <span
                className={s.badge}
                style={{
                  color:      item.listColor ?? "#555",
                  background: (item.listColor ?? "#888") + "20",
                  fontWeight: 600,
                }}
              >
                {item.nameList}
              </span>
            )}
            {/* Tag badges */}
            {item.tags.map((tag) => (
              <span
                key={tag.id}
                className={s.badge}
                style={{ color: tag.color, background: tag.color + "18" }}
              >
                {tag.nameTag}
              </span>
            ))}
          </div>
          <span className={s.time}>{item.time}</span>
        </div>

        {/* Title */}
        <p className={s.cardTitle}>{item.title}</p>

        {/* Subtask toggle — chỉ hiện khi đã có subtask */}
        {subTasks.length > 0 && (
          <button className={s.subToggle} onClick={() => setExpanded((v) => !v)}>
            <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
            <span>{doneCount}/{subTasks.length} subtask</span>
          </button>
        )}

        {/* Subtask list */}
        {expanded && (
          <div className={s.subList}>
            {subTasks.map((sub) => (
              <div key={sub.id} className={s.subItem}>
                <input
                  type="checkbox"
                  checked={sub.completed}
                  onChange={() => onToggleSubTask(item.id, sub.id)}
                />
                <span
                  style={{
                    flex:           1,
                    textDecoration: sub.completed ? "line-through" : "none",
                    color:          sub.completed ? "#aaa" : "inherit",
                  }}
                >
                  {sub.title}
                </span>
                <button
                  className={s.subDel}
                  onClick={() => onDeleteSubTask(item.id, sub.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}

            {/* Inline add subtask */}
            {addingRow ? (
              <div className={s.subAdd}>
                <input
                  autoFocus
                  className={s.subInput}
                  placeholder="Tên subtask..."
                  value={newSub}
                  onChange={(e) => setNewSub(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")  submitSub();
                    if (e.key === "Escape") setAddingRow(false);
                  }}
                />
                <button className={s.subConfirm} onClick={submitSub}>✓</button>
                <button className={s.subCancel} onClick={() => setAddingRow(false)}>✕</button>
              </div>
            ) : (
              <button className={s.subAddBtn} onClick={() => setAddingRow(true)}>
                <FontAwesomeIcon icon={faPlus} /> Thêm subtask
              </button>
            )}
          </div>
        )}

        {/* Nút mở subtask khi chưa có */}
        {!expanded && subTasks.length === 0 && (
          <button
            className={s.subAddBtn}
            onClick={() => { setExpanded(true); setAddingRow(true); }}
          >
            <FontAwesomeIcon icon={faPlus} /> Thêm subtask
          </button>
        )}
      </div>

      <button className={s.del} onClick={(e) => { e.stopPropagation(); remove(); }}>✕</button>
    </div>
  );
}

// ── AddForm ───────────────────────────────────────────────────────────────────
function AddForm({ tags, lists, onAddTask, onAddTag, onClose }) {
  const [title, setTitle]                   = useState("");
  const [date, setDate]                     = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime]                     = useState("09:00");
  const [selectedListId, setSelectedListId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [showTagForm, setShowTagForm]       = useState(false);

  const toggleTag = (id) =>
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const submit = async () => {
    if (!title.trim()) return;
    await onAddTask({
      title:  title.trim(),
      date,
      time,
      tagIds: selectedTagIds,
      listId: selectedListId ? Number(selectedListId) : null,
    });
    onClose();
  };

  // Khi AddTagForm tạo tag mới → tự chọn tag đó trong form
  const handleAddTag = async (payload) => {
    const created = await onAddTag(payload);
    if (created?.id) {
      setSelectedTagIds((prev) => [...prev, created.id]);
    }
  };

  return (
    <div className={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.mHead}>
          <h2>Thêm lịch trình</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Tiêu đề */}
        <input
          className={s.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề..."
          autoFocus
        />

        {/* Ngày + giờ */}
        <div className={s.row}>
          <input
            className={s.input}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            className={s.input}
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        {/* Chọn List */}
        <select
          className={s.input}
          value={selectedListId}
          onChange={(e) => setSelectedListId(e.target.value)}
        >
          <option value="">-- Không có List --</option>
          {lists.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nameList}
            </option>
          ))}
        </select>

        {/* Chọn Tag đã có (chip) */}
        {tags.length > 0 && (
          <div className={s.tagPicker}>
            {tags.map((tag) => (
              <button
                key={tag.id}
                className={`${s.tagChip} ${selectedTagIds.includes(tag.id) ? s.tagChipActive : ""}`}
                style={
                  selectedTagIds.includes(tag.id)
                    ? { background: tag.color + "33", borderColor: tag.color, color: tag.color }
                    : {}
                }
                onClick={() => toggleTag(tag.id)}
              >
                {tag.nameTag}
              </button>
            ))}
          </div>
        )}

        {/* Toggle AddTagForm inline */}
        {!showTagForm && (
          <button className={s.ghost} onClick={() => setShowTagForm(true)}>
            + Thêm nhãn mới
          </button>
        )}

        {showTagForm && (
          <AddTagForm
            inline
            onAdd={handleAddTag}
            onClose={() => setShowTagForm(false)}
          />
        )}

        <button className={s.submit} onClick={submit}>Thêm</button>
      </div>
    </div>
  );
}

// ── Render group helper ───────────────────────────────────────────────────────
function Group({ groupKey, grouped, emptyMsg, cardProps }) {
  const g = grouped.find((x) => x.key === groupKey);
  if (!g || g.items.length === 0) {
    return (
      <div className={s.empty}>
        <FontAwesomeIcon icon={faClipboard} />
        <span>{emptyMsg}</span>
      </div>
    );
  }
  return (
    <div className={s.pane}>
      <div className={s.gLabel}>
        <span>{g.label}</span>
        <span className={s.count}>{g.items.length}</span>
      </div>
      {g.items.map((item) => (
        <Card key={item.id} item={item} {...cardProps} />
      ))}
    </div>
  );
}

// ── Upcoming page ─────────────────────────────────────────────────────────────
export default function Upcoming() {
  const {
    grouped, filter, setFilter,
    tags, lists, loading, error,
    addTag, addTask, deleteTask,
    updateTaskUI,
    addSubTask, toggleSubTask, deleteSubTask,
  } = useUpcoming();

  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleEditTask = (task) => {
    setSelectedTask(task);
  }

  const handleCloseEdit = () => {
    setSelectedTask(null);
  }

  // Props chung cho tất cả Card
  const cardProps = {
    onDelete:        deleteTask,
    onAddSubTask:    addSubTask,
    onToggleSubTask: toggleSubTask,
    onDeleteSubTask: deleteSubTask,
    onClick:         handleEditTask,
  };

  if (loading) {
    return (
      <div className={s.page} style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "#555c75" }}>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.page} style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ color: "#f97b4f" }}>Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className={s.page}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className={s.header}>
        <div className={s.titleRow}>
          <h1>Lịch trình sắp tới</h1>
          <span className={s.dateStr}>
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              day:     "numeric",
              month:   "long",
            })}
          </span>
        </div>

        {/* Filter bar — TodoList của user thay vì type cố định */}
        <div className={s.filters}>
          <button
            className={`${s.btn} ${filter === "all" ? s.active : ""}`}
            onClick={() => setFilter("all")}
          >
            Tất cả
          </button>

          {lists.map((list) => {
            const isActive = String(filter) === String(list.id);
            const color    = list.color ?? "#4f9cf9";
            return (
              <button
                key={list.id}
                className={`${s.btn} ${isActive ? s.active : ""}`}
                style={
                  isActive
                    ? { background: color + "22", borderColor: color + "66", color: "#000" }
                    : {}
                }
                onClick={() => setFilter(list.id)}
              >
                <span className={s.dot} style={{ background: color }} />
                {list.nameList}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <main className={s.main}>
        {grouped.length === 0 ? (
          <div className={s.empty}>
            <FontAwesomeIcon icon={faClipboard} />
            <span>Không có lịch trình nào.</span>
          </div>
        ) : (
          <div className={s.splitlayout}>
            <div className={s.leftcol}>
              <div className={s.today}>
                <Group
                  groupKey="today"
                  grouped={grouped}
                  emptyMsg="Không có lịch trình nào hôm nay"
                  cardProps={cardProps}
                />
              </div>
              <div className={s.tomorrow}>
                <Group
                  groupKey="tomorrow"
                  grouped={grouped}
                  emptyMsg="Không có lịch trình nào ngày mai"
                  cardProps={cardProps}
                />
              </div>
            </div>
            <div className={s.rightcol}>
              <Group
                groupKey="week"
                grouped={grouped}
                emptyMsg="Không có lịch trình nào trong tuần"
                cardProps={cardProps}
              />
            </div>
          </div>
        )}
      </main>

      <button className={s.fab} onClick={() => setShowForm(true)}>+</button>

      {showForm && (
        <AddForm
          tags={tags}
          lists={lists}
          onAddTask={addTask}
          onAddTag={addTag}
          onClose={() => setShowForm(false)}
        />
      )}

      {selectedTask && (
        <div className={s.overlay} style={{alignItems: 'center'}}>
          <FormTask
            task={selectedTask}
            onClose={handleCloseEdit}
            onSaveSuccess={() => {
              updateTaskUI(selectedTask.id);
              handleCloseEdit();
            }}
          />
        </div>
      )}
    </div>
  );
}