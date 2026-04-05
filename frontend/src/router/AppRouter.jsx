import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function AppRouter() {
  return (
    <Routes>
      {/* 1. Nhóm PUBLIC: Chỉ cho phép vào khi CHƯA đăng nhập (Login, Register) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 2. Nhóm PROTECTED: Chỉ cho phép vào khi ĐÃ đăng nhập (Home, Profile...) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        {/* Bạn có thể thêm các trang khác như /todo, /profile ở trong cụm này */}
      </Route>

      {/* 3. Điều hướng mặc định nếu gõ sai URL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;