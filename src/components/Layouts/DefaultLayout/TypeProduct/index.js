import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./TypeProduct.module.css";
import { NavLink } from "react-router-dom";

function TypeProduct() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTypeProducts = async () => {
      try {
        const response = await axios.get("https://web-dt.onrender.com/typeProduct");
        setData(response.data.typeProducts);
      } catch (error) {
        console.error("Lỗi kết nối server:", error);
      }
    };

    fetchTypeProducts();
  }, []);

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.button} text-center`}>
        <button>DANH MỤC SẢN PHẨM</button>
      </div>
      <div className= {`${styles.containerTypeProduct}`}>
        {data.map((element) => (
          <NavLink to={`/san-pham/${element.slug}`} key={element._id} className={`${styles.typeProduct}`}>
            <span>{element.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default TypeProduct;
