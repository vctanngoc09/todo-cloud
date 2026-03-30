import DateTimeUtils from "../../utils/DateTimeUtils";
import styles from "./HeaderMain.module.css";

function HeaderMain() {
  const today = DateTimeUtils.formatDateVN(DateTimeUtils.now());
  return (
    <div className={styles.wrapper}>
      <span> {today}</span>
    </div>
  );
}
export default HeaderMain;
