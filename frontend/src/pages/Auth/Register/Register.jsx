import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Dùng để chuyển trang sau khi đăng ký xong
import { register } from "../../../api/auth"; // Nhớ kiểm tra đúng đường dẫn đến file api/auth
import styles from "./Register.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  // 1. Khai báo State để quản lý dữ liệu Form
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Hàm xử lý gửi Form (Submit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Gọi hàm register từ lớp API đã chuẩn bị
      const response = await register(formData);

      alert("Đăng ký thành công! Chào mừng bạn đến với ORGANIC MIND.");

      // Chuyển hướng người dùng sang trang Login
      navigate("/login");
    } catch (err) {
      // Lấy message lỗi từ Backend trả về (ví dụ: "Username đã tồn tại")
      const errorMsg =
        err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Bên trái: Giữ nguyên UI của bạn */}
        <div className={styles.leftSide}>
          <div className={styles.brand}>
            <div className={styles.logoIcon}>✦</div>
            <span>ORGANIC MIND</span>
          </div>
          <div className={styles.contentLeft}>
            <h1>
              Đơn giản hóa mỗi ngày của bạn.{" "}
              <span className={styles.highlight}>Một cách tự nhiên.</span>
            </h1>
            <p>
              Kho lưu trữ sống cho suy nghĩ, công việc và những ý tưởng sáng tạo
              của bạn. Được thiết kế để đồng hành cùng bạn.
            </p>
          </div>
          <div className={styles.socialProof}>
            <div className={styles.avatarGroup}>
              <img src="https://i.pravatar.cc/150?u=1" alt="user" />
              <img src="https://i.pravatar.cc/150?u=2" alt="user" />
              <img src="https://i.pravatar.cc/150?u=3" alt="user" />
            </div>
            <span>THAM GIA CÙNG 12K+ NGƯỜI DÙNG</span>
          </div>
        </div>

        {/* Bên phải: Form đăng ký đã gắn logic */}
        <div className={styles.rightSide}>
          <div className={styles.formHeader}>
            <h2>Tạo tài khoản</h2>
            <p>Bước vào không gian số mới của bạn.</p>
          </div>

          <div className={styles.socialActions}>
            <button className={styles.socialBtn}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg"
                alt="fb"
              />
              Tiếp tục với Facebook
            </button>
          </div>

          <div className={styles.divider}>
            <span>HOẶC DÙNG EMAIL</span>
          </div>

          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div
              style={{
                color: "#ff4d4d",
                marginBottom: "15px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {error}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>HỌ VÀ TÊN</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                required
              />
            </div>

            {/* Thêm Username cho khớp với Backend */}
            <div className={styles.inputGroup}>
              <label>TÊN ĐĂNG NHẬP</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="nguyenvana123"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>ĐỊA CHỈ EMAIL</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@example.com"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>MẬT KHẨU</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>

            <div className={styles.terms}>
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                Tôi đồng ý với <b>Điều khoản dịch vụ</b> và{" "}
                <b>Chính sách bảo mật</b>.
              </label>
            </div>

            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Bắt đầu"}
            </button>
          </form>

          <p className={styles.footerLink}>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
