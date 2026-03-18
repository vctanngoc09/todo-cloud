import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout";
import styles from "./Home.module.css";
function Home() {
  return (
    <div className={styles.wrapper}>
      <DashboardLayout />
    </div>
  );
}
export default Home;
