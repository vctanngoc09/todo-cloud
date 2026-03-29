import { useState } from "react";
import { useUpcoming } from "./useUpcoming";
import s from "./Upcoming.module.css";

const COLORS = ["#4f9cf9","#f97b4f","#a78bfa","#34d399","#f59e0b","#f43f5e","#06b6d4"];

function Card({ item, color, label, onDelete }) {
  const [out, setOut] = useState(false);
  const remove = () => { setOut(true); setTimeout(() => onDelete(item.id), 250); };
  return (
    <div className={`${s.card} ${out ? s.out : ""}`}>
      <div className={s.accent} style={{ background: color }} />
      <div className={s.body}>
        <div className={s.top}>
          <span className={s.badge} style={{ color, background: color + "18" }}>{label}</span>
          <span className={s.time}>{item.time}</span>
        </div>
        <p className={s.cardTitle}>{item.title}</p>
      </div>
      <button className={s.del} onClick={remove}>✕</button>
    </div>
  );
}

// Modal
function AddForm({ types, onAddItem, onAddType, onClose }) {
  const [title, setTitle] = useState("");
  const [date, setDate]   = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime]   = useState("09:00");
  const [type, setType]   = useState(types[0]?.key ?? "");
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState(COLORS[0]);
  const [showNew, setShowNew]   = useState(false);

  const submit = () => {
    if (!title.trim()) return;
    onAddItem({ title: title.trim(), date: new Date(date), time, type });
    onClose();
  };

  const addType = () => {
    if (!newLabel.trim()) return;
    const key = newLabel.trim().toLowerCase().replace(/\s+/g, "_");
    onAddType(key, newLabel.trim(), newColor);
    setType(key); setShowNew(false); setNewLabel("");
  };

  return (
    <div className={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.mHead}>
          <h2>Thêm lịch trình</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <input className={s.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề..." autoFocus />
        <div className={s.row}>
          <input className={s.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <input className={s.input} type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div className={s.row}>
          <select className={s.input} value={type} onChange={(e) => setType(e.target.value)}>
            {types.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
          <button className={s.ghost} onClick={() => setShowNew(!showNew)}>+ Loại</button>
        </div>
        {showNew && (
          <div className={s.newType}>
            <input className={s.input} placeholder="Tên loại..." value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
            <div className={s.colors}>
              {COLORS.map((c) => (
                <button key={c} className={s.dot} style={{ background: c, outline: newColor === c ? `2px solid ${c}` : "none", outlineOffset: "2px" }} onClick={() => setNewColor(c)} />
              ))}
            </div>
            <button className={s.ghost} onClick={addType}>Xác nhận</button>
          </div>
        )}
        <button className={s.submit} onClick={submit}>Thêm</button>
      </div>
    </div>
  );
}

export default function Upcoming() {
  const { grouped, filter, setFilter, types, addType, addItem, deleteItem } = useUpcoming();
  const [showForm, setShowForm] = useState(false);
  const getType = (key) => types.find((t) => t.key === key) ?? { color: "#888", label: key };

  return (
    <div className={s.page}>
      {/* Header */}
      <header className={s.header}>
        <div className={s.titleRow}>
          <h1>Lịch trình sắp tới</h1>
          <span className={s.dateStr}>{new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" })}</span>
        </div>
        <div className={s.filters}>
          <button className={`${s.btn} ${filter === "all" ? s.active : ""}`} onClick={() => setFilter("all")}>Tất cả</button>
          {types.map((t) => (
            <button key={t.key} className={`${s.btn} ${filter === t.key ? s.active : ""}`}
              style={filter === t.key ? { background: t.color + "22", borderColor: t.color + "66", color: "#000000" } : {}}
              onClick={() => setFilter(t.key)}>
              <span className={s.dot} style={{ background: t.color }} />{t.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className={s.main}>
        {grouped.length === 0 ? (
          <div className={s.empty}><p>◌</p><p>Không có lịch trình nào.</p></div>
        ) : grouped.map((g) => (
          <section key={g.key} className={s.group}>
            <div className={s.gLabel}><span>{g.label}</span><span className={s.count}>{g.items.length}</span></div>
            {g.items.map((item) => {
              const t = getType(item.type);
              return <Card key={item.id} item={item} color={t.color} label={t.label} onDelete={deleteItem} />;
            })}
          </section>
        ))}
      </main>

      <button className={s.fab} onClick={() => setShowForm(true)}>+</button>
      {showForm && <AddForm types={types} onAddItem={addItem} onAddType={addType} onClose={() => setShowForm(false)} />}
    </div>
  );
}
