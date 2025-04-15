import style from "./SeaGrapes.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

function SeaGrapes() {
  const [product, setProduct] = useState([]);
  useEffect(() => {
    axios
      .get(`https://web-dt.onrender.com/product/ProductsNest/Rong-nho`)
      .then((response) => {
        setProduct(response.data);
      });
  }, []);

  const getcookie = (name) => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split("=");
      if (key === name) {
        return value;
      }
    }
  };

  const token = getcookie("authToken");

  const handleBuy = (product) => {
    axios
      .post(
        "https://web-dt.onrender.com/cart/create",
        {
          productID: product,
        },
        {
          withCredentials: true
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <div className={` ${style.Nest}`}>
        <div className={`${style.category_label}`}>
          Rong Nho{" "}
        </div>
        <div className={`${style.contentProduct}`}>
          {product.map((item) => {
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
                  <div className={`${style.product_price}`}>{price}</div>
                  <button
                    onClick={() => handleBuy(item._id)}
                    className={`${style.buy_button}`}
                  >
                    Mua
                  </button>
                </div>
              </div>
            );
          })}
          <div className={`${style.viewMore}`}>
            <NavLink className={`${style.seeMore}`}>Xem thêm</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeaGrapes;
