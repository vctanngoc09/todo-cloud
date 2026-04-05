import { Navigate, Outlet } from "react-router-dom";
import { AuthService } from "../services/auth.service";

const ProtectedRoute = () => {
  // Nếu chưa đăng nhập thì đá về trang login
  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập thì cho phép vào xem nội dung (Home)
  return <Outlet />;
};

export default ProtectedRoute;
