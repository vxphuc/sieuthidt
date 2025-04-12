import Header from "../DefaultLayout/Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import Menu from "./Menuu";
import styles from "./styles.module.css";

function HeaderLayout({ children }) {
  return (
    <div>
      <div>
        <Header></Header>
      </div>
      <div className={`${styles.def}`}>
        <div>
          <Menu></Menu>
        </div>
        <div>{children}</div>
      </div>
      <div>
        <Footer></Footer>
      </div>
    </div>
  );
}

export default HeaderLayout;
