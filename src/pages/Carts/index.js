import styles from "./Carts.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faWallet } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CartsEmpty from "../../components/CartEmpty";

function Carts() {
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState({});
  const [totalOrder, setTotalOrder] = useState(0);
  const [address, setAddress] = useState([]);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [payMent, setPayMent] = useState("Tiền mặt khi nhận hàng");

  const getcookie = (name) => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split("=");
      if (key === name) return value;
    }
    return null;
  };

  const token = getcookie("authToken");

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(
        "https://dtweb.onrender.com/sign-in/user-profile",
        {
          withCredentials: true,
        }
      );
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get("https://dtweb.onrender.com/cart", {
        withCredentials: true,
      });
      const cartItems = res.data;
      setProduct(cartItems);
      const totalPrice = cartItems.carts.reduce(
        (acc, item) =>
          acc + parseFloat(item.product.price.$numberDecimal) * item.quantity,
        0
      );
      const formatted = totalPrice.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
      setTotal(formatted);
      setTotalOrder(formatted);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddress = async () => {
    try {
      const res = await axios.get("https://dtweb.onrender.com/cart/getAdd", {
        withCredentials: true,
      });
      setAddress(res.data);
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchCart();
    fetchAddress();
  }, []);

  const updateTotal = (items) => {
    const totalPrice = items.reduce(
      (acc, item) =>
        acc + parseFloat(item.product.price.$numberDecimal) * item.quantity,
      0
    );
    const formatted = totalPrice.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    setTotal(formatted);
    setTotalOrder(formatted);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://dtweb.onrender.com/cart/delete/${id}`, {
        withCredentials: true,
      });
      fetchCart();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await Promise.all(
        product.carts.map((item) =>
          axios.delete(
            `https://dtweb.onrender.com/cart/delete/${item.product._id}`,
            {
              withCredentials: true,
            }
          )
        )
      );
      fetchCart();
    } catch (err) {
      console.error("Error deleting all:", err);
    }
  };

  const handleQuantityChange = async (id, type) => {
    try {
      await axios.patch(
        `https://dtweb.onrender.com/cart/${type}/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      fetchCart();
    } catch (err) {
      console.error(`Error ${type} quantity:`, err);
    }
  };

  const handleChecker = (e) => {
    const totalPrice = product.reduce(
      (acc, item) =>
        acc + parseFloat(item.product.price.$numberDecimal) * item.quantity,
      0
    );
    const updatedTotal = e.target.checked
      ? totalPrice - user.token
      : totalPrice;
    setTotalOrder(
      updatedTotal.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })
    );
  };

  const handlePayment = (e) => setPayMent(e.target.value);

  const handlePay = async () => {
    
    try {
      const products = product.carts.map((item) => ({
        uid: item.userID,
        name: item.product.name,
        price: item.product.price.$numberDecimal,
        quantity: item.quantity,
        img: item.product.image[0],
      }));

      const response = await axios.post(
        "https://dtweb.onrender.com/bill/create",
        {
          province: address[0].provinces.nameProvinces,
          District: address[0].districts.nameDistricts,
          ward: address[0].wards.nameWards,
          road: address[0].road.nameRoad,
          Intomoney: totalOrder,

          products,

          PaymentForm: payMent,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Order success:", response.data);
      alert("mua hàng thành công");
      const DeleteCart = await axios.delete(
        "https://dtweb.onrender.com/cart/deleteCart",
        {
          withCredentials: true,
        }
      );
      console.log("deleteSucsses", DeleteCart.data);
      if (payMent === "Thanh toán qua ngân hàng") {
        
        if (response.data && response.data._id) {
          navigate(`/gio-hang/thanh-toan/${response.data._id}`);
        } else {
          console.error("Không có ID đơn hàng trong response:", response.data);
          alert("Đặt hàng thành công nhưng chưa lấy được mã đơn hàng.");
        }
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  if (loading || product.length === 0) return <CartsEmpty />;

  console.log("product", product);

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.bg_black_20}>
        <main>
          <div className={styles.carts}>
            <div className={styles.titleCarts}>
              <div className={styles.iconTitlecarts}>
                <span onClick={() => navigate(-1)}>
                  <FontAwesomeIcon icon={faChevronLeft} size="lg" />
                </span>
              </div>
              <span>Giỏ hàng</span>
            </div>

            <div className={styles.address}>
              <div className={styles.pick_up_store}>
                <div className={styles.chose_address}>Giao đến</div>
                <div className={styles.address_user}>
                  <span>
                    <NavLink to="/gio-hang/cap-nhap-dia-chi">Đổi</NavLink>
                  </span>
                  <p>
                    {address.length > 0
                      ? `${address[0]?.road?.nameRoad}, ${address[0]?.wards?.nameWards}, ${address[0]?.districts?.nameDistricts}, ${address[0]?.provinces?.nameProvinces}`
                      : "vui lòng nhập địa chỉ"}
                  </p>
                  <div className={styles.textBasic}>
                    <div className={styles.name}>{user.name}</div>
                    <div>{user.phone}</div>
                  </div>
                </div>
              </div>
            </div>

            {product.carts.map((item, index) => (
              <div key={index} className={styles.listCarts}>
                <div className={styles.nameproduct}>
                  <button
                    onClick={() => handleDelete(item.product._id)}
                    className={styles.deletebtn}
                  >
                    x
                  </button>
                  <img src={item.product.image[0]} alt="product" />
                  <div className={styles.productInfo}>
                    <p className={styles.productName}>{item.product.name}</p>
                  </div>
                </div>
                <div className={styles.content}>
                  <p>
                    Giá tiền:{" "}
                    {(
                      parseFloat(item.product.price.$numberDecimal) *
                      item.quantity
                    ).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <div className={styles.quantityControl}>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product._id, "updateDecrease")
                      }
                      className={styles.tru}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      readOnly
                      min="1"
                      max="99"
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product._id, "updateincrease")
                      }
                      className={styles.cong}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className={styles.delete}>
              <button onClick={handleDeleteAll}>Xóa tất cả</button>
            </div>

            <div className={styles.payment}>
              <h3>Thông tin thanh toán</h3>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <td>Tổng tiền</td>
                    <td>{total}</td>
                  </tr>
                  <tr>
                    <td>
                      <input onClick={handleChecker} type="checkbox" /> sử dụng{" "}
                      {user.token || 0} điểm
                    </td>
                  </tr>
                  <tr>
                    <td>Tổng đơn hàng</td>
                    <td>{totalOrder}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.description}>
              <p>Nhập mô tả đơn hàng</p>
              <textarea
                rows="4"
                cols="77"
                placeholder="Nhập yêu cầu của bạn (nếu có)"
              />
            </div>

            <div className={styles.stickyFooter}>
              <div className={styles.footerActions}>
              <div className={styles.footerActionsRow}>
                <div className={styles.paymentMethodInfo}>
                <FontAwesomeIcon icon={faWallet} style={{ marginRight: "6px", color: "#3a3a3a" }} />
                  {payMent || "Thanh toán bằng tiền mặt"}
                </div>
                <button
                  onClick={() => setShowPaymentMethod(!showPaymentMethod)}
                  className={styles.paybtn}
                >
                  Đổi hình thức thanh toán
                </button>
              </div>
                {showPaymentMethod && (
                  <div
                    className={styles.overlay}
                    onClick={() => setShowPaymentMethod(false)} // click ra ngoài để tắt
                  >
                    <div
                      className={styles.paymentPopup}
                      onClick={(e) => e.stopPropagation()} // không tắt khi click vào trong
                    >
                      <button
                        className={styles.closeButton}
                        onClick={() => setShowPaymentMethod(false)}
                      >
                        &times;
                      </button>
                      <ul>
                        <li>
                        <label onClick={() => setPayMent("Tiền mặt khi nhận hàng")}>
                          <input
                            type="radio"
                            value="Tiền mặt khi nhận hàng"
                            name="payment"
                            onChange={handlePayment}
                            checked={payMent === "Tiền mặt khi nhận hàng"} // để giữ trạng thái khi mở lại
                          />{" "}
                          Tiền mặt khi nhận hàng
                          </label>
                        </li>
                        <li>
                        <label onClick={() => setPayMent("Thanh toán qua ngân hàng")}>
                          <input
                            type="radio"
                            value="Thanh toán qua ngân hàng"
                            name="payment"
                            onChange={handlePayment}
                            checked={payMent === "Thanh toán qua ngân hàng"} // để giữ trạng thái khi mở lại
                          />{" "}
                          Thanh toán qua ngân hàng
                          </label>
                        </li>
                      </ul>
                      <button
                        className={styles.confirmButton}
                        onClick={() => setShowPaymentMethod(false)}
                      >
                        Xác nhận
                      </button>
                    </div>
                  </div>
                )}
                <button onClick={handlePay} className={styles.btn}>
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
