import { NavLink, useParams, useNavigate } from "react-router-dom";
import style from "./Product.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

function Product() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [typeProduct, setTypeProduct] = useState([]);

  useEffect(() => {
    axios
      .get(`https://web-dt.onrender.com/typeProduct/detailTypeProduct/${slug}`)
      .then((response) => {
        setTypeProduct(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [slug]);
  useEffect(() => {
    axios
      .get(`https://web-dt.onrender.com/product/getProducts/${slug}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [slug]);

  const handleGoBack = () => {
    navigate(-1);
  };
console.log(product)
  return (
    <div>
      <div className={`${style.titleTypeProduct} d-flex`}>
        <div onClick={handleGoBack} className={`${style.back} d-flex`}>
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </div>
        {typeProduct.map((item) => {
          return <span className={`d-flex`}>{item.name}</span>;
        })}
      </div>

      <div className={`${style.products} d-flex`}>
        {product.map((item, key) => {
          let price = item.price.$numberDecimal;
          price = Number.parseInt(price);
          return (
            <div key={key} className={`${style.product}`}>
              <div className={`${style.boxProduct}`}>
                <div className={`d-flex flex-column`}>
                  <NavLink to={`/${item.typeProduct[0].slug}/${item.slug}`}>
                    <img
                      className={`${style.imgProduct}`}
                      src={item.image[0]}
                      alt="product"
                    />
                  </NavLink>
                  <div className={`d-flex flex-column ${style.title}`}>
                    <NavLink to={``}>
                      <h3 className={style.nameProduct}>
                        {item.name.length > 30
                          ? item.name.slice(0, 30) + "..."
                          : item.name}
                      </h3>
                    </NavLink>
                    <div className={style.priceProduct}>
                      {price.toLocaleString()} VNĐ
                    </div>
                  </div>
                  <button className={` ${style.btnBuy}`}>Mua ngay</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Product;
