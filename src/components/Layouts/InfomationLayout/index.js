import Header from "../DefaultLayout/Header";
import Footer from "./Footer";
import Menu from "./Menuu";
import styles from "./styles.module.css";

function HeaderLayout({ children }) {
  return (
    <div>
      <Header />
      <div className={styles.container}>
        {/* Sidebar 30% */}
        <div className={styles.sidebar}>
          <Menu />
        </div>

        {/* Nội dung chính 70% */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HeaderLayout;
