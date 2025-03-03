import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./TypeProduct.module.css";

function TypeProduct() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTypeProducts = async () => {
      try {
        const response = await axios.get("https://web-dt.onrender.com/typeProduct");
        console.log(response.data)
        setData(response.data.typeProducts);
      } catch (error) {
        console.error("Lỗi kết nối server:", error);
      }
    };

    fetchTypeProducts();
  }, []);

  return (
    <div className="mt-3 container">
      <div className={`${styles.titleTypeProduct} text-center`}>
        <h2>Danh mục sản phẩm</h2>
      </div>
      <div className= {`row ${styles.containerTypeProduct}`}>
        {data.map((element) => (
          <div key={element._id} className="col-md-3 mt-4 text-center">
            <div className="">
              <img
              className={styles.img}
                width="100%"
                height="100%"
                src={`https://web-dt.onrender.com/uploads/${element.image}`}
              ></img>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TypeProduct;
