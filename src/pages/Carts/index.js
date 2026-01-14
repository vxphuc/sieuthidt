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
import axios from "../../api/koc";
import CartsEmpty from "../../components/CartEmpty";
import BackgroundPopup from "../../components/BackgroundPopup";
import { CartContext } from "../../contexts/CartContext";
import {
  getCart,
  saveCart,
  getAddress,
  getName,
} from "../../services/cartService";

function Carts() {
  const changeAddressRef = useRef(null);
  const navigate = useNavigate();

  const [discountCode, setDiscountCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState({ text: "", type: "" });
  const [discountInfo, setDiscountInfo] = useState(null);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState("");
  // State giỏ hàng luôn là nguồn dữ liệu duy nhất, luôn lấy từ localStorage
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [totalOrder, setTotalOrder] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [address, setAddress] = useState([]);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [payMent, setPayMent] = useState("Tiền mặt khi nhận hàng");
  const [popupSuccess, setpopupSuccess] = useState(false);
  const { fetchCartCount } = useContext(CartContext);
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [useToken, setUseToken] = useState(false);
  const [otherReceiver, setOtherReceiver] = useState(false);
  const [receiverInfo, setReceiverInfo] = useState({ name: "", phone: "" });
  const [dataProduct, setDataProduct] = useState([]);
  const inputNameRef = useRef(null);
  const [receiverPhoneError, setReceiverPhoneError] = useState("");
  const receiverNameRef = useRef(null);
  const receiverPhoneRef = useRef(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errorUserInfo, setErrorUserInfo] = useState(false);
  const [errorAddress, setErrorAddress] = useState(false);
  const [errorReceiverName, setErrorReceiverName] = useState(false);
  const [errorReceiverPhone, setErrorReceiverPhone] = useState(false);
  const userInfoRef = useRef(null);
  const addressRef = changeAddressRef;
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [product, setProduct] = useState([]);

  // Áp dụng mã giảm giá
  // Áp dụng mã giảm giá
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountMessage({ text: "Vui lòng nhập mã giảm giá!", type: "error" });
      return;
    }
    if (discountCode.trim() === appliedDiscountCode) {
      setDiscountMessage({ text: "Mã này đã được áp dụng.", type: "error" });
      return;
    }

    // Nếu cần check user phone thì giữ lại, nếu không thì có thể bỏ qua check phone để giống Postman
    if (!user || user.length === 0 || !user[0].phone) {
       // Tạm thời log warning thay vì chặn luôn nếu muốn test giống postman
       console.warn("User phone not found");
    }
    
    const userPhone = user && user[0] ? user[0].phone : "";
    setDiscountMessage({ text: "", type: "" });

    try {
      // Dùng axios từ import (lưu ý: anh nên đồng bộ dùng biến 'api' thay vì 'axios' để tránh nhầm lẫn file config)
      const response = await axios.post("/su-dung-ma-giam-gia", {
        tenmagiamgia: discountCode,
        phone: userPhone 
      });

      console.log("API Response:", response.data); // Log để debug

      // --- SỬA LẠI LOGIC BẮT DỮ LIỆU ---
      
      // Trường hợp 1: Server trả về đúng như ảnh Postman { "giatrimagiam": 25 }
      if (response.data && response.data.giatrimagiam !== undefined) {
        const value = response.data.giatrimagiam;
        
        // Tạo object info để khớp với logic tính tiền ở dưới
        const discountInfoObj = {
            discount_value: value,       // Map 'giatrimagiam' sang 'discount_value'
            discount_type: "percentage"  // Giả định là % (vì trong ảnh thấy số 25 nhỏ, nếu là tiền mặt 25đ thì quá ít)
        };

        setDiscountInfo(discountInfoObj);
        setAppliedDiscountCode(discountCode);
        setDiscountMessage({ text: `Áp dụng thành công! Giảm ${value}%`, type: "success" });
      }
      // Trường hợp 2: Server trả về cấu trúc cũ (dạng mảng) - Giữ lại để dự phòng
      else if (response.data && response.data.value && Array.isArray(response.data.value) && response.data.value.length > 0) {
        const discountData = response.data.value[0];
        setDiscountInfo(discountData);
        setAppliedDiscountCode(discountCode);
        setDiscountMessage({ text: "Áp dụng mã giảm giá thành công!", type: "success" });
      } 
      // Trường hợp lỗi trả về từ server (dạng string)
      else if (response.data && typeof response.data.value === 'string') {
        setDiscountInfo(null);
        setAppliedDiscountCode(""); 
        setDiscountMessage({ text: response.data.value, type: "error" });
      } 
      // Fallback
      else {
        setDiscountInfo(null);
        setAppliedDiscountCode("");
        setDiscountMessage({ text: "Mã giảm giá không hợp lệ hoặc lỗi cấu trúc dữ liệu.", type: "error" });
      }

    } catch (error) {
      if (error.response && error.response.status === 422 && error.response.data.err) {
          setDiscountInfo(null);
          setAppliedDiscountCode("");
          setDiscountMessage({ text: error.response.data.err, type: "error" });
      } else {
          setDiscountInfo(null);
          setAppliedDiscountCode("");
          setDiscountMessage({ text: "Lỗi hệ thống hoặc mã không tồn tại.", type: "error" });
          console.error("Error applying discount code:", error);
      }
    }
  };
  //hết

  // Fetch user info
  const fetchUserProfile = async () => {
    try {
      setUser(getName());
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  // Fetch address info
  const fetchAddress = async () => {
    try {
      setAddress(getAddress());
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  // Fetch cart from localStorage
  const fetchCart = () => {
    const cartData = getCart() || [];
    setCart(cartData);
    setLoading(false);
  };

  const setproduct = () => {
    const idx = getCart().map((index) => index.id);
    const quantityproduct = getCart().map((index) => index.quantity);
    api
      .post("/product/seeding-product", {
        id: idx,
        quantity: quantityproduct,
      })
      .then((res) => {
        setProduct(res.data);
      });
  };

  // Khi mở trang, fetch user, cart, address
  useEffect(() => {
    fetchUserProfile();
    fetchCart();
    fetchAddress();
    setproduct();
  }, []);

  // Mỗi lần cart thay đổi thì tính lại tổng tiền
  // useEffect(() => {
  //   let totalPrice = 0;
  //   product.forEach((item) => {
  //     totalPrice +=
  //       parseFloat(item.priceDiscount.$numberDecimal) * item.quantity;
  //   });
  //   setTotalOrder(totalPrice);
  // }, [product, cart]);
  useEffect(() => {
    let newSubtotal = 0;
    product.forEach((item) => {
      // 1. Chuyển đổi giá và số lượng một cách an toàn
      const price = parseFloat(item.priceDiscount?.$numberDecimal);
      const quantity = parseInt(item.quantity, 10);

      // 2. Chỉ cộng vào tổng nếu CẢ HAI đều là số hợp lệ (không phải NaN)
      if (!isNaN(price) && !isNaN(quantity)) {
        newSubtotal += price * quantity;
      }
      // Nếu không, bỏ qua (không cộng gì cả), newSubtotal vẫn giữ nguyên
    });
    setSubtotal(newSubtotal);
  }, [product, cart]);
  useEffect(() => {
    // Nếu không có thông tin giảm giá (chưa áp dụng hoặc áp dụng lỗi)
    if (!discountInfo) {
      setTotalOrder(subtotal); // Tổng đơn hàng = Tạm tính
      return;
    }

    // Nếu có thông tin giảm giá, bắt đầu tính toán
    const { discount_type, discount_value } = discountInfo;
    let discountAmount = 0;

    // Dựa trên loại giảm giá (từ ảnh bạn gửi là "percentage")
    if (discount_type === "percentage") {
      discountAmount = (subtotal * parseFloat(discount_value)) / 100;
    } 
    // else if (discount_type === "fixed_amount") { // Bạn có thể thêm logic cho giảm giá tiền cố định
    //   discountAmount = parseFloat(discount_value);
    // }
    
    // Đảm bảo tổng tiền không bao giờ bị âm
    const finalTotal = Math.max(0, subtotal - discountAmount);
    setTotalOrder(finalTotal);

  }, [subtotal, discountInfo]);

  // Tự động blur input khi scroll (UX improvement)
  useEffect(() => {
    const handleScroll = () => {
      if (inputNameRef.current === document.activeElement) {
        inputNameRef.current.blur();
      }
      if (receiverNameRef.current === document.activeElement) {
        receiverNameRef.current.blur();
      }
      if (receiverPhoneRef.current === document.activeElement) {
        receiverPhoneRef.current.blur();
      }
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  // Regex kiểm tra số điện thoại Việt Nam
  const isValidVietnamPhoneNumber = (phone) => {
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return regex.test(phone);
  };

  // Xóa sản phẩm khỏi giỏ
  const handleDelete = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    saveCart(newCart);
    setCart(newCart);
    fetchCartCount();
    setproduct()
  };

  // Tăng/giảm số lượng sản phẩm
  const handleQuantityChange = (id, type) => {
    let updatedCart = [...cart];
    const idx = updatedCart.findIndex((item) => item.id === id);
    console.log(idx);
    if (idx === -1) return;
    if (type === "updateincrease") {
      updatedCart[idx].quantity += 1;
    } else if (type === "updateDecrease") {
      updatedCart[idx].quantity = Math.max(1, updatedCart[idx].quantity - 1);
    }

    saveCart(updatedCart);
    setCart(updatedCart);
    setproduct();
  };

  // Nhập số lượng bằng input
  const handleQuantityInputChange = (id, value) => {
    let num = parseInt(value, 10);
    if (isNaN(num) || num < 1) num = 1;
    let updatedCart = [...cart];
    const idx = updatedCart.findIndex((item) => item.id === id);
    if (idx === -1) return;
    updatedCart[idx].quantity = num;
    saveCart(updatedCart);
    setCart(updatedCart);
    setproduct();
  };

  // Dùng điểm khi thanh toán
  const handleChecker = (e) => {
    setUseToken(e.target.checked);
    // Không cần update tổng tiền ở đây, chỉ cần truyền useToken vào handlePay, backend tự xử lý
  };

  const handlePayment = (e) => setPayMent(e.target.value);

  // Đặt hàng
  const handlePay = async () => {
    if (isAdding) return;
    setIsAdding(true);
    setErrorUserInfo(false);
    setErrorAddress(false);
    setErrorReceiverName(false);
    setErrorReceiverPhone(false);

    // Kiểm tra địa chỉ nhận hàng
    if (
      !address ||
      address.length === 0 ||
      !address[0]?.province ||
      !address[0]?.ward
    ) {
      setErrorAddress(true);
      setAlertMessage("Vui lòng nhập địa chỉ giao hàng.");
      setShowAlert(true);
      setIsAdding(false);
      return;
    }
    // Kiểm tra người nhận khác
    if (otherReceiver) {
      if (!receiverInfo.name || receiverInfo.name.trim() === "") {
        alert("Vui lòng nhập đầy đủ thông tin và thử lại!");
        setErrorReceiverName(true);
        if (receiverNameRef.current) receiverNameRef.current.focus();
        setIsAdding(false);
        return;
      }
      if (
        !receiverInfo.phone ||
        !isValidVietnamPhoneNumber(receiverInfo.phone)
      ) {
        alert("Vui lòng nhập đầy đủ thông tin và thử lại!");
        setErrorReceiverPhone(true);
        if (receiverPhoneRef.current) receiverPhoneRef.current.focus();
        setIsAdding(false);
        return;
      }
    }
    try {
      let alternateReceiverName, alternateReceiverPhone;
      if (
        otherReceiver &&
        receiverInfo.name &&
        isValidVietnamPhoneNumber(receiverInfo.phone)
      ) {
        alternateReceiverName = receiverInfo.name;
        alternateReceiverPhone = receiverInfo.phone;
      }
      const products = product.map((item) => {
        return {
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          productID: item._id,
          img: item.image[0],
        };
      });
      const payload = {
        products: products,
        Intomoney: subtotal, // Tổng tiền
        UserName: user[0].name,
        PaymentForm: payMent,
        province: address[0].province,
        ward: address[0].ward,
        road: address[0].road,
        alternateReceiverName,
        alternateReceiverPhone,
        phoneNumber: user[0].phone,
      };

      // 2. Chỉ thêm thông tin giảm giá nếu có
      if (discountInfo && appliedDiscountCode) {
        payload.code = appliedDiscountCode; // Thêm mã code
        payload.discount_value = discountInfo.discount_value; // Thêm giá trị giảm
      }
      else {
        payload.code = ""; // Gửi mã rỗng
        payload.discount_value = 0; // Gửi giá trị giảm là 0
      }
      const response = await api.post("/bill/create", payload);
      console.log(response.data._id);
      if (payMent === "Thanh toán qua ngân hàng") {
        if (response.data && response.data._id) {
          navigate(`/gio-hang/thanh-toan/${response.data._id}`);
        } else {
          alert("Đặt hàng thành công nhưng chưa lấy được mã đơn hàng.");
          setIsAdding(false);
        }
      } else {
        setpopupSuccess(true);
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
      localStorage.removeItem("cart");
      fetchCartCount();
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        Array.isArray(err.response.data?.products)
      ) {
        setOutOfStockProducts(err.response.data.products);
        setIsAdding(false);
        return;
      }
      alert("Có lỗi khi thanh toán. Vui lòng thử lại!");
      console.error(err);
      setIsAdding(false);
    }
    setIsAdding(false);
  };

  // Nếu giỏ hàng trống
  if (loading || !cart || cart.length === 0) return <CartsEmpty />;
  console.log("product", subtotal);
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
                    <span
                      ref={changeAddressRef}
                      className={`${
                        errorAddress ? styles.highlightChangeAddress : ""
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      {address.length > 0 ? "Đổi" : "Thêm"}
                    </span>
                  </NavLink>
                  <div className={styles.textBasic}>
                    <div className={styles.name}>
                      {user.length > 0
                        ? user.map((users, index) => (
                            <div key={index}>
                              {users.name}, {users.phone}
                            </div>
                          ))
                        : ""}
                    </div>
                    <div>{user.phone}</div>
                  </div>
                  <p className={styles.addressOrder}>
                    {address.length > 0
                      ? address.map((Addr, index) => {
                          return (
                            <div key={index}>
                              {Addr.province}, {Addr.ward}, {Addr.road}
                            </div>
                          );
                        })
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
                  ref={receiverNameRef}
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
                  ref={receiverPhoneRef}
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

            {product.map((item) => (
              <div key={item.id} className={styles.listCarts}>
                <div className={styles.nameproduct}>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className={styles.deletebtn}
                  >
                    X
                  </button>
                  <img src={item.image[0]} alt="product" />
                  
                  <div className={styles.productInfo}>
                    <p className={styles.productName}>{item.name}</p>
                    <p className={styles.productPrice}>
                      Giá tiền:{" "}
                      {parseFloat(
                        item.priceDiscount.$numberDecimal
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
                      parseFloat(item.priceDiscount.$numberDecimal) *
                      item.quantity
                    ).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <div className={styles.quantityControl}>
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, "updateDecrease")
                      }
                      className={styles.tru}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityInputChange(item.id, e.target.value)
                      }
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, "updateincrease")
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
              <button onClick={() => navigate("/")}>Tiếp tục mua hàng</button>
            </div>

            <div className={styles.payment}>
              <h3>Thông tin thanh toán</h3>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <td className={styles.tableText}>Tổng tiền</td>
                    <td className={styles.totalAll}>
                      {subtotal.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
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
                        src="https://sieuthidt.io.vn/uploads/coin-dt.svg"
                        alt="cheap"
                        width="18"
                        height="18"
                      />
                      <span>
                        Sử dụng <strong>{user.token || 0}</strong> điểm
                      </span>
                    </td>
                  </tr>

                  {/* Áp dụng mã giảm giá */}
                  <tr>
                    <td
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/929/929430.png"
                        alt="discount"
                        width="18"
                        height="18"
                      />
                      <input
                        type="text"
                        placeholder="Nhập mã giảm giá"
                        style={{
                          flex: 1,
                          padding: "6px 8px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                        }}
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                      />
                    </td>
                    <td>
                        <button
                        onClick={handleApplyDiscount}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#00703a",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Áp dụng
                      </button>
                    </td>
                    
                  </tr>
                  {/* Hiển thị thông báo giảm giá */}
                  {discountMessage.text && (
                    <tr>
                      <td
                        colSpan="2"
                        style={{
                          color: discountMessage.type === "error" ? "red" : "green",
                          fontSize: "13px",
                          textAlign: "left",
                          paddingTop: "5px"
                        }}
                      >
                        {discountMessage.text}
                      </td>
                    </tr>
                  )}
                  {/* hết */}
                  <tr>
                    <td className={styles.tableText}>Tổng đơn hàng</td>
                    <td className={styles.totalAll}>
                      {totalOrder.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
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
                        <img
                          src="https://i.gifer.com/7efs.gif"
                          alt="Success"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <h3 className="text-success">Đặt Hàng Thành Công!</h3>
                    </div>
                  </BackgroundPopup>
                </div>
                <button
                  onClick={handlePay}
                  className={styles.btn}
                  disabled={isAdding}
                >
                  <span className={styles.orderText}>
                    {isAdding ? "đang xử lý đơn: " : "Đặt Hàng: "}
                  </span>
                  <span className={styles.orderPrice}>
                    {totalOrder.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      {showAlert && (
        <div className={styles.overlay}>
          <div className={styles.paymentPopup}>
            <p>{alertMessage}</p>
            <button
              className={styles.confirmButton}
              onClick={() => {
                setShowAlert(false);
                // Scroll về nút Thêm
                if (changeAddressRef.current) {
                  changeAddressRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  changeAddressRef.current.classList.add(
                    styles.highlightChangeAddress
                  );
                  setTimeout(() => {
                    if (changeAddressRef.current) {
                      changeAddressRef.current.classList.remove(
                        styles.highlightChangeAddress
                      );
                    }
                  }, 3000);
                }
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carts;
