import styles from "./styles.module.css";

function InvoiceDetails() {
  return (
    <div>
      <div className={`${styles.container}`}>
        <div className={`${styles.detailProduct}`}>
            <div className={`${styles.header}`}>
                <h3>Chi tiết đơn hàng aaaa - Chờ xác nhận</h3>
            </div>
            <div className={styles.info}>
                <div className={styles.infoBox}>
                    <div className={styles.user}>
                    <h5>Thông tin nhận hàng</h5>
                    <table>
                        <tbody>
                        <tr>
                            <td>Người nhận: </td>
                            <td>Anh thế zinh - 0773915146</td>
                        </tr>
                        <tr>
                            <td>Địa chỉ: </td>
                            <td>Nha trang, Khánh hòa Nha trang, Khánh hòa</td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                    <div className={styles.payment}>
                    <h5>Hình thức thanh toán</h5>
                    <p>Thanh toán khi nhận hàng</p>
                    </div>
                </div>
            </div>
            <div className={styles.listProduct}>
                <h5>Thông tin sản phẩm</h5>
                <div className={styles.infoProduct}>
                    <div className={styles.imgName}>
                        <img src="https://cdn.tgdd.vn/Products/Images/42/247507/samsung-galaxy-a52s-5g-mint-600x600.jpg" alt="anh"></img>
                        <p>tên sản phẩm 1 tên sản phẩm 1 tên sản phẩm 1</p>
                    </div>
                    <div className={styles.infoContent}>
                        <p>số lượng: 1</p>
                        <p>Tổng giá: 1.000.000đ</p>
                    </div>
                        
                </div>
            </div>
            <div className={styles.button}>
                <button className={styles.backHome}>Về trang danh sách đơn hàng</button>
                <button className={styles.cancelOrder}>Hủy đơn hàng</button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;
