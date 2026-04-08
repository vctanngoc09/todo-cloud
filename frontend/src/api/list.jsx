import axiosInstance from "./axiosInstance";

// Lấy tất cả danh sách của người dùng hiện tại (Token đã có trong axiosInstance)
export const getAllLists = () => {
  return axiosInstance.get("/lists");
};

// Tạo danh sách mới
export const createList = (data) => {
  // data: { nameList, color }
  return axiosInstance.post("/lists", data);
};
