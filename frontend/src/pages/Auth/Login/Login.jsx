import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../api/auth"; // Đường dẫn tới file api/auth.js chuyên nghiệp của bạn
import styles from "./Login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons";
import bgLeft from "../../../assets/bgleft.png";

function Login() {
  const navigate = useNavigate();

  // 1. Khai báo State quản lý dữ liệu nhập
  const [credentials, setCredentials] = useState({
    username: "", // Backend dùng field này để đăng nhập
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. Hàm xử lý khi gõ phím
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Hàm xử lý Đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Gọi hàm login từ lớp API chuyên nghiệp
      // Hàm này đã bao gồm logic: AuthService.setToken(res.token)
      await login(credentials);

      alert("Đăng nhập thành công! Chào mừng bạn trở lại.");

      // Chuyển hướng về trang chủ hoặc trang Dashboard
      navigate("/");
    } catch (err) {
      // Xử lý lỗi từ Backend (ví dụ: "Sai mật khẩu", "User không tồn tại")
      const errorMsg =
        err.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại!";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Bên trái: Banner */}
        <div
          className={styles.leftSide}
          style={{ backgroundImage: `url(${bgLeft})` }}
        >
          <div className={styles.brand}>
            <div className={styles.logoIcon}>
              <div className={styles.innerCircle}></div>
            </div>
            <span>Organic Mind</span>
          </div>

          <div className={styles.contentLeft}>
            <h1>
              Lưu trữ trọn vẹn{" "}
              <span className={styles.highlight}>Tâm trí bạn.</span>
            </h1>
            <p>
              Trở lại không gian kỹ thuật số của riêng bạn. Sắp xếp, quản lý và
              phát triển công việc mỗi ngày một cách tinh tế.
            </p>
          </div>
          <div className={styles.abstractShape}></div>
        </div>

        {/* Bên phải: Form đăng nhập */}
        <div className={styles.rightSide}>
          <div className={styles.formHeader}>
            <h2>Chào mừng trở lại</h2>
            <p>Tiếp tục hành trình của bạn từ nơi đã tạm dừng.</p>
          </div>

          {/* Hiển thị thông báo lỗi nếu có */}
          {error && (
            <div
              style={{
                color: "#ff4d4d",
                marginBottom: "15px",
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              {error}
            </div>
          )}

          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label>TÊN ĐĂNG NHẬP</label>
              <input
                type="text"
                name="username" // Khớp với state credentials
                value={credentials.username}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập của bạn"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label>MẬT KHẨU</label>
                <a href="#" className={styles.forgotPass}>
                  QUÊN MẬT KHẨU?
                </a>
              </div>
              <input
                type="password"
                name="password" // Khớp với state credentials
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className={styles.btnSignIn}
              disabled={loading}
            >
              {loading ? "Đang xác thực..." : "Đăng nhập"}
            </button>

            <div className={styles.divider}>
              <span>HOẶC TIẾP TỤC VỚI</span>
            </div>

            <div className={styles.socialButtons}>
              <button type="button" className={styles.socialBtn}>
                <FontAwesomeIcon
                  icon={faGoogle}
                  className={styles.googleIcon}
                />{" "}
                Google
              </button>
              <button type="button" className={styles.socialBtn}>
                <FontAwesomeIcon icon={faFacebookF} className={styles.fbIcon} />{" "}
                Facebook
              </button>
            </div>
          </form>

          <p className={styles.footerText}>
            Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
