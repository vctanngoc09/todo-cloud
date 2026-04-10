import axiosInstance from "./axiosInstance";

// Lấy tất cả tag theo userId
export const getTagsByUserId = (userId) => {
  return axiosInstance.get(`/tags/user/${userId}`);
};
export const getActiveTagsByUserId = (userId) => {
  return axiosInstance.get(`/tags/active/${userId}`);
};
// Tạo tag mới
export const createTag = (data) => {
  // data: { nameTag, color, userId }
  return axiosInstance.post("/tags", data);
};

// Update tag
export const updateTag = (id, data) => {
  return axiosInstance.put(`/tags/${id}`, data);
};

// Delete tag
export const deleteTag = (id) => {
  return axiosInstance.delete(`/tags/${id}`);
};
