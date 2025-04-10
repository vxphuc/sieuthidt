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
          <div className={`${styles.form__group}`}>
            <div className={`${styles.info}`}>
            <input type="radio" name="name" id="A"  className={styles.radio} value=""/>
            <label for="name">Anh A,</label>
            <label for="name">09999999</label><br/>
            </div>
            <div className={`${styles.change}`}>
              <button>Sửa</button>
              <button>Xóa</button>
            </div>
            <p className={`${styles.add}`}>nha thk zinh, 11,111</p>
          </div>
        </form>
        <form className={`${styles.form}`}>
          <div className={`${styles.form__group}`}>
            <div className={`${styles.info}`}>
            <input type="radio" name="name" id="A"  className={styles.radio} value=""/>
            <label for="name">Anh A,</label>
            <label for="name">09999999</label><br/>
            </div>
            <div className={`${styles.change}`}>
              <button>Sửa</button>
              <button>Xóa</button>
            </div>
            <p className={`${styles.add}`}>nha thk zinh, 11,111</p>
          </div>
        </form>
        <a className={`${styles.a}`} href="#">+ nhập địa chỉ khác</a>
        <div className={`${styles.role}`}>
          <button>Xác nhận</button>
        </div>
      </div>
    </div>
  );
}

export default Adress;
