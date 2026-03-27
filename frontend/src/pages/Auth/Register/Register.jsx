import styles from "./Register.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function Register() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Bên trái: Banner với hiệu ứng Blur */}
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

          {/* Social Proof Section */}
          <div className={styles.socialProof}>
            <div className={styles.avatarGroup}>
              <img src="https://i.pravatar.cc/150?u=1" alt="user" />
              <img src="https://i.pravatar.cc/150?u=2" alt="user" />
              <img src="https://i.pravatar.cc/150?u=3" alt="user" />
            </div>
            <span>THAM GIA CÙNG 12K+ NGƯỜI DÙNG</span>
          </div>
        </div>

        {/* Bên phải: Form đăng ký */}
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

          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label>HỌ VÀ TÊN</label>
              <input type="text" placeholder="Nguyễn Văn A" />
            </div>

            <div className={styles.inputGroup}>
              <label>ĐỊA CHỈ EMAIL</label>
              <input type="email" placeholder="hello@example.com" />
            </div>

            <div className={styles.inputGroup}>
              <label>MẬT KHẨU</label>
              <div className={styles.passwordWrapper}>
                <input type="password" placeholder="••••••••" />
                <FontAwesomeIcon icon={faEye} className={styles.eyeIcon} />
              </div>
            </div>

            <div className={styles.terms}>
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">
                Tôi đồng ý với <b>Điều khoản dịch vụ</b> và{" "}
                <b>Chính sách bảo mật</b>.
              </label>
            </div>

            <button type="submit" className={styles.btnSubmit}>
              Bắt đầu
            </button>
          </form>

          <p className={styles.footerLink}>
            Đã có tài khoản? <a href="/login">Đăng nhập</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
