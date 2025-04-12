import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

function Bill() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.addressBox}>
        <div className={styles.addressHeader}>
          <h3>Đơn hàng đã mua</h3>
        </div>

        <div className={styles.addressList}>
          {/* Đơn hàng 1 */}
          <div className={styles.orderCard}>
            <div className={styles.orderInfo}>
              <img
                src="https://res.cloudinary.com/dlqxlgre4/image/upload/v1743492660/products/q4fn4lztuuvqowz01csu.webp"
                alt="product"
              />
              <div className={styles.orderText}>
                123 Lê Lợi, Nha Trang 0773915146
              </div>
            </div>

            <div className={styles.orderActions}>
              <span className={styles.status}>Đã giao hàng</span>
              <span className={styles.total}>Tổng tiền: 120.000đ</span>
              <button className={styles.detailBtn}>Xem chi tiết</button>
            </div>
          </div>
          <div className={styles.orderCard}>
            <div className={styles.orderInfo}>
              <img
                src="https://res.cloudinary.com/dlqxlgre4/image/upload/v1743492660/products/q4fn4lztuuvqowz01csu.webp"
                alt="product"
              />
              <div className={styles.orderText}>
                123 Lê Lợi, Nha Trang 0773915146
              </div>
            </div>

            <div className={styles.orderActions}>
              <span className={styles.status}>Đã giao hàng</span>
              <span className={styles.total}>Tổng tiền: 120.000đ</span>
              <button className={styles.detailBtn}>Xem chi tiết</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bill;
