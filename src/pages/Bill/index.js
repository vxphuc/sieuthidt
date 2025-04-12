import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";

function Bill() {
  const [bills, setBills] = useState([]);

  //lấy token
  const getToken = (name) => {
    const cokkies = document.cookie.split(";");
    for (const cookie of cokkies) {
      const [key, value] = cookie.trim().split("=");
      if (key === name) {
        return value;
      }
      return null;
    }
  };

  const Token = getToken("authToken");

  useEffect(() => {
    const fetchBills = async () => {
      const response = await axios.get("https://web-dt.onrender.com/bill/user", {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      setBills(response.data);
    };

    fetchBills();
  }, []);

  console.log(bills);
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
                    src="https://res.cloudinary.com/dlqxlgre4/image/upload/v1743492660/products/q4fn4lztuuvqowz01csu.webp"
                    alt="product"
                  />
                  <div className={styles.orderText}>
                    {`
                      ${bill.road} - ${bill.ward} - ${bill.District} - ${bill.province}`}
                  </div>
                </div>

                <div className={styles.orderActions}>
                  <span className={styles.status}>Đã giao hàng</span>
                  <span className={styles.total}>Tổng tiền: 120.000đ</span>
                  <button className={styles.detailBtn}>Xem chi tiết</button>
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
