import styles from "./DetailProduct.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
  faMinus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useParams, useNavigate, data } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import api from "../../api/axios.js";
import ListProductSame from "../ListProductSame";
import ReviewList from "../../components/Ratingstars/ReviewList/ReviewList.js";
import ReviewForm from "../../components/Ratingstars//ReviewForm/ReviewForm.js";
import { CartContext } from "../../contexts/CartContext.js";
import BackgroundPopup from "../../components/BackgroundPopup";
import { getCart, saveCart } from "../../services/cartService.js";

function DetailProduct() {
  const { slug } = useParams();
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [bgX, setBgX] = useState(0);
  const { fetchCartCount } = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);
  const bgXRef = useRef(0);
  const [moreDescription, setMoreDescription] = useState(false);

  const [popupProduct, setPopupProduct] = useState(null); // sản phẩm đang được mở popup
  const [quantity, setQuantity] = useState(1);

  const openPopupBuy = (product) => {
    setPopupProduct(product);
    setQuantity(1); // reset về 1
  };
  const confirmAddToCart = () => {
    if (isAdding) return; // chặn nếu đang gửi
    setIsAdding(true);
    let cart = getCart();
    const cart_id = cart.findIndex((item) => item.id === popupProduct._id);
    if (cart_id !== -1) {
      cart[cart_id].quantity += quantity;
    } else {
      cart.push({
        id: popupProduct._id,
        image: popupProduct.image[0],
        name: popupProduct.name,
        price: popupProduct.priceDiscount.$numberDecimal,
        quantity: quantity,
      });
    }
    saveCart(cart);
    window.dispatchEvent(new Event("cart-updated"));
    setPopupProduct(null);
    setIsAdding(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      bgXRef.current = Math.random() * 100;
      // update lại style bằng JS nếu cần
      const button = document.getElementById("btn-buy");
      if (button) {
        button.style.backgroundPositionX = `${bgXRef.current}%`;
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handlemoreDescription = () => {
    setMoreDescription(!moreDescription);
  };

  const nextImage = () => {
    const totalImages = product[0].image.length || 0;
    setCurrentImage((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    const totalImages = product[0]?.image.length || 0;
    setCurrentImage((prev) => (prev - 1 + totalImages) % totalImages);
  };

  useEffect(() => {
    api.get(`/product/${slug}`).then((response) => {
      setProduct(response.data);
    });
  }, [slug]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlechooseImg = (index) => {
    setCurrentImage(index);
  };

  return (
    <div className={`${styles.DetailProduct}`}>
      <div className={`${styles.titleDetailProduct}`}>
        <button onClick={handleGoBack} className={`${styles.back}`}>
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </button>
        <div className={`${styles.nameProduct} `}>
          {" "}
          {product.map((item, index) => {
            return <span key={item._id}>{item.Typeproduct[0].name}</span>;
          })}
        </div>
      </div>
      <div className={`d-flex mt-2 flex-wrap`}>
        <div className={`${styles.product}`}>
          <div className={`${styles.image} `}>
            <div className={`${styles.h_full}`}>
              <div onClick={prevImage} className={`${styles.left} `}>
                <button className={`d-flex`}>
                  {" "}
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    size="lg"
                    style={{ color: "#ffffff" }}
                  />
                </button>
              </div>
              <div onClick={nextImage} className={`${styles.right} `}>
                <button className={`d-flex`}>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    size="lg"
                    style={{ color: "#ffffff" }}
                  />
                </button>
              </div>
              <div className={`${styles.layout}`}>
                <div
                  className={`${styles.LayoutImg}`}
                  style={{
                    transform: `translateX(-${currentImage * 100}%)`,
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  {product.map((item) => {
                    return item.image.map((img, index) => {
                      return (
                        <div className={`${styles.swiper_slide}`} key={img._id}>
                          <div
                            className={`position-relative d-flex justify-content-center align-items-center`}
                          >
                            <span className={`${styles.span_slide} `}>
                              <img src={img}></img>
                            </span>
                          </div>
                        </div>
                      );
                    });
                  })}
                </div>
              </div>
              <div className={`${styles.childrenImg}`}>
                <div className={`${styles.swiperWrapper}`}>
                  {product.map((item) => {
                    return item.image.map((img, index) => {
                      return (
                        <div
                          className={`${styles.swiper_slide_img}`}
                          key={img._id}
                        >
                          <div
                            className={`position-relative d-flex justify-content-center align-items-center`}
                          >
                            <span
                              className={`${styles.span_slide_img} ${
                                index === currentImage ? styles.active : ""
                              } position-relative`}
                            >
                              <img
                                onClick={() => handlechooseImg(index)}
                                className={`${
                                  index === currentImage ? styles.active : ""
                                }`}
                                src={img}
                              ></img>
                            </span>
                          </div>
                        </div>
                      );
                    });
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.divPrice} position-sticky`}>
          {product.map((item, index) => {
            return (
              <h1 key={item._id} className={`${styles.TitleNameProduct}`}>
                {item.name}
              </h1>
            );
          })}
          <div className={`${styles.price} d-flex flex-column`}>
            {product.map((item, index) => {
              return (
                <div key={item._id}>
                  <div className={`mb-2 align-items-center`}>
                    <div className={`${styles.textPrice}`}>
                      {Number.parseInt(
                        item.priceDiscount.$numberDecimal
                      ).toLocaleString() + "đ"}
                    </div>
                    {item.discount > 0 ? (
                      <div>
                        <span className={styles.discount}>
                          {Number.parseInt(item.price).toLocaleString()}
                        </span>
                        <span className={styles.pricediscount}>
                          -{item.discount}%
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => openPopupBuy(product[0])}
              style={{
                backgroundPositionY: `50%`,
                backgroundPositionX: `${bgX}%`,
              }}
            >
              Mua
            </button>
          </div>
          <div className={styles.ListProductSame}>
            <ListProductSame></ListProductSame>
          </div>
        </div>
      </div>
      <div className={`${styles.Description} position-relative`}>
        <h2 className={` position-relative`}>Thông tin sản phẩm</h2>
        {product.map((item, idex) => {
          return (
            <div
              key={idex}
              dangerouslySetInnerHTML={{
                __html:
                  moreDescription === false
                    ? `${item.description.slice(0, 550)}`
                    : item.description,
              }}
            ></div>
          );
        })}
        <div className={styles.moreDescription}>
          <div
            onClick={handlemoreDescription}
            className="justify-content-center align-items-center d-flex"
          >
            {moreDescription === false ? `Xem thêm >` : `Thu gọn`}
          </div>
        </div>
      </div>
      <ReviewList
        productId={product.length > 0 ? product[0]._id : ""}
      ></ReviewList>

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
            <h3>{popupProduct.name}</h3>
            <p className={styles.popupPrice}>
              {Number.parseInt(
                typeof popupProduct.price === "object" &&
                  popupProduct.priceDiscount.$numberDecimal
                  ? popupProduct.priceDiscount.$numberDecimal
                  : popupProduct.priceDiscount.$numberDecimal
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
              {/* <input
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
              /> */}
              <button onClick={() => setQuantity((prev) => prev + 1)}>+</button>
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

export default DetailProduct;
