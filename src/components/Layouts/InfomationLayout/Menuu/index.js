import styles from './Menuu.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faReceipt } from "@fortawesome/free-solid-svg-icons";
function Menu() {
  return (
    <div>
      {" "}
      <div className={`${styles.infomation}`}>
        <button className={`${styles.order}`}><FontAwesomeIcon icon={faReceipt} /> Đơn hàng đã mua</button>
        <button className={`${styles.ifm}`}><FontAwesomeIcon icon={faAddressBook} /> Thông tin và địa chỉ</button>
        <button className={`${styles.logout}`}>Đăng xuất</button>
        <button className={`${styles.point}`}>
          Tổng điểm tích lũy: 1000000
        </button>
      </div>
    </div>
  );
}

export default Menu;
