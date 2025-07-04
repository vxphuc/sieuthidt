import { NavLink, useParams, useNavigate } from "react-router-dom";
import style from "./Product.module.css"; // chú ý tên biến style
import { useState, useEffect, useContext  } from "react";
import { CartContext } from "../../contexts/CartContext";
import api from "../../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faPlus,
  faMinus,
  faXmark,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import BackgroundPopup from "../../components/BackgroundPopup";

function Product() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [typeProduct, setTypeProduct] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [filterPopup, setFilterPopup] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [showProduct, setShowProduct] = useState(20);

  // ** Thêm hàm fetchCartCount để không bị lỗi 'not defined' **
  // const fetchCartCount = () => {
  //   api
  //     .get("/cart/count", { withCredentials: true })
  //     .then((res) => {
  //       console.log("Số lượng giỏ hàng hiện tại:", res.data.count);
  //       // Có thể cập nhật state hoặc context nếu có
  //     })
  //     .catch((err) => console.error("Lỗi lấy số lượng giỏ hàng:", err));
  // };
  const { fetchCartCount } = useContext(CartContext);
  const openPopupBuy = (product) => {
    setPopupProduct(product);
    setQuantity(1);
  };

  const openPopupfilter = () => {
    setFilterPopup(!filterPopup);
  };

  const confirmAddToCart = () => {
    if (isAdding) return; // chặn nếu đang gửi
    setIsAdding(true);
    api.post(
        "/cart/create",
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
      .catch((error) => navigate("/dang-nhap"))
      .finally(() => setIsAdding(false));
  };

  useEffect(() => {
    api
      .get(`/typeProduct/detailTypeProduct/${slug}`)
      .then((response) => setTypeProduct(response.data))
      .catch((error) => console.log(error));
  }, [slug]);

  useEffect(() => {
    api
      .get(
        `/product/getProducts/${slug}?filter=${selectedFilter}&num=${showProduct}`
      )
      .then((response) => setProduct(response.data))
      .catch((error) => console.log(error));
  }, [slug, selectedFilter, showProduct]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const applyFilter = (filter) => {
    setSelectedFilter(filter);
  };

  const submitFormfilter = (e) => {
    e.preventDefault();

    setFilterPopup(!filterPopup);
  };

  const handleShowMore = (e) => {
    setShowProduct((prev) => prev + 10);
    e.preventDefault();
  };
  return (
    <div>
      <div className={`${style.titleTypeProduct}`}>
        <div onClick={handleGoBack} className={`${style.back}`}>
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </div>
        {typeProduct.map((item, index) => (
          <span key={index} className={`d-flex`}>
            {item.name}
          </span>
        ))}
        <div onClick={openPopupfilter} className={style.filterControl}>
          <FontAwesomeIcon icon={faFilter} size="lg" /> Bộ lọc
        </div>
      </div>

      <div className={`${style.products}`}>
        {product.map((item, key) => {
          let priceDiscount = item.priceDiscount.$numberDecimal;
          priceDiscount = Number.parseInt(priceDiscount);
          let price = item.price.$numberDecimal;
          price = Number.parseInt(price);
          return (
            <div key={key} className={`${style.product}`}>
              <div className={`${style.boxProduct}`}>
                <div className={`${style.pro}`}>
                  <NavLink to={`/${item.typeProduct[0].slug}/${item.slug}`}>
                    <img
                      className={`${style.imgProduct}`}
                      src={item.image[0]}
                      alt="product"
                    />
                  </NavLink>
                  <div className={`${style.title}`}>
                    <NavLink to={``}>
                      <h3 className={style.nameProduct}>
                        {item.name.length > 30
                          ? item.name.slice(0, 30) + "..."
                          : item.name}
                      </h3>
                    </NavLink>
                    <div className={style.priceWrapper}>
                    <div className={style.priceProduct}>
                      {priceDiscount.toLocaleString()} VNĐ
                    </div>
                    <div className={style.oldPriceWrapper}>
                      {item.discount > 0 && (
                        <>
                          <span className={style.discount}>
                            {price.toLocaleString()} VNĐ
                          </span>
                          <span className={style.pricediscount}>
                            -{item.discount}%
                          </span>
                        </>
                      )}
                    </div>
                    {/* <div className={style.stockDisplay}>
                      Tồn kho: {item.quantity}
                    </div> */}
                  </div>
                  </div>
                  <button
                    onClick={() => openPopupBuy(item)}
                    className={`${style.btnBuy}`}
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center">
        <button
          className={style.showProduct}
          onClick={(e) => handleShowMore(e)}
        >
          Xem Thêm
        </button>
      </div>

      {popupProduct && (
        <BackgroundPopup
          onClick={() => setPopupProduct(null)}
          className={style.popupWrapper} // Sửa từ styles -> style
        >
          <div className={style.popupCard} onClick={(e) => e.stopPropagation()}>
            <button
              className={style.popupClose}
              onClick={() => setPopupProduct(null)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <img src={popupProduct.image[0]} className={style.popupImage} />
            <h3>{popupProduct.name}</h3>
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
                  const value = parseInt(e.target.value);
                  setQuantity(isNaN(value) || value < 1 ? 1 : value);
                }}
                className={style.quantityInput}
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
                className={style.quantityInput}
              />
              {/* <button onClick={() => setQuantity((prev) => prev + 1)}> */}
              <button onClick={() => setQuantity((prev) => Math.min(prev + 1, 2))}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <button type="button" className={style.confirmBtn} onClick={confirmAddToCart} disabled={isAdding}>
              {isAdding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </button>
          </div>
        </BackgroundPopup>
      )}

      {/* bộ lọc sản phẩm */}
      <div className={filterPopup ? "" : style.display_none}>
        <BackgroundPopup onClick={openPopupfilter}>
          <div
            onClick={(e) => e.stopPropagation()}
            className={style.popupFillter}
          >
            <div className={style.titlePopup}>
              <h3 className="text-center">Bộ Lọc Nâng Cao</h3>
              <button onClick={openPopupfilter} className={style.buttonclose}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className={style.fillter}>
              <div className={style.fillterItem}>
                <h5>Sắp xếp sản phẩm</h5>
                <div
                  onClick={() => applyFilter("highToLow")}
                  className={`${style.item} ${
                    selectedFilter === "highToLow" ? style.activeItem : ""
                  }`}
                >
                  Giá cao đến thấp
                </div>
                <div
                  onClick={() => applyFilter("lowToHigh")}
                  className={`${style.item} ${
                    selectedFilter === "lowToHigh" ? style.activeItem : ""
                  }`}
                >
                  Giá thấp đến cao
                </div>
                <div
                  onClick={() => applyFilter("biggestDiscount")}
                  className={`${style.item} ${
                    selectedFilter === "biggestDiscount" ? style.activeItem : ""
                  }`}
                >
                  Khuyến mãi cao nhất
                </div>
              </div>
            </div>
            <button
              onClick={(e) => submitFormfilter(e)}
              className={style.submitfilter}
            >
              Áp dụng
            </button>
          </div>
        </BackgroundPopup>
      </div>
    </div>
  );
}

export default Product;
