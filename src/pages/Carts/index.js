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
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState([]);
  const [totalOrder, setTotalOrder] = useState(0);

  const [showPaymentMethod, setShowPaymentMethod] = useState(false); //đoạn ẩn hiện phương thức thanh toán

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
      .get("http://localhost:5000/sign-in/user-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProduct(response.data);
        setLoading(false);

        const totalPrice = response.data.reduce((acc, item) => {
          const price = Number.parseFloat(item.product.price.$numberDecimal);
          return acc + price * item.quantity;
        }, 0);
        setTotal(
          totalPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })
        );
        setTotalOrder(
          totalPrice.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })
        );
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (e) => {
    axios
      .delete(`http://localhost:5000/cart/delete/${e}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        navigate(0);
      });
  };

  const handleDeleteAll = () => {
    for (let i = 0; i < product.length; i++) {
      axios
        .delete(`http://localhost:5000/cart/delete/${product[i].product._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          navigate(0);
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
        });
    }
  };

  const handlechecker = (e) => {
    if (e.target.checked) {
      const totalPrice = product.reduce((acc, item) => {
        const price = Number.parseFloat(item.product.price.$numberDecimal);
        return acc + price * item.quantity;
      }, 0);
      setTotalOrder(
        (totalPrice - user.token).toLocaleString("vi-VN", {
          currency: "VND",
          style: "currency",
        })
      );
    }
    if (!e.target.checked) {
      const totalPrice = product.reduce((acc, item) => {
        const price = Number.parseFloat(item.product.price.$numberDecimal);
        return acc + price * item.quantity;
      }, 0);
      setTotalOrder(
        totalPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })
      );
    }
  };

  const handleAddition = async (id, e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/cart/updateincrease/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Gọi lại API giỏ hàng để cập nhật
      const response = await axios.get("http://localhost:5000/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setProduct(response.data);
  
      // Cập nhật tổng giá luôn
      const totalPrice = response.data.reduce((acc, item) => {
        const price = Number.parseFloat(item.product.price.$numberDecimal);
        return acc + price * item.quantity;
      }, 0);
      setTotal(
        totalPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })
      );
      setTotalOrder(
        totalPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })
      );
    } catch (error) {
      console.error("Lỗi khi tăng số lượng:", error);
    }
  };

  // Giảm số lượng sản phẩm trong giỏ hàng
  const subtraction = async (id,e) => {
    e.preventDefault();
   await axios
      .patch(`http://localhost:5000/cart/updateDecrease/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
    const response = await axios.get("http://localhost:5000/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const updatedCart = response.data;
    setProduct(updatedCart);

    // Cập nhật tổng giá 
    const totalPrice = updatedCart.reduce((acc, item) => {

      const price = Number.parseFloat(item.product.price.$numberDecimal);
      return(acc + price * item.quantity) 
      // return acc + price * item.quantity;
    }, 0);
    setTotal(
      totalPrice.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })
    );
    setTotalOrder(
      totalPrice.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })
    );
  }
 

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
                      <p>12vdt, Xã Vĩnh Trung, TP. Nha Trang, Khánh Hòa dha</p>
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
              const price = Number.parseFloat(
                item.product.price.$numberDecimal
              );
              return (
                <div key={index}>
                  <div className={`${styles.listCarts}`}>
                    <div className={`${styles.nameproduct}`}>
                      <button
                        onClick={() => handleDelete(item.product._id)}
                        className={`${styles.deletebtn}`}
                      >
                        x
                      </button>
                      <img src={item.product.image[0]} alt="anh1"></img>
                      <div className={styles.productInfo}>
                        <p className={styles.productName}>
                          {item.product.name}
                        </p>
                      </div>
                    </div>
                    <div className={`${styles.content}`}>
                      <p>
                        Giá tiền:{" "}
                        {(price * item.quantity).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                      <div className={styles.quantityControl}>
                        <button onClick={(e) => subtraction(item.product._id, e)} className={`${styles.tru}`}>-</button>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          max="99"
                        ></input>
                        <button type="button"
                          onClick={(e) => handleAddition(item.product._id, e)}
                          className={`${styles.cong}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className={`${styles.delete}`}>
              <button onClick={handleDeleteAll}>Xóa tất cả</button>
            </div>
            <div className={`${styles.payment}`}>
              <h3>Thông tin thanh toán</h3>
              <table className={`${styles.table}`}>
                <tbody>
                  <tr>
                    <td>Tổng tiền</td>
                    <td>{total}</td>
                  </tr>

                  <tr>
                    <td>
                      <input onClick={handlechecker} type="checkbox"></input>{" "}
                      {`sử dụng${user.token} điểm`}
                    </td>
                  </tr>
                  <tr>
                    <td>Tổng đơn hàng</td>
                    <td>{totalOrder}</td>
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

            <div className={styles.stickyFooter}>
              <div className={styles.footerActions}>

                {/* xử lý chọn phương thức thanh toán */}
                <button
                  className={styles.paybtn}
                  onClick={() => setShowPaymentMethod(!showPaymentMethod)}
                >
                  Đổi hình thức thanh toán^
                </button>

                {showPaymentMethod && (
                  <div className={styles.paymentPopup}>
                    <ul>
                      <li><input type="radio" name="payment" /> Tiền mặt khi nhận hàng</li>
                      <li><input type="radio" name="payment" /> Thanh toán qua ngân hàng</li>
                    </ul>
                  </div>
                )}
                {/* kết thúc xử lý */}

                <button className={styles.btn}>
                  <span className={styles.orderText}>Đặt hàng:</span>
                  <span className={styles.orderPrice}>{totalOrder}</span>
                </button>
              </div>
            </div>


          </div>
        </main>
      </div>
    </div>
  );
}

export default Carts;
