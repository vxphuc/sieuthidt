import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

function Bill() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      const response = await axios.get("https://web-dt.onrender.com/bill/user", {
        withCredentials: true,
      });
      setBills(response.data);
    };

    fetchBills();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.addressBox}>
        <div className={styles.addressHeader}>
          <h3>Đơn hàng đã mua</h3>
        </div>

        <div className={styles.addressList}>
          {/* Đơn hàng 1 */}
          {bills.map((bill, index) => {
            return (
              <div key={index} className={styles.orderCard}>
                <div className={styles.orderInfo}>
                  <img
                    src={`${bill.products[0].img}`}
                    alt="product"
                  />
                  <div className={styles.orderText}>
                    {`
                      ${bill.road} - ${bill.ward} - ${bill.District} - ${bill.province}`}
                  </div>
                </div>

                <div className={styles.orderActions}>
                  <span className={styles.status}>{bill.OrderStatus}</span>
                  <span className={styles.total}>Tổng tiền: {bill.Intomoney}</span>
                  <NavLink to={`/thong-tin-khach-hang/hoa-don/${bill._id}`} className={styles.detailBtn}>Xem chi tiết</NavLink>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Bill;
