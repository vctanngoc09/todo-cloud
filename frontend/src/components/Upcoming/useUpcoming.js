import { useState, useMemo, useCallback } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isSameDay = (d1, d2) =>
  d1.getDate() === d2.getDate() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getFullYear() === d2.getFullYear();

const isToday    = (date) => isSameDay(date, new Date());
const isTomorrow = (date) => {
  const tom = new Date();
  tom.setDate(tom.getDate() + 1);
  return isSameDay(date, tom);
};
const isThisWeek = (date) => {
  const end = new Date();
  end.setDate(end.getDate() + 7);
  return date > new Date() && date <= end && !isToday(date) && !isTomorrow(date);
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const today    = new Date();
const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
const next3    = new Date(); next3.setDate(today.getDate() + 3);

const INITIAL_ITEMS = [
  { id: 1, title: "Họp team sprint planning", date: today,    time: "09:00", type: "meeting"  },
  { id: 2, title: "Hoàn thiện UI trang Upcoming", date: today,    time: "10:30", type: "task"     },
  { id: 3, title: "Gửi báo cáo tuần",          date: today,    time: "12:00", type: "reminder" },
  { id: 4, title: "Workshop: UX Design Patterns", date: today,    time: "15:00", type: "event"    },
  { id: 5, title: "Code review PR #47",         date: tomorrow, time: "09:30", type: "task"     },
  { id: 6, title: "Demo sản phẩm với khách hàng", date: tomorrow, time: "14:00", type: "meeting"  },
  { id: 7, title: "Team building quý 2",        date: next3,   time: "08:00", type: "event"    },
];

// ─── Default type labels (người dùng có thể thêm) ────────────────────────────
export const DEFAULT_TYPES = [
  { key: "task",     label: "Task",      color: "#4f9cf9" },
  { key: "event",    label: "Sự kiện",   color: "#f97b4f" },
  { key: "meeting",  label: "Cuộc họp",  color: "#a78bfa" },
  { key: "reminder", label: "Nhắc nhở",  color: "#34d399" },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useUpcoming() {
  const [items, setItems]   = useState(INITIAL_ITEMS);
  const [filter, setFilter] = useState("all");
  const [types, setTypes]   = useState(DEFAULT_TYPES);

  // Thêm type label mới
  const addType = useCallback((key, label, color) => {
    if (!key || types.find((t) => t.key === key)) return;
    setTypes((prev) => [...prev, { key, label, color }]);
  }, [types]);

  // Thêm item mới
  const addItem = useCallback((item) => {
    setItems((prev) => [...prev, { ...item, id: Date.now() }]);
  }, []);

  // Xoá item
  const deleteItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  // Filtered
  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.type === filter)),
    [items, filter]
  );

  // Grouped theo ngày
  const grouped = useMemo(() => {
    const sort = (arr) => [...arr].sort((a, b) => a.time.localeCompare(b.time));
    return [
      { key: "today",    label: "Hôm nay",   items: sort(filtered.filter((i) => isToday(i.date)))    },
      { key: "tomorrow", label: "Ngày mai",   items: sort(filtered.filter((i) => isTomorrow(i.date))) },
      { key: "week",     label: "Tuần này",   items: sort(filtered.filter((i) => isThisWeek(i.date))) },
    ].filter((g) => g.items.length > 0); // ẩn nhóm rỗng
  }, [filtered]);

  return { grouped, filter, setFilter, types, addType, addItem, deleteItem };
}
