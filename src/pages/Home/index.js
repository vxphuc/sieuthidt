import { useState, useEffect, useRef, useContext } from "react";
import styles from "./Home.module.css";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faXmark,
  faSolid,
  faCaretRight,
  faCaretLeft,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import ProductHome from "../ProductHome";
import { CartContext } from "../../contexts/CartContext";
import BackgroundPopup from "../../components/BackgroundPopup";
import { io } from "socket.io-client";
import api from "../../api/axios";

function Home() {
  const navigate = useNavigate();
  const [img, setImg] = useState([]);
  const sliderRef = useRef(null);
  const currentIndex = useRef(0);
  const intervalRef = useRef(null);
  const [newProduct, setNewProduct] = useState([]);
  const nameNewProduct = useRef(null);
  const socket = io('https://dtweb.onrender.com');
  const [isAdding, setIsAdding] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const { fetchCartCount } = useContext(CartContext);

  const [popupProduct, setPopupProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const openPopupBuy = (product) => {
    setPopupProduct(product);
    setQuantity(1); // reset về 1
  };

  const confirmAddToCart = () => {
    if (isAdding) return; // chặn nếu đang xử lý

    setIsAdding(true);
    api
      .post(
        "/cart/create",
        {
          productID: popupProduct._id,
          quantity: quantity,
        },
        { withCredentials: true }
      )
      .then((res) => {
        fetchCartCount();
        setPopupProduct(null); // đóng popup
      })
      .catch((error) => navigate("/dang-nhap"))
      .finally(() => {
        setIsAdding(false); // mở lại nút
      });
  };

  //new product
  useEffect(() => {
    api
      .get("/product/newProduct")
      .then((res) => setNewProduct(res.data))
      .catch((error) => console.log(error));
  }, []);

  //banner
  useEffect(() => {
    api
      .get("/sign-in/banner")
      .then((res) => setImg(res.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (img.length > 0) {
      AutoSlide();
    }
    return () => {
      if (intervalRef) {
        clearInterval(intervalRef.current);
      }
    };
  }, [img]);

  const AutoSlide = () => {
    intervalRef.current = setInterval(() => {
      if (sliderRef.current) {
        currentIndex.current = (currentIndex.current + 1) % img.length;
        sliderRef.current.style.transform = `translateX(-${
          currentIndex.current * 100
        }%)`;
      }
    }, 3000);
  };

  return (
    <div className="">
      <div className={``}>
        <div className={``}>
          <div className={`${styles.container}`}>
            <div ref={sliderRef} className={styles.banner}>
              {img.map((image, index) => {
                return (
                  <img
                    key={index}
                    src={`https://dtweb.onrender.com/uploads/${image.image}`}
                  ></img>
                );
              })}
            </div>
          </div>

          <div className={styles.newProduct}>
            <div className={`${styles.title}`}>
              <h2>Sản phẩm mới</h2>
            </div>
            <div className={`${styles.products}`}>
              {newProduct.map((product, index) => {
                let price = Number.parseInt(product.price.$numberDecimal);
                price = price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                });
                let priceDiscount = Number.parseInt(
                  product.priceDiscount.$numberDecimal
                );
                priceDiscount = priceDiscount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                });
                return (
                  <div className={`${styles.boxProduct}`} key={index}>
                    <NavLink
                      to={`/${product.typeProduct[0].slug}/${product.slug}`}
                    >
                      <img
                        className={`${styles.imgNewProduct}`}
                        src={`${product.image[0]}`}
                        alt="product"
                      ></img>
                      <div className={`${styles.new}`}>
                        <p className={styles.newPro}>New</p>
                      </div>
                      <div className={`${styles.infoProduct}`}>
                        <h5 ref={nameNewProduct}>
                          {product.name.length > 18
                            ? `${product.name.substring(0, 30)}...`
                            : product.name}
                        </h5>
                      </div>
                    </NavLink>
                    <div className={`${styles.content}`}>
                      <div className={styles.price}>
                        <div className={styles.priceMain}>{priceDiscount}</div>
                        <div className={styles.priceOldWrapper}>
                          {product.discount > 0 && (
                            <>
                              <span className={styles.discount}>{price}</span>
                              <span className={styles.pricediscount}> -{product.discount}%</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`${styles.btnBuy}`}>
                      <button
                        onClick={() => openPopupBuy(product)}
                        className={`${styles.btn}`}
                      >
                        Mua
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <ScrollToTopButton></ScrollToTopButton>
          <div className={`${styles.product}`}>
            <ProductHome></ProductHome>
          </div>
        </div>
      </div>
      {showAlert && (
        <div className={styles.alertBuy}>🛒 Đã thêm vào giỏ hàng!</div>
      )}
      {popupProduct && (
        <BackgroundPopup
          onClick={() => setPopupProduct(null)}
          className={styles.popupWrapper}
        >
          <div
            className={styles.popupCard}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.popupClose}
              onClick={() => setPopupProduct(null)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <img src={popupProduct.image[0]} className={styles.popupImage} />
            <h5>{popupProduct.name}</h5>
            <p className={styles.popupPrice}>
              {Number.parseInt(
                popupProduct.priceDiscount.$numberDecimal
              ).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
            <div className={styles.quantityControl}>
              <button
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              {/* <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setQuantity(isNaN(value) || value < 1 ? 1 : value);
                }}
                className={styles.quantityInput}
              /> */}
              <input
                type="number"
                min="1"
                max="2"
                value={quantity}
                onChange={(e) => {
                  let value = parseInt(e.target.value);
                  if (isNaN(value) || value < 1) value = 1;
                  if (value > 2) value = 2;
                  setQuantity(value);
                }}
                className={styles.quantityInput}
              />
              {/* <button onClick={() => setQuantity((prev) => prev + 1)}> */}
              <button onClick={() => setQuantity((prev) => Math.min(prev + 1, 2))}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <button className={styles.confirmBtn} onClick={confirmAddToCart} disabled={isAdding}>
              {isAdding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </button>
          </div>
        </BackgroundPopup>
      )}
    </div>
  );
}

export default Home;
