import axiosInstance from "./axiosInstance";

// API tạo Task kèm Subtasks và Tags
export const createTask = (taskData) => {
  // taskData bao gồm: title, description, dueDate, listId, tagIds, subtasks
  return axiosInstance.post("/tasks", taskData);
};

export const updateTask = (id, taskData) => {
  return axiosInstance.put(`/tasks/${id}`, taskData);
};

// Các hàm bổ sung sau này
export const getTodayTasks = () => {
  return axiosInstance.get("/tasks/today");
};
export const getTasksByDate = (date) => {
  return axiosInstance.get("/tasks/by-date", {
    params: { date },
  });
};
export const getTaskDetail = (id) => {
  return axiosInstance.get(`/tasks/${id}`);
};
export const getWeekTasks = (date) => {
  return axiosInstance.get("/tasks/week", {
    params: { date },
  });
};
export const getMonthTasks = (date) => {
  return axiosInstance.get("/tasks/month", {
    params: { date },
  });
};

export const toggleTaskStatus = async (taskId) => {
  return await axiosInstance.patch(`/tasks/${taskId}/toggle`);
};
export const toggleTaskCompleted = (id) => {
  return axiosInstance.put(`/tasks/update-completed/${id}`);
};