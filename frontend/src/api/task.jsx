import axiosInstance from "./axiosInstance";

// API tạo Task kèm Subtasks và Tags
export const createTask = (taskData) => {
  // taskData bao gồm: title, description, dueDate, listId, tagIds, subtasks
  return axiosInstance.post("/tasks", taskData);
};
export const getTasksByDate = async (date) => {
  try {
    console.log("Gọi API getTasksByDate với date:", date);
    const response = await axiosInstance.get(`/tasks/by-date?date=${date}`);
    console.log("Response từ API:", response);
    return response; // Trả về response object có chứa data
  } catch (error) {
    console.error("Lỗi trong getTasksByDate:", error);
    console.error("Error response:", error.response);
    console.error("Error message:", error.message);
    // Trả về object có cấu trúc tương tự để tránh lỗi
    return { data: [] };
  }
};
// Các hàm bổ sung sau này
export const getTasks = () => axiosInstance.get("/tasks");
