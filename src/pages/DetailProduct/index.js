import styles from "./DetailProduct.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function DetailProduct() {
  const { slug } = useParams();
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/product/${slug}`).then((response) => {
      setProduct(response.data);
    });
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={`${styles.DetailProduct}`}>
      <div className={`${styles.titleDetailProduct} d-flex`}>
        <button onClick={handleGoBack} className={`${styles.back} d-flex`}>
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </button>
        <div className={`${styles.nameProduct} d-flex`}>
          {" "}
          {product.map((item, index) => {
            return <span key={index}>{item.Typeproduct[0].name}</span>;
          })}
        </div>
      </div>
      <div className={`d-flex mt-2 mb-5`}>
        <div className={`${styles.product}`}>
          <div className={`${styles.image} py-2 position-relative`}>
            <div className={`${styles.h_full}`}>
              <div className={`${styles.left} position-absolute`}>
                <button className={`d-flex`}>
                  {" "}
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    size="lg"
                    style={{ color: "#ffffff" }}
                  />
                </button>
              </div>
              <div className={`${styles.right} position-absolute`}>
                <button className={`d-flex`}>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    size="lg"
                    style={{ color: "#ffffff" }}
                  />
                </button>
              </div>

            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default DetailProduct;
