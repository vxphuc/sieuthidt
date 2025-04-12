import styles from "./Infomation.module.css";

function Infomation() {
  return (
    <div className={`${styles.defin}`}>
      <div className={`${styles.def}`}>
        <div className={`${styles.infomation}`}>
          <button className={`${styles.order}`}>Đơn hàng đã mua</button>
          <button className={`${styles.ifm}`}>Thông tin và địa chỉ</button>
          <button className={`${styles.logout}`}>Đăng xuất</button>
          <button className={`${styles.point}`}>Tổng điểm tích lũy: 1000000</button>
        </div>
        <div className={`${styles.customer}`}>
          <h3>Thông tin cá nhân</h3>
          <p>Anh Zinh - 0773915146</p>
          <a href='#' className={`${styles.fix}`}>
            <span>Sửa</span>
          </a>
        </div>
        {/* <div className={`${styles.orderadd}`}>
          <h3>Địa chỉ nhận hàng</h3>
          <div>
            <p>111, Phường Bến Nghé, Quận 1, Hồ Chí Minh</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Infomation;
