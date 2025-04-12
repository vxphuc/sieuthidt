import styles from './Menuu.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from 'react-router-dom';
function Menu() {
  return (
    <div>
      {" "}
      <div className={`${styles.infomation}`}>
        <NavLink to='/thong-tin-khach-hang/hoa-don' className={`${styles.order}`}><FontAwesomeIcon icon={faReceipt} /> Đơn hàng đã mua</NavLink>
        <NavLink to='/thong-tin-khach-hang' className={`${styles.ifm}`}><FontAwesomeIcon icon={faAddressBook} /> Thông tin và địa chỉ</NavLink>
        <button className={`${styles.logout}`}>Đăng xuất</button>
        <button className={`${styles.point}`}>
          Tổng điểm tích lũy: 1000000
        </button>
      </div>
    </div>
  );
}

export default Menu;
