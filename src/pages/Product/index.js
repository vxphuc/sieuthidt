import { NavLink, useParams, useNavigate } from "react-router-dom";
import style from "./Product.module.css";
import { useState, useEffect, useContext } from "react";
import { CartContext } from "../../contexts/CartContext";
import api from "../../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft, faPlus, faMinus, faXmark, faFilter,
} from "@fortawesome/free-solid-svg-icons";
import BackgroundPopup from "../../components/BackgroundPopup";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getCart, saveCart } from "../../services/cartService";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const { fetchCartCount } = useContext(CartContext);

  const openPopupBuy = (product) => {
    setPopupProduct(product);
    setQuantity(1);
  };

  const openPopupfilter = () => setFilterPopup(!filterPopup);

  const confirmAddToCart = () => {
    if (isAdding) return;
    setIsAdding(true);
    let cart = getCart();
    const productInCart = cart.findIndex((item) => item.id === popupProduct._id);
    if(productInCart !== -1) {
      cart[productInCart].quantity += quantity;
    }else{
      cart.push({
        id: popupProduct._id,
        name: popupProduct.name,
        image: popupProduct.image[0],
        price: popupProduct.price.$numberDecimal,
        quantity: quantity,
      })
    }
    saveCart(cart)
    window.dispatchEvent(new Event("cart-updated"));
    setPopupProduct(null)
    setIsAdding(false)
  };

  useEffect(() => {
    api.get(`/typeProduct/detailTypeProduct/${slug}`)
      .then((response) => setTypeProduct(response.data))
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(
      `/product/getProducts/${slug}?filter=${selectedFilter}&num=${showProduct}`
    )
    .then((response) => {
      setProduct(response.data);
      setHasMore(response.data.length === showProduct); // Nếu sp ít hơn num, nghĩa là hết
    })
    .catch(() => setError("Không tải được sản phẩm"))
    .finally(() => setLoading(false));
  }, [slug, selectedFilter, showProduct]);

  const handleGoBack = () => navigate(-1);

  const applyFilter = (filter) => {
    setSelectedFilter(filter);
    setShowProduct(20); // reset số lượng khi filter
    setFilterPopup(false); // đóng popup luôn
  };

  const submitFormfilter = (e) => {
    e.preventDefault();
    setFilterPopup(false);
  };

  const handleShowMore = (e) => {
    setShowProduct((prev) => prev + 10);
    e.preventDefault();
  };

  return (
    <div>
      <div className={style.titleTypeProduct}>
        <div onClick={handleGoBack} className={style.back}>
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </div>
        {typeProduct.map((item) => (
          <span key={item._id} className="d-flex">{item.name}</span>
        ))}
        <div onClick={openPopupfilter} className={style.filterControl}>
          <FontAwesomeIcon icon={faFilter} size="lg" /> Bộ lọc
        </div>
      </div>

      {loading && <div className={style.loading}>Đang tải sản phẩm...</div>}
      {error && <div className={style.error}>{error}</div>}

      <div className={style.products}>
        {product.map((item) => {
          let priceDiscount = Number.parseInt(item.priceDiscount?.$numberDecimal || item.priceDiscount);
          let price = Number.parseInt(item.price?.$numberDecimal || item.price);
          return (
            <div key={item._id} className={style.product}>
              <div className={style.boxProduct}>
                <div className={style.pro}>
                  <NavLink to={`/${item.typeProduct[0].slug}/${item.slug}`}>
                    <LazyLoadImage
                      className={style.imgProduct}
                      src={item.image[0]}
                      alt="product"
                      effect="blur"
                    />
                  </NavLink>
                  <div className={style.title}>
                    <NavLink to="">
                      <h3 className={style.nameProduct}>
                        {item.name.length > 30 ? item.name.slice(0, 30) + "..." : item.name}
                      </h3>
                    </NavLink>
                    <div className={style.priceWrapper}>
                      <div className={style.priceProduct}>
                        {priceDiscount.toLocaleString()} VNĐ
                      </div>
                      <div className={style.oldPriceWrapper}>
                        {item.discount > 0 && (
                          <>
                            <span className={style.discount}>{price.toLocaleString()} VNĐ</span>
                            <span className={style.pricediscount}> -{item.discount}%</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => openPopupBuy(item)} className={style.btnBuy}>
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more khi còn sản phẩm */}
      {hasMore && !loading && !error && (
        <div className="text-center">
          <button className={style.showProduct} onClick={handleShowMore}>
            Xem Thêm
          </button>
        </div>
      )}

      {popupProduct && (
        <BackgroundPopup
          onClick={() => setPopupProduct(null)}
          className={style.popupWrapper}
        >
          <div className={style.popupCard} onClick={(e) => e.stopPropagation()}>
            <button className={style.popupClose} onClick={() => setPopupProduct(null)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <LazyLoadImage src={popupProduct.image[0]} className={style.popupImage} />
            <h3>{popupProduct.name}</h3>
            <p className={style.popupPrice}>
              {Number.parseInt(popupProduct.priceDiscount?.$numberDecimal || popupProduct.priceDiscount)
                .toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </p>
            <div className={style.quantityControl}>
              <button onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}>
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
              <button onClick={() => setQuantity((prev) => prev + 1)}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <button type="button" className={style.confirmBtn} onClick={confirmAddToCart} disabled={isAdding}>
              {isAdding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </button>
          </div>
        </BackgroundPopup>
      )}

      {/* Bộ lọc sản phẩm */}
      <div className={filterPopup ? "" : style.display_none}>
        <BackgroundPopup onClick={openPopupfilter}>
          <div onClick={(e) => e.stopPropagation()} className={style.popupFillter}>
            <div className={style.titlePopup}>
              <h3 className="text-center">Bộ Lọc Nâng Cao</h3>
              <button onClick={openPopupfilter} className={style.buttonclose}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className={style.fillter}>
              <div className={style.fillterItem}>
                <h5>Sắp xếp sản phẩm</h5>
                <div onClick={() => applyFilter("highToLow")}
                  className={`${style.item} ${selectedFilter === "highToLow" ? style.activeItem : ""}`}>
                  Giá cao đến thấp
                </div>
                <div onClick={() => applyFilter("lowToHigh")}
                  className={`${style.item} ${selectedFilter === "lowToHigh" ? style.activeItem : ""}`}>
                  Giá thấp đến cao
                </div>
                <div onClick={() => applyFilter("biggestDiscount")}
                  className={`${style.item} ${selectedFilter === "biggestDiscount" ? style.activeItem : ""}`}>
                  Khuyến mãi cao nhất
                </div>
              </div>
            </div>
            <button onClick={submitFormfilter} className={style.submitfilter}>
              Áp dụng
            </button>
          </div>
        </BackgroundPopup>
      </div>
    </div>
  );
}

export default Product;
