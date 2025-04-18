import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import style from "./SearchPage.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const query = searchParams.get("q");


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
            let price = parseInt(item.price?.$numberDecimal || item.price || 0);

            return (
              <div key={key} className={style.product}>
                <div className={style.boxProduct}>
                  <div className={style.pro}>
                    <NavLink to={`/${item.typeProduct?.[0]?.slug || "san-pham"}/${item.slug}`}>
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
                        {price.toLocaleString()} VNĐ
                      </div>
                    </div>
                    <button className={style.btnBuy}>Mua ngay</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SearchPage;
