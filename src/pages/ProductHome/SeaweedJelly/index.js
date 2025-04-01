import style from "./SeaweedJelly.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

function SeaweedJelly() {
  const [product, setProduct] = useState([]);
  useEffect(() => {
    axios
      .get(`https://web-dt.onrender.com/product/ProductsNest/Thach-rong-nho`)
      .then((response) => {
        setProduct(response.data);
      });
  }, []);
  return (
    <div>
      <div className={`position-relative ${style.Nest}`}>
        <div className={`${style.category_label} position-absolute`}>
          Thạch rong nho{" "}
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
                <NavLink to = {`/${item.typeProduct[0].slug}/${item.slug}`}>
                  <img
                    className={`${style.imgproduct}`}
                    src={item.image[0]}
                    alt={item.name}
                  />
                </NavLink>
                <div className={`${style.product_info}`}>
                  <NavLink to = {`/${item.typeProduct[0].slug}/${item.slug}`}> 
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

export default SeaweedJelly;
