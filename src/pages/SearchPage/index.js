import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import style from "./SearchPage.module.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faXmark,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import BackgroundPopup from "../../components/BackgroundPopup";
import { CartContext } from "../../contexts/CartContext";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const query = searchParams.get("q");
  const [popup, setPopup] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { fetchCartCount } = useContext(CartContext);

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!query || query.trim() === "") {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `https://dtweb.onrender.com/product/search?q=${query}`
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", err);
      }
    };

    fetchProducts();
  }, [query]);

  const handlclickpopup = async (item) => {
    setPopup(!popup);
    setPopupProduct(item);
    setQuantity(1);
  };
  const confirmAddToCart = async () => {
    const res = await axios
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
        setPopup(!popup); // đóng popup
        setQuantity(1);
      })
      .catch((error) => navigate("/dang-nhap"));
  };

  return (
    <div>
      <div className={style.titleTypeProduct}>
        <div onClick={handleGoBack} className={style.back}>
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </div>
        <span>Kết quả cho: “{query}”</span>
      </div>

      <div className={style.products}>
        {products.length === 0 ? (
          <p style={{ padding: "20px" }}>Không tìm thấy sản phẩm nào.</p>
        ) : (
          products.map((item, key) => {
            let priceDiscount = parseInt(
              item.priceDiscount?.$numberDecimal || item.price || 0
            );
            let price = Number.parseInt(item.price.$numberDecimal);
            price = price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            });

            return (
              <div key={key} className={style.product}>
                <div className={style.boxProduct}>
                  <div className={style.pro}>
                    <NavLink
                      to={`/${item.typeProduct?.[0]?.slug || "san-pham"}/${
                        item.slug
                      }`}
                    >
                      <img
                        className={style.imgProduct}
                        src={item.image?.[0]}
                        alt="product"
                      />
                    </NavLink>
                    <div className={style.title}>
                      <h3 className={style.nameProduct}>
                        {item.name.length > 30
                          ? item.name.slice(0, 30) + "..."
                          : item.name}
                      </h3>
                      <div className={style.priceProduct}>
                        {priceDiscount.toLocaleString()} VNĐ
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
                      onClick={() => handlclickpopup(item)}
                      className={style.btnBuy}
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className={!popup ? style.popup : ""} onClick={handlclickpopup}>
        <BackgroundPopup>
          <div className={style.popupCard} onClick={(e) => e.stopPropagation()}>
            <button onClick={handlclickpopup} className={style.popupClose}>
              <FontAwesomeIcon icon={faXmark} size="l" />
            </button>
            {popupProduct?.image?.[0] && (
              <img
                className={style.popupImage}
                src={popupProduct.image[0]}
                alt="product"
              />
            )}
            <h5>{popupProduct?.name}</h5>
            <div className={style.quantityControl}>
              <button onClick={() => setQuantity(quantity - 1)}>
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <input
                type="Number"
                value={quantity}
                className={style.quantityInput}
              ></input>
              <button onClick={() => setQuantity(quantity + 1)}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <button className={style.confirmBtn} onClick={confirmAddToCart}>
              Thêm vào giỏ hàng
            </button>
          </div>
        </BackgroundPopup>
      </div>
    </div>
  );
}

export default SearchPage;
