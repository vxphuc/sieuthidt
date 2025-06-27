import style from "./SeaweedJelly.module.css";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { CartContext } from "../../../contexts/CartContext";
import BackgroundPopup from "../../../components/BackgroundPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";

function SeaweedJelly() {
  const [product, setProduct] = useState([]);
  const { fetchCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const [popupProduct, setPopupProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const openPopupBuy = (product) => {
    setPopupProduct(product);
    setQuantity(1); // reset lại số lượng
  };
  const confirmAddToCart = () => {
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
      .catch((error) => navigate("/dang-nhap"));
  };

  useEffect(() => {
    axios
      .get(`https://dtweb.onrender.com/product/ProductsNest/Thach-Rong-Nho`)
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
        <div className={`${style.category_label}`}>Thạch rong nho </div>
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
          <div className={`${style.viewMore} text-center`}>
            <NavLink
              to={"/san-pham/Thach-Rong-Nho"}
              className={`${style.seeMore}`}
            >
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
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setQuantity(isNaN(val) || val < 1 ? 1 : val);
                }}
                className={style.quantityInput}
              />
              <button onClick={() => setQuantity((prev) => prev + 1)}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <button className={style.confirmBtn} onClick={confirmAddToCart}>
              Thêm vào giỏ hàng
            </button>
          </div>
        </BackgroundPopup>
      )}
    </div>
  );
}

export default SeaweedJelly;
