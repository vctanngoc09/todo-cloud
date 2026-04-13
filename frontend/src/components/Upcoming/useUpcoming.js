import { useState, useMemo, useCallback, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { AuthService } from "../../services/auth.service";

// ── Date helpers ──────────────────────────────────────────────────────────────
const toDate = (s) => (s ? new Date(s) : null);

const formatTime = (s) => {
  if (!s) return "";
  return new Date(s).toLocaleTimeString("vi-VN", {
    hour:   "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const isSameDay = (d1, d2) =>
  d1.getDate()     === d2.getDate()  &&
  d1.getMonth()    === d2.getMonth() &&
  d1.getFullYear() === d2.getFullYear();

const isToday = (s) => {
  const d = toDate(s);
  return !!d && isSameDay(d, new Date());
};

const isTomorrow = (s) => {
  const d = toDate(s);
  if (!d) return false;
  const tom = new Date();
  tom.setDate(tom.getDate() + 1);
  return isSameDay(d, tom);
};

const isThisWeek = (s) => {
  const d = toDate(s);
  if (!d) return false;
  const now = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 7);
  return d > now && d <= end && !isToday(s) && !isTomorrow(s);
};

// ── Normalise TaskDetailResponse → shape dùng trong UI ───────────────────────
const normalise = (raw) => ({
  id:          raw.id,
  title:       raw.title,
  description: raw.description ?? "",
  completed:   raw.completed   ?? false,
  dueDate:     raw.dueDate,
  time:        formatTime(raw.dueDate),
  listId:      raw.listId    ?? null,
  nameList:    raw.nameList  ?? "",
  listColor:   raw.listColor ?? null,
  tags: (raw.tags ?? []).map((t) => ({
    id:      t.id,
    nameTag: t.nameTag,
    color:   t.color,
    active:  t.active,
  })),
  subTasks: (raw.subTasks ?? []).map((s) => ({
    id:        s.id,
    title:     s.title,
    completed: s.completed,
    taskId:    s.taskId ?? raw.id,
  })),
});

// ─────────────────────────────────────────────────────────────────────────────
export function useUpcoming() {
  const [tasks,   setTasks]   = useState([]);
  const [tags,    setTags]    = useState([]);
  const [lists,   setLists]   = useState([]);
  const [filter,  setFilter]  = useState("all");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const user   = AuthService.getUser();
  const userId = user?.id;

  // ── Load lần đầu ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("Chưa đăng nhập");
      return;
    }

    const fetchAll = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        const [taskList, tagList, listData] = await Promise.all([
          axiosInstance.get(`/tasks/week?date=${today}`),
          axiosInstance.get(`/tags/active/${userId}`),
          axiosInstance.get(`/lists`),
        ]);

        // Fetch detail song song — wrap từng call để 1 task lỗi không crash toàn bộ
        const details = await Promise.all(
          taskList.map((t) =>
            axiosInstance.get(`/tasks/${t.id}`).catch((err) => {
              console.error(`Lỗi fetch detail task ${t.id}:`, err);
              return null; // trả về null thay vì throw
            })
          )
        );

        setTags(tagList);
        setLists(listData);
        setTasks(details.filter(Boolean).map(normalise)); // bỏ qua task null
      } catch (err) {
        const msg = err?.response?.data?.message ?? err?.message ?? "Lỗi kết nối server";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userId]);

  // ── Tag: tạo mới ─────────────────────────────────────────────────────────────
  const addTag = useCallback(
    async ({ nameTag, color }) => {
      const created = await axiosInstance.post("/tags", {
        nameTag,
        color,
        userId,
        active: true,
      });
      setTags((prev) => [...prev, created]);
      return created;
    },
    [userId]
  );

  // ── Task: tạo mới ─────────────────────────────────────────────────────────────
  // Fix: listId phải là number (Long) — select trả về string → parse trước khi gửi
  const addTask = useCallback(async ({ title, date, time, tagIds = [], listId = null }) => {
    // Đảm bảo dueDate đúng format LocalDateTime: "2026-04-12T09:00:00"
    const timePart = time.length === 5 ? `${time}:00` : time; // "09:00" → "09:00:00"
    const dueDate  = `${date}T${timePart}`;

    // listId từ <select> là string → parse sang number, null nếu rỗng
    const parsedListId = listId && listId !== "" ? Number(listId) : null;

    // tagIds đảm bảo là array of number
    const parsedTagIds = (tagIds ?? []).map(Number).filter(Boolean);

    try {
      const created = await axiosInstance.post("/tasks", {
        title,
        description: "",
        dueDate,
        listId:   parsedListId,
        subtasks: [],          // List<SubTaskRequest> rỗng
        tagIds:   parsedTagIds,
      });

      // created = TaskResponse (không có tags/subTasks)
      // → fetch TaskDetailResponse để có đủ data cho card
      const detail = await axiosInstance.get(`/tasks/${created.id}`).catch((err) => {
        console.error("Fetch detail sau khi tạo task thất bại:", err);
        // Fallback: dùng TaskResponse đã có, bổ sung fields còn thiếu
        return {
          ...created,
          tags:     [],
          subTasks: [],
        };
      });

      setTasks((prev) => [...prev, normalise(detail)]);
    } catch (err) {
      // Ném lỗi lên để AddForm / FormTask có thể bắt và hiện thông báo
      const msg = err?.response?.data ?? err?.message ?? "Tạo task thất bại";
      throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  }, []);

  // ── Task: xóa ─────────────────────────────────────────────────────────────────
  const deleteTask = useCallback(async (id) => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
    } catch (err) {
      console.error("Xóa task thất bại:", err);
    }
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── SubTask: tạo mới ──────────────────────────────────────────────────────────
  const addSubTask = useCallback(async (taskId, { title }) => {
    try {
      const created = await axiosInstance.post("/subtasks", {
        title,
        taskId,
        completed: false,
      });
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, subTasks: [...t.subTasks, created] }
            : t
        )
      );
    } catch (err) {
      console.error("Thêm subtask thất bại:", err);
    }
  }, []);

  // ── SubTask: toggle completed ─────────────────────────────────────────────────
  const toggleSubTask = useCallback(async (taskId, subId) => {
    let currentSub = null;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextSubs = t.subTasks.map((s) => {
          if (s.id !== subId) return s;
          currentSub = s;
          return { ...s, completed: !s.completed };
        });
        return { ...t, subTasks: nextSubs };
      })
    );

    try {
      await axiosInstance.put(`/subtasks/${subId}`, {
        id:        subId,
        title:     currentSub?.title ?? "",
        taskId,
        completed: !currentSub?.completed,
      });
    } catch (err) {
      console.error("Toggle subtask thất bại, rollback:", err);
      // Rollback
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            subTasks: t.subTasks.map((s) =>
              s.id === subId ? { ...s, completed: !s.completed } : s
            ),
          };
        })
      );
    }
  }, []);

  // ── SubTask: xóa ──────────────────────────────────────────────────────────────
  const deleteSubTask = useCallback(async (taskId, subId) => {
    try {
      await axiosInstance.delete(`/subtasks/${subId}`);
    } catch (err) {
      console.error("Xóa subtask thất bại:", err);
    }
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, subTasks: t.subTasks.filter((s) => s.id !== subId) }
          : t
      )
    );
  }, []);

  const updateTaskUI = useCallback(async (taskId) => {
    try {
        const res = await axiosInstance.get(`/tasks/${taskId}`);
        const updatedTask = normalise(res);
        setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    } catch (err) {
        console.error("Lỗi cập nhật UI:", err);
    }
}, []);

  // ── Filter theo listId ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (filter === "all") return tasks;
    // So sánh dạng number để tránh "1" !== 1
    return tasks.filter((t) => Number(t.listId) === Number(filter));
  }, [tasks, filter]);

  // ── Grouped: today / tomorrow / week ─────────────────────────────────────────
  const grouped = useMemo(() => {
    const sort = (arr) =>
      [...arr].sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""));
    return [
      { key: "today",    label: "Hôm nay",  items: sort(filtered.filter((i) => isToday(i.dueDate)))    },
      { key: "tomorrow", label: "Ngày mai",  items: sort(filtered.filter((i) => isTomorrow(i.dueDate))) },
      { key: "week",     label: "Tuần này",  items: sort(filtered.filter((i) => isThisWeek(i.dueDate))) },
    ].filter((g) => g.items.length > 0);
  }, [filtered]);

  return {
    grouped, filter, setFilter,
    tags, lists, loading, error,
    addTag,
    addTask,    deleteTask,
    addSubTask, toggleSubTask, deleteSubTask,
    updateTaskUI,
  };
}