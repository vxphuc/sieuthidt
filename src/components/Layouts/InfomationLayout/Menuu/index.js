import styles from './Menuu.module.css';

function Menu() {
  return (
    <div>
      {" "}
      <div className={`${styles.infomation}`}>
        <button className={`${styles.order}`}>Đơn hàng đã mua</button>
        <button className={`${styles.ifm}`}>Thông tin và địa chỉ</button>
        <button className={`${styles.logout}`}>Đăng xuất</button>
        <button className={`${styles.point}`}>
          Tổng điểm tích lũy: 1000000
        </button>
      </div>
    </div>
  );
}

export default Menu;
