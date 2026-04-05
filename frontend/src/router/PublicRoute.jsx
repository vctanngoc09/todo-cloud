import { Navigate, Outlet } from "react-router-dom";
import { AuthService } from "../services/auth.service";

const PublicRoute = () => {
  // Nếu đã đăng nhập rồi mà cố tình vào lại trang Login/Register
  // thì đá ngược về trang chủ (Home)
  if (AuthService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
