import styles from "./Login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons";
import bgLeft from "../../../assets/bgleft.png";

function Login() {
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

          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label>ĐỊA CHỈ EMAIL</label>
              <input type="email" placeholder="ten@vidu.com" />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label>MẬT KHẨU</label>
                <a href="#" className={styles.forgotPass}>
                  QUÊN MẬT KHẨU?
                </a>
              </div>
              <input type="password" placeholder="••••••••" />
            </div>

            <button type="submit" className={styles.btnSignIn}>
              Đăng nhập
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
