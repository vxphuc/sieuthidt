import styles from "./Adress.module.css";
import { useNavigate } from "react-router-dom";
import {
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Adress() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className={` container ${styles.container}`}>
        <div className={`${styles.title}`}>
          <div className={`${styles.items__center}`}>
            <span onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faChevronLeft} size="lg" />
            </span>
          </div>
          <span className={`${styles.title__text}`}>Thông tin nhận hàng</span>
        </div>
        <form className={`${styles.form}`}>
          <div className={`${styles.form__group}`}></div>
        </form>
      </div>
    </div>
  );
}

export default Adress;
