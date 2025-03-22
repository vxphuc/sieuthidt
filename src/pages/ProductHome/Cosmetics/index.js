import style from "./Cosmetics.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

function Cosmetics() {
  const [product, setProduct] = useState([]);
  useEffect(() => {
    axios
      .get(`https://web-dt.onrender.com/product/ProductsNest/My-Pham`)
      .then((response) => {
        setProduct(response.data);
      });
  }, []);

  return (
    <div>
      <div className={`position-relative ${style.Nest}`}>
        <div className={`${style.category_label} position-absolute`}>
          Mỹ phẩm{" "}
        </div>
        <div className={`${style.contentProduct} d-flex`}>
          {product.map((item) => {
            let price = Number.parseInt(item.price.$numberDecimal);
            price = price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            });
            return (
              <div className={`${style.product}`} key={item._id}>
                <NavLink>
                  <img
                    className={`${style.imgproduct}`}
                    src={item.image}
                    alt={item.name}
                  />
                </NavLink>
                <div className={`${style.product_info}`}>
                  <NavLink>
                    <div className={`${style.product_name}`}>
                      {item.name.length > 35
                        ? item.name.slice(0, 30) + "..."
                        : item.name}
                    </div>
                  </NavLink>
                  <div className={`${style.product_price}`}>{price}</div>
                  <button className={`${style.buy_button}`}>Mua</button>
                </div>
              </div>
            );
          })}
          <div className={`${style.viewMore} text-center`}>
            <NavLink className={`${style.seeMore}`}>Xem thêm</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cosmetics;
