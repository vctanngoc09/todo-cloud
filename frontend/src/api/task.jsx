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
  // date format: "yyyy-MM-dd"
  return axiosInstance.get("/tasks/by-date", {
    params: { date },
  });
};
export const getTaskDetail = (id) => {
  return axiosInstance.get(`/tasks/${id}`);
};
