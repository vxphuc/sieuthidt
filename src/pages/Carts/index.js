import styles from "./Carts.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Carts() {
  let navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const getcookie = (name) => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split("=");
      if (key === name) {
        return value;
      }
    }
  };

  const token = getcookie("authToken");

  useEffect(() => {
    axios
      .get("https://web-dt.onrender.com/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  console.log(product);

  return (
    <div className={`container ${styles.container} `}>
      <div className={`${styles.bg_black_20}`}>
        <main>
          <div className={`${styles.carts} container`}>
            <div className={`${styles.titleCarts}`}>
              <div className={`${styles.iconTitlecarts}`}>
                <span onClick={() => navigate(-1)}>
                  <FontAwesomeIcon icon={faChevronLeft} size="lg" />
                </span>
              </div>
              <span>Giỏ hàng</span>
            </div>
            <div className={`${styles.bg_transparent}`}>
              <div className={`${styles.address}`}>
                <div className={`${styles.pick_up_store}`}>
                  <div className={`${styles.chose_address}`}>giao đến</div>
                  <div className={`${styles.address_user}`}>
                    <span>
                      <NavLink>Đổi</NavLink>
                    </span>
                    <div className={`${styles.pb4}`}>
                      <p>12vdt, Xã Vĩnh Trung, TP. Nha Trang, Khánh Hòa</p>
                      <div className={`${styles.textBasic}`}>
                        <div className={`${styles.name}`}>Anh Vinh</div>
                        <div>0911147616</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {product.map((item, index) => {
              const price = Number.parseFloat(item.product.price.$numberDecimal);
              return (
                <div key={index}>
                  <div className={`${styles.listCarts}`}>
                    <div className={`${styles.nameproduct}`}>
                      <img
                        src={item.product.image[0]}
                        alt="anh1"
                      ></img>
                      <div className={styles.productInfo}>
                        <p className={styles.productName}>
                          {item.product.name}
                        </p>
                      </div>
                    </div>
                    <div className={`${styles.content}`}>
                      <p>Giá tiền: {(price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                      <button className={`${styles.tru}`}>-</button>
                      <input type="number" value={item.quantity} min="1" max="99"></input>
                      <button className={`${styles.cong}`}>+</button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className={`${styles.delete}`}>
              <button>Xóa tất cả</button>
            </div>
            <div className={`${styles.payment}`}>
              <h3>Thông tin thanh toán</h3>
              <table className={`${styles.table}`}>
                <tbody>
                  <tr>
                    <td>Tổng tiền</td>
                    <td>100.000₫</td>
                  </tr>
                  <tr>
                    <td>Điểm: </td>
                    <td>100.000đ</td>
                  </tr>
                  <tr>
                    <td>Tổng đơn hàng</td>
                    <td>100.000₫</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={`${styles.description}`}>
              <p>Nhập mô tả đơn hàng</p>
              <textarea
                rows="4"
                cols="77"
                placeholder="Nhập yêu cầu của bạn (nếu có)"
              ></textarea>
            </div>
            <footer>
              <button>
                <span className={styles.orderText}>Đặt hàng:</span>
                <span className={styles.orderPrice}>100.000đ</span>
              </button>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Carts;
