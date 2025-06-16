import { NavLink, useParams, useNavigate } from "react-router-dom";
import style from "./Product.module.css"; // chú ý tên biến style
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faPlus, faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";
import BackgroundPopup from "../../components/BackgroundPopup";

function Product() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [typeProduct, setTypeProduct] = useState([]);

  const [popupProduct, setPopupProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // ** Thêm hàm fetchCartCount để không bị lỗi 'not defined' **
  const fetchCartCount = () => {
    axios
      .get("https://dtweb.onrender.com/cart/count", { withCredentials: true })
      .then((res) => {
        console.log("Số lượng giỏ hàng hiện tại:", res.data.count);
        // Có thể cập nhật state hoặc context nếu có
      })
      .catch((err) => console.error("Lỗi lấy số lượng giỏ hàng:", err));
  };

  const openPopupBuy = (product) => {
    setPopupProduct(product);
    setQuantity(1);
  };

  const confirmAddToCart = () => {
    axios
      .post(
        "https://dtweb.onrender.com/cart/create",
        {
          productID: popupProduct._id,
          quantity: quantity,
        },
        { withCredentials: true }
      )
      .then((res) => {
        fetchCartCount(); // gọi đúng hàm này
        setPopupProduct(null);
      })
      .catch((error) => navigate("/dang-nhap"));
  };

  useEffect(() => {
    axios
      .get(`https://dtweb.onrender.com/typeProduct/detailTypeProduct/${slug}`)
      .then((response) => setTypeProduct(response.data))
      .catch((error) => console.log(error));
  }, [slug]);

  useEffect(() => {
    axios
      .get(`https://dtweb.onrender.com/product/getProducts/${slug}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.log(error));
  }, [slug]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className={`${style.titleTypeProduct}`}>
        <div onClick={handleGoBack} className={`${style.back}`}>
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </div>
        {typeProduct.map((item, index) => (
          <span key={index} className={`d-flex`}>{item.name}</span>
        ))}
      </div>

      <div className={`${style.products}`}>
        {product.map((item, key) => {
          console.log(item)
          let priceDiscount = item.priceDiscount.$numberDecimal;
          priceDiscount = Number.parseInt(priceDiscount);
          let price = item.price.$numberDecimal
          price = Number.parseInt(price);
          return (
            <div key={key} className={`${style.product}`}>
              <div className={`${style.boxProduct}`}>
                <div className={`${style.pro}`}>
                  <NavLink to={`/${item.typeProduct[0].slug}/${item.slug}`}>
                    <img className={`${style.imgProduct}`} src={item.image[0]} alt="product" />
                  </NavLink>
                  <div className={`${style.title}`}>
                    <NavLink to={``}>
                      <h3 className={style.nameProduct}>
                        {item.name.length > 30 ? item.name.slice(0, 30) + "..." : item.name}
                      </h3>
                    </NavLink>
                    <div className={style.priceProduct}>{priceDiscount.toLocaleString()} VNĐ</div>
                    <div className={``}>
                      <span className={style.discount}>{price.toLocaleString()} vnđ</span>
                      <span className={style.pricediscount}> -{item.discount}%</span>
                    </div>
                  </div>
                  <button onClick={() => openPopupBuy(item)} className={`${style.btnBuy}`}>
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {popupProduct && (
        <BackgroundPopup
          onClick={() => setPopupProduct(null)}
          className={style.popupWrapper} // Sửa từ styles -> style
        >
          <div className={style.popupCard} onClick={(e) => e.stopPropagation()}>
            <button className={style.popupClose} onClick={() => setPopupProduct(null)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <img src={popupProduct.image[0]} className={style.popupImage} />
            <h3>{popupProduct.name}</h3>
            <p className={style.popupPrice}>
              {Number.parseInt(popupProduct.priceDiscount.$numberDecimal).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
            <div className={style.quantityControl}>
              <button onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}>
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
                className={style.quantityInput}
              />
              <button onClick={() => setQuantity(prev => prev + 1)}>
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

export default Product;
