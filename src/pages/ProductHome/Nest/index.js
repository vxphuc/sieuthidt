import style from "./Nest.module.css";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { CartContext } from "../../../contexts/CartContext";
import BackgroundPopup from "../../../components/BackgroundPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";

function Nest() {
  const [product, setProduct] = useState([]);
  const { fetchCartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const openPopupBuy = (product) => {
    setPopupProduct(product);
    setQuantity(1); // reset lại số lượng
  };
  const confirmAddToCart = () => {
    if (isAdding) return; // chặn nhấn liên tục

  setIsAdding(true);
    axios
      .post(
        "https://dtweb.onrender.com/cart/create",
        {
          productID: popupProduct._id,
          quantity: quantity,
        },
        {
          withCredentials: true,
        }
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

  useEffect(() => {
    axios
      .get(`https://dtweb.onrender.com/product/ProductsNest/Thach`)
      .then((response) => {
        setProduct(response.data);
      });
  }, []);

  const handleBuy = (product) => {
    axios
      .post(
        "https://dtweb.onrender.com/cart/create",
        {
          productID: product,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        fetchCartCount();
      })
      .catch((error) => navigate("/dang-nhap"));
  };

  return (
    <div>
      <div className={`${style.Nest}`}>
        <div className={`${style.category_label}`}>Thạch </div>
        <div className={`${style.contentProduct}`}>
          {product.map((item) => {
            let priceDiscount = Number.parseInt(
              item.priceDiscount.$numberDecimal
            );
            priceDiscount = priceDiscount.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            });
            let price = Number.parseInt(item.price.$numberDecimal);
            price = price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            });
            return (
              <div className={`${style.product}`} key={item._id}>
                <NavLink to={`/${item.typeProduct[0].slug}/${item.slug}`}>
                  <img
                    className={`${style.imgproduct}`}
                    src={item.image[0]}
                    alt={item.name}
                  />
                </NavLink>
                <div className={`${style.product_info}`}>
                  <div>
                  <NavLink to={`/${item.typeProduct[0].slug}/${item.slug}`}>
                    <div className={`${style.product_name}`}>
                      {item.name.length > 35
                        ? item.name.slice(0, 30) + "..."
                        : item.name}
                    </div>
                  </NavLink>
                  <div className={`${style.product_price}`}>
                    {priceDiscount}
                  </div>
                  {item.discount > 0 ? (
                    <div>
                      <span className={style.discount}>{price}</span>
                      <span className={style.pricediscount}>
                        {" "}
                        -{item.discount}%
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                  </div>
                  <button
                    onClick={() => openPopupBuy(item)}
                    className={`${style.buy_button}`}
                  >
                    Mua
                  </button>
                </div>
              </div>
            );
          })}
          <div className={`${style.viewMore}`}>
            <NavLink to={"/san-pham/Thach"} className={`${style.seeMore}`}>
              Xem thêm
            </NavLink>
          </div>
        </div>
      </div>
      {popupProduct && (
        <BackgroundPopup
          onClick={() => setPopupProduct(null)}
          className={style.popupWrapper}
        >
          <div className={style.popupCard} onClick={(e) => e.stopPropagation()}>
            <button
              className={style.popupClose}
              onClick={() => setPopupProduct(null)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <img src={popupProduct.image[0]} className={style.popupImage} />
            <h4>{popupProduct.name}</h4>
            <p className={style.popupPrice}>
              {Number.parseInt(
                popupProduct.priceDiscount.$numberDecimal
              ).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
            <div className={style.quantityControl}>
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
                  const val = parseInt(e.target.value);
                  setQuantity(isNaN(val) || val < 1 ? 1 : val);
                }}
                className={style.quantityInput}
              />
              <button onClick={() => setQuantity((prev) => prev + 1)}> */}
              <input
                type="number"
                min="1"
                max="2"
                value={quantity}
                onChange={(e) => {
                  let val = parseInt(e.target.value);
                  if (isNaN(val) || val < 1) val = 1;
                  if (val > 2) val = 2;
                  setQuantity(val);
                }}
                className={style.quantityInput}
              />
              <button button onClick={() => setQuantity((prev) => Math.min(prev + 1, 2))}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <button className={style.confirmBtn} onClick={confirmAddToCart} disabled={isAdding}>
              {isAdding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </button>
          </div>
        </BackgroundPopup>
      )}
    </div>
  );
}

export default Nest;
