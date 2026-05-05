import { useState, useEffect, useRef, useContext } from "react";
import styles from "./Home.module.css";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import ProductHome from "../ProductHome";
import { CartContext } from "../../contexts/CartContext";
import BackgroundPopup from "../../components/BackgroundPopup";
// import { io } from "socket.io-client";
import api from "../../api/axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getCart, saveCart } from "../../services/cartService";

function Home() {
  const navigate = useNavigate();
  const [img, setImg] = useState([]);
  const sliderRef = useRef(null);
  const currentIndex = useRef(0);
  const intervalRef = useRef(null);
  const [newProduct, setNewProduct] = useState([]);
  // const socket = useRef(null);
  const [isAdding, setIsAdding] = useState(false);

  const [loading, setLoading] = useState(true);
  const { fetchCartCount } = useContext(CartContext);

  const [popupProduct, setPopupProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Kết nối socket một lần duy nhất
  // useEffect(() => {
  //   socket.current = io("https://dtweb.onrender.com");
  //   return () => {
  //     if (socket.current) socket.current.disconnect();
  //   };
  // }, []);

  // Gộp API gọi song song
  useEffect(() => {
    setLoading(true);
    Promise.all([api.get("/product/newProduct"), api.get("/sign-in/banner")])
      .then(([newProductRes, bannerRes]) => {
        setNewProduct(newProductRes.data);
        setImg(bannerRes.data);
      })
      .catch((error) => {
        console.error(error);
        // show error UI nếu muốn
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (img.length > 0) {
      AutoSlide();
    }
    return () => {
      if (intervalRef.current) {
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

  const openPopupBuy = (product) => {
    setPopupProduct(product);
    setQuantity(1); // reset về 1
  };

  const confirmAddToCart = () => {
    if (isAdding) return;
    setIsAdding(true);
    // api.post(
    //   "/cart/create",
    //   { productID: popupProduct._id, quantity: quantity },
    //   { withCredentials: true }
    // )
    // .then((res) => {
    //   fetchCartCount();
    //   setPopupProduct(null);
    // })
    // .catch((error) => navigate("/dang-nhap"))
    // .finally(() => setIsAdding(false));
    let cart = getCart();
    const cart_id = cart.findIndex( item => item.id === popupProduct._id );
    if (cart_id !== -1) {
      cart[cart_id].quantity += quantity
    } else {
      cart.push({
        id: popupProduct._id,
        name: popupProduct.name,
        image: popupProduct.image[0],
        price: Number(popupProduct.priceDiscount.$numberDecimal),
        quantity: quantity,
      });
    }
    saveCart(cart);
    window.dispatchEvent(new Event("cart-updated"));
    fetchCartCount();
    setPopupProduct(null);
    setIsAdding(false);
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      {/* Banner */}
      <div className={styles.container}>
        <div ref={sliderRef} className={styles.banner}>
          {img.map((image) => (
            <LazyLoadImage
              key={image._id}
              src={`https://sieuthidt.io.vn/uploads/${image.image}`}
            />
          ))}
        </div>
      </div>

      {/* New Product */}
      <div className={styles.newProduct}>
        <div className={styles.title}>
          <h2>Sản phẩm mới DT</h2>
        </div>
        <div className={styles.products}>
          {newProduct.map((product) => {
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
              <div className={styles.boxProduct} key={product._id}>
                <NavLink to={`/${product.typeProduct[0].slug}/${product.slug}`}>
                  <img
                    className={styles.imgNewProduct}
                    src={product.image[0]}
                    alt="product"
                  />
                  <div className={styles.new}>
                    <p className={styles.newPro}>New</p>
                  </div>
                  <div className={styles.infoProduct}>
                    <h5>
                      {product.name.length > 18
                        ? `${product.name.substring(0, 30)}...`
                        : product.name}
                    </h5>
                  </div>
                </NavLink>
                <div className={styles.content}>
                  <div className={styles.price}>
                    <div className={styles.priceMain}>{priceDiscount}</div>
                    <div className={styles.priceOldWrapper}>
                      {product.discount > 0 && (
                        <>
                          <span className={styles.discount}>{price}</span>
                          <span className={styles.pricediscount}>
                            {" "}
                            -{product.discount}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.btnBuy}>
                  <button
                    onClick={() => openPopupBuy(product)}
                    className={styles.btn}
                  >
                    Mua
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ScrollToTopButton />
      <div className={styles.product}>
        <ProductHome />
      </div>
      {/* Popup */}
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
              ).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </p>
            <div className={styles.quantityControl}>
              <button
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setQuantity(isNaN(value) || value < 1 ? 1 : value);
                }}
                className={styles.quantityInput}
              />
              <button onClick={() => setQuantity((prev) => prev + 1)}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <button
              className={styles.confirmBtn}
              onClick={confirmAddToCart}
              disabled={isAdding}
            >
              {isAdding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </button>
          </div>
        </BackgroundPopup>
      )}
    </div>
  );
}

export default Home;
