import api from "../../api/axios";
import styles from "./ListProductSame.module.css";
import { useEffect, useState, memo } from "react";
import { NavLink } from "react-router-dom";

function ListProductSame() {
  const [product, Setproduct] = useState([]);
  useEffect(() => {
    api
      .get(`/product/getAllProducts`)
      .then((res) => Setproduct(res.data));
  }, []);


  return (
    <div className={`${styles.ListProductSames}`}>
      <div className={`${styles.titleListProductSame}`}>Sản phẩm liên quan</div>
      <div className={`${styles.listProductSame}`}>
        <div className={`${styles.productSame}`}>
          {[...product]
            .sort(() => Math.random() - 0.5)
            .map((item, index) => {
              return (
                <NavLink
                  to={`/${item.typeProduct[0].slug}/${item.slug}`}
                  key={index}
                >
                  <div>
                    <div className={`${styles.product}`}>
                      <span className={`${styles.img}`}>
                        <img src={item.image[0]} alt={item.name} />
                      </span>
                      <div className={`${styles.infoProduct}`}>
                        <div className={`${styles.nameProduct}`}>
                          {item.name.length > 20
                            ? item.name.slice(0, 20) + "..."
                            : item.name}
                        </div>
                        <div className={`${styles.priceProduct}`}>
                          {Number.parseInt(item.priceDiscount.$numberDecimal).toLocaleString() + `đ`}
                        </div>
                      </div>
                    </div>
                  </div>
                </NavLink>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default memo(ListProductSame);
