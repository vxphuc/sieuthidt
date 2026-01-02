import Header from "../../Layouts/DefaultLayout/Header";
import Footer from "../DefaultLayout/Footer";
import Sitebar from "./Sitebar";
import styles from './Layout.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
function AdminLayout({ children }) {
  return (
    <div className={styles.bodyContainer}>
      <div>
        <Header></Header>
      </div>
      <div className={`row`}>
        <div className= {`col-lg-2 ${styles.Sitebar1}`}>
          <Sitebar></Sitebar>
        </div>
        <div className= {`col-lg-9 ${styles.Sitebar2}`}>{children}</div>
      </div>
      <div>
        <Footer></Footer>
      </div>
    </div>
  );
}

export default AdminLayout;
