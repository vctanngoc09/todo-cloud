import axiosInstance from "./axiosInstance";

// Lấy tất cả danh sách của người dùng hiện tại (Token đã có trong axiosInstance)
export const getAllListsActive = () => {
  return axiosInstance.get("/lists/active");
};

export const getAllLists = () => {
  return axiosInstance.get("/lists");
};

// Tạo danh sách mới
export const createList = (data) => {
  // data: { nameList, color }
  return axiosInstance.post("/lists", data);
};

export const updateList = (id, data) => {
  return axiosInstance.put(`/lists/${id}`, data);
};

export const deleteList = (id) => {
  return axiosInstance.delete(`/lists/${id}`);
};
