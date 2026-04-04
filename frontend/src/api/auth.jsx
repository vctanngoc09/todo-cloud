import axiosInstance from "./axiosInstance";
import { AuthService } from "../services/auth.service";

// 1. Hàm Đăng ký
export const register = (data) => {
  // data bao gồm: fullName, username, email, password
  return axiosInstance.post("/auth/signup", data);
};

// 2. Hàm Đăng nhập
export const login = async (credentials) => {
  // credentials bao gồm: username, password
  const res = await axiosInstance.post("/auth/login", credentials);

  // LƯU Ý: Backend Java trả về field "token" chứ không phải "accessToken"
  if (res.token) {
    AuthService.setToken(res.token);
    AuthService.setUser(res.user); // Object user lồng bên trong như ta đã sửa
  }
  return res;
};

// 3. Hàm Đăng xuất
export const logout = () => {
  AuthService.logout();
};
