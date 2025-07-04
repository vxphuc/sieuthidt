import styles from "./Carts.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faWallet,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import api from "../../api/axios";
import CartsEmpty from "../../components/CartEmpty";
import BackgroundPopup from "../../components/BackgroundPopup";
import { CartContext } from "../../contexts/CartContext";

function Carts() {
  const changeAddressRef = useRef(null);
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState({});
  const [totalOrder, setTotalOrder] = useState(0);
  const [address, setAddress] = useState([]);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [payMent, setPayMent] = useState("Tiền mặt khi nhận hàng");
  const [popupSuccess, setpopupSuccess] = useState(false);
  const { fetchCartCount } = useContext(CartContext);
  const [inputQuantities, setInputQuantities] = useState({});
  const [outOfStockProducts, setOutOfStockProducts] = useState([]); // Thông báo sản phẩm hết hàng
  const [useToken, setUseToken] = useState(false);
  const [otherReceiver, setOtherReceiver] = useState(false);
  const [receiverInfo, setReceiverInfo] = useState({
    name: "",
    phone: "",
  });
  const [fullName, setFullname] = useState("");

  const [receiverPhoneError, setReceiverPhoneError] = useState("");

  // Xử lý thay đổi số lượng trực tiếp bằng input
  const handleQuantityInputChange = async (id, newQuantity) => {
    try {
      await api.patch(
        `/cart/updateQuantity/${id}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      await fetchCart();
      await fetchCartCount();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // Lấy thông tin user
  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/sign-in/user-profile", {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };
  // Lấy giỏ hàng
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart", {
        withCredentials: true,
      });
      const cartItems = res.data;
      setProduct(cartItems);
      const quantities = {};
      cartItems.carts.forEach((item) => {
        quantities[item.product._id] = item.quantity;
      });
      setInputQuantities(quantities);
      const totalPrice = cartItems.carts.reduce(
        (acc, item) =>
          acc +
          parseFloat(item.product.priceDiscount.$numberDecimal) * item.quantity,
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

  // Lấy địa chỉ user
  const fetchAddress = async () => {
    try {
      const res = await api.get("/cart/getAdd", {
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

  // Tính lại tổng tiền khi số lượng thay đổi
  useEffect(() => {
    if (!product.carts) return;
    let totalPrice = 0;
    product.carts.forEach((item) => {
      const qty = inputQuantities[item.product._id] ?? item.quantity;
      totalPrice += parseFloat(item.product.priceDiscount.$numberDecimal) * qty;
    });
    const formatted = totalPrice.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    setTotal(formatted);
    setTotalOrder(formatted);
  }, [inputQuantities, product]);
  const isValidVietnamPhoneNumber = (phone) => {
    // Dạng 09, 03, 07, 08, 05 + 8 số phía sau
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return regex.test(phone);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/cart/delete/${id}`, {
        withCredentials: true,
      });
      await fetchCart();
      await fetchCartCount();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await Promise.all(
        product.carts.map((item) =>
          api.delete(`/cart/delete/${item.product._id}`, {
            withCredentials: true,
          })
        )
      );
      await fetchCart();
      window.location.reload();
    } catch (err) {
      console.error("Error deleting all:", err);
    }
  };

  // Thay đổi số lượng bằng nút + -
  const handleQuantityChange = async (id, type) => {
    try {
      await api.patch(`/cart/${type}/${id}`, {}, { withCredentials: true });
      setInputQuantities((prev) => {
        const currentVal = prev[id] || 1;
        const newVal =
          type === "updateincrease"
            ? // ? currentVal + 1
              // : Math.max(1, currentVal - 1);
              Math.min(2, currentVal + 1)
            : Math.max(1, currentVal - 1);
        return {
          ...prev,
          [id]: newVal,
        };
      });
    } catch (err) {
      console.error(`Error ${type} quantity:`, err);
    }
  };

  // Dùng điểm khi thanh toán
  const handleChecker = (e) => {
    setUseToken(e.target.checked);
    const totalPrice = product.carts.reduce(
      (acc, item) =>
        acc +
        parseFloat(item.product.priceDiscount.$numberDecimal) * item.quantity,
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

  // Đặt hàng và kiểm tra tồn kho từng sản phẩm
  const handlePay = async () => {
    try {
      if (!address || address.length === 0) {
        alert("Vui lòng nhập địa chỉ giao hàng.");
        if (changeAddressRef.current) {
          changeAddressRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          changeAddressRef.current.classList.add(styles.highlightChangeAddress);
          setTimeout(() => {
            if (changeAddressRef.current) {
              changeAddressRef.current.classList.remove(
                styles.highlightChangeAddress
              );
            }
          }, 3000);
        }
        return;
      }
      // Dùng số lượng nhập tay mới nhất
      const products = product.carts.map((item) => ({
        productID: item.product._id,
        uid: item.userID,
        name: item.product.name,
        price: item.product.priceDiscount.$numberDecimal,
        quantity: inputQuantities[item.product._id] ?? item.quantity,
        img: item.product.image[0],
      }));
      let alternateReceiverName;
      let alternateReceiverPhone;
      if (receiverInfo && isValidVietnamPhoneNumber(receiverInfo.phone)) {
        alternateReceiverPhone = receiverInfo.phone;
        alternateReceiverName = receiverInfo.name;
      }
      if (!user.name) {
        if (fullName.trim() === "") {
          alert("Vui lòng nhập họ và tên.");
          return;
        } else {
          await api.put(
            `/sign-in/${user.uid}/fillInInformation`,
            {
              name: fullName,
            },
            {
              withCredentials: true,
            }
          );
        }
      }

      const response = await api.post(
        "/bill/create",
        {
          province: address[0].provinces.nameProvinces,
          District: address[0].districts.nameDistricts,
          ward: address[0].wards.nameWards,
          road: address[0].road.nameRoad,
          Intomoney: totalOrder,
          products,
          PaymentForm: payMent,
          useToken,
          alternateReceiverName,
          alternateReceiverPhone,
        },
        { withCredentials: true }
      );
      if (response.data.errorList) {
        setOutOfStockProducts(response.data.errorList);
        console.log(outOfStockProducts);
        return;
      }

      // Đặt hàng thành công
      await api.delete("/cart/deleteCart", {
        withCredentials: true,
      });
      if (payMent === "Thanh toán qua ngân hàng") {
        if (response.data && response.data._id) {
          navigate(`/gio-hang/thanh-toan/${response.data._id}`);
        } else {
          alert("Đặt hàng thành công nhưng chưa lấy được mã đơn hàng.");
        }
      } else {
        setpopupSuccess(true);
        setTimeout(() => {
          window.location.reload();
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      // Nếu lỗi tồn kho trả về mảng sản phẩm hết hàng
      if (
        err.response &&
        err.response.status === 400 &&
        Array.isArray(err.response.data?.products)
      ) {
        setOutOfStockProducts(err.response.data.products);
        return;
      }
      alert("Có lỗi khi thanh toán. Vui lòng thử lại!");
      console.error(err);
    }
  };

  if (loading || product.length === 0) return <CartsEmpty />;

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
                <div className={styles.chose_address}>Thông Tin Nhận Hàng</div>
                <div className={styles.address_user}>
                  <NavLink to="/gio-hang/cap-nhap-dia-chi">
                    <span ref={changeAddressRef}>{address.length > 0 ? "Đổi" : "Thêm"}</span>
                  </NavLink>
                  <div className={styles.textBasic}>
                    <div className={styles.name}>
                      {user.name ? (
                        user.name
                      ) : (
                        <input
                          className={styles.inputName}
                          onChange={(e) => setFullname(e.target.value)}
                          placeholder="họ và tên"
                        ></input>
                      )}
                    </div>
                    <div>{user.phone}</div>
                  </div>
                  <p className={styles.addressOrder}>
                    {address.length > 0
                      ? `${address[0]?.road?.nameRoad}, ${address[0]?.wards?.nameWards}, ${address[0]?.districts?.nameDistricts}, ${address[0]?.provinces?.nameProvinces}`
                      : "Thêm địa chỉ nhận hàng"}
                  </p>
                </div>
                <label className={styles.alternateReceiver}>
                  <input
                    onChange={(e) => setOtherReceiver(e.target.checked)}
                    type="checkbox"
                  />{" "}
                  Gọi người nhận hàng khác (nếu có)
                </label>
              </div>
            </div>

            <div
              className={styles.receiverInfo}
              style={{ display: otherReceiver ? "block" : "none" }}
            >
              <div className={styles.receiverInput}>
                <input
                  type="text"
                  id="receiverName"
                  value={receiverInfo.name}
                  onChange={(e) =>
                    setReceiverInfo({ ...receiverInfo, name: e.target.value })
                  }
                  placeholder="Nhập tên người nhận"
                />
              </div>
              <div className={styles.receiverInput}>
                <input
                  type="text"
                  id="receiverPhone"
                  value={receiverInfo.phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    setReceiverInfo({ ...receiverInfo, phone: val });
                    if (isValidVietnamPhoneNumber(val)) {
                      setReceiverPhoneError("");
                    } else {
                      setReceiverPhoneError(
                        "Số điện thoại không hợp lệ. Vui lòng nhập lại."
                      );
                    }
                  }}
                  onBlur={() => {
                    if (
                      receiverInfo.phone &&
                      !isValidVietnamPhoneNumber(receiverInfo.phone)
                    ) {
                      setReceiverPhoneError(
                        "Số điện thoại không hợp lệ. Vui lòng nhập lại."
                      );
                    } else {
                      setReceiverPhoneError("");
                    }
                  }}
                  placeholder="Nhập số điện thoại người nhận"
                />
                {receiverPhoneError && (
                  <div style={{ color: "red", fontSize: "13px" }}>
                    {receiverPhoneError}
                  </div>
                )}
              </div>
            </div>

            {/* Hiện thông báo sản phẩm không đủ tồn kho */}
            {outOfStockProducts.length > 0 && (
              <BackgroundPopup>
                <div className={styles.popUptonkho}>
                  <ul className={styles.soluongkho}>
                    {outOfStockProducts.map((item) => (
                      <li className={styles.endsub} key={item.productID}>
                        <div>
                          <strong>{item.name}</strong>
                        </div>
                        <div>
                          {item.reason && <>– {item.reason}. </>}
                          {item.message && <>{item.message} </>}
                          {typeof item.stock !== "undefined" && (
                            <> (Còn lại: {item.stock})</>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={styles.closePopup}
                    onClick={() => setOutOfStockProducts([])}
                  >
                    Đóng
                  </button>
                </div>
              </BackgroundPopup>
            )}

            {product.carts.map((item, index) => (
              <div key={index} className={styles.listCarts}>
                <div className={styles.nameproduct}>
                  <button
                    onClick={() => handleDelete(item.product._id)}
                    className={styles.deletebtn}
                  >
                    X
                  </button>
                  <img src={item.product.image[0]} alt="product" />
                  <div className={styles.productInfo}>
                    <p className={styles.productName}>{item.product.name}</p>
                    <p className={styles.productPrice}>
                      Giá tiền:{" "}
                      {parseFloat(
                        item.product.priceDiscount.$numberDecimal
                      ).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>
                </div>
                <div className={styles.content}>
                  <p>
                    Tổng tiền:{" "}
                    {(
                      parseFloat(item.product.priceDiscount.$numberDecimal) *
                      (inputQuantities[item.product._id] ?? item.quantity)
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
                      min="1"
                      max="2"
                      value={inputQuantities[item.product._id] ?? item.quantity}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val === "") {
                          setInputQuantities((prev) => ({
                            ...prev,
                            [item.product._id]: val,
                          }));
                          return;
                        }
                        val = Math.max(1, Math.min(2, parseInt(val)));
                        setInputQuantities((prev) => ({
                          ...prev,
                          [item.product._id]: val,
                        }));
                      }}
                      onBlur={() => {
                        // const val = inputQuantities[item.product._id];
                        // if (val === "" || val == null) return;
                        // const valNum = Number(val);
                        // if (valNum !== item.quantity) {
                        //   handleQuantityInputChange(item.product._id, valNum);
                        // }
                        const val = inputQuantities[item.product._id];
                        if (val === "" || val == null) return;
                        const valNum = Number(val);

                        // Nếu số lượng vượt quá 2, không cho gọi API
                        if (valNum > 2) {
                          setInputQuantities((prev) => ({
                            ...prev,
                            [item.product._id]: 2,
                          }));
                          return;
                        }

                        if (valNum !== item.quantity) {
                          handleQuantityInputChange(item.product._id, valNum);
                        }
                      }}
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
                    <td className={styles.tableText}>Tổng tiền</td>
                    <td className={styles.totalAll}>{total}</td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <input onClick={handleChecker} type="checkbox" />
                      <img
                        src="https://dtweb.onrender.com/uploads/coin-dt.svg"
                        alt="cheap"
                        width="18"
                        height="18"
                      />
                      <span>
                        Sử dụng <strong>{user.token || 0}</strong> điểm
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.tableText}>Tổng đơn hàng</td>
                    <td className={styles.totalAll}>{totalOrder}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.description}>
              <h5>
                <strong>Nhập mô tả đơn hàng</strong>
              </h5>
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
                    <FontAwesomeIcon
                      icon={faWallet}
                      style={{ marginRight: "6px", color: "#3a3a3a" }}
                    />
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
                    onClick={() => setShowPaymentMethod(false)}
                  >
                    <div
                      className={styles.paymentPopup}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className={styles.closeButton}
                        onClick={() => setShowPaymentMethod(false)}
                      >
                        &times;
                      </button>
                      <ul>
                        <li>
                          <label
                            onClick={() => setPayMent("Tiền mặt khi nhận hàng")}
                          >
                            <input
                              type="radio"
                              value="Tiền mặt khi nhận hàng"
                              name="payment"
                              onChange={handlePayment}
                              checked={payMent === "Tiền mặt khi nhận hàng"}
                            />{" "}
                            Tiền mặt khi nhận hàng
                          </label>
                        </li>
                        <li>
                          <label
                            onClick={() =>
                              setPayMent("Thanh toán qua ngân hàng")
                            }
                          >
                            <input
                              type="radio"
                              value="Thanh toán qua ngân hàng"
                              name="payment"
                              onChange={handlePayment}
                              checked={payMent === "Thanh toán qua ngân hàng"}
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
                <div>
                  <BackgroundPopup
                    className={`${
                      popupSuccess === false ? styles.popupSuccess : ""
                    }`}
                  >
                    <div className={`${styles.popUp}`}>
                      <div className={styles.checkIcon}>
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{
                            color: "#48bf40",
                            width: "50%",
                            height: "50%",
                          }}
                        />
                      </div>
                      <h3 className="text-success">Thành công</h3>
                      <p>
                        chúng tôi đã nhận được đơn đặt hàng của bạn, bạn sẽ trở
                        về trang chủ sau 2 giây
                      </p>
                    </div>
                  </BackgroundPopup>
                </div>
                <button onClick={handlePay} className={styles.btn}>
                  <span className={styles.orderText}>Đặt hàng: </span>
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
