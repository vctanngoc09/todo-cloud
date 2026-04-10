import axiosInstance from "./axiosInstance";

// API tạo Task kèm Subtasks và Tags
export const createTask = (taskData) => {
  // taskData bao gồm: title, description, dueDate, listId, tagIds, subtasks
  return axiosInstance.post("/tasks", taskData);
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
