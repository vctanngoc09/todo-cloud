import axios from "axios";
import { AuthService } from "../services/auth.service";

// Sử dụng biến môi trường hoặc ghi đè trực tiếp nếu chưa có file .env
const baseURL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// INTERCEPTOR CHO REQUEST: Tự động gắn Token vào Header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      // Spring Boot yêu cầu format: "Bearer <token>"
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// INTERCEPTOR CHO RESPONSE: Trả về data trực tiếp và xử lý lỗi 401
axiosInstance.interceptors.response.use(
  (response) => response.data, // Bạn sẽ nhận được data trực tiếp, không cần .data nữa
  (error) => {
    if (error.response?.status === 401) {
      AuthService.logout(); // Token hết hạn hoặc giả mạo -> đá ra ngoài
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;