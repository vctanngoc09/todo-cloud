import axiosInstance from "./axiosInstance";

// API tạo Task kèm Subtasks và Tags
export const createTask = (taskData) => {
  // taskData bao gồm: title, description, dueDate, listId, tagIds, subtasks
  return axiosInstance.post("/tasks", taskData);
};

// Các hàm bổ sung sau này
export const getTasks = () => axiosInstance.get("/tasks");
