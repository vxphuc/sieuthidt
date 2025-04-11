import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./TypeProduct.module.css";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";

function TypeProduct() {
  const [data, setData] = useState([]);
  const [showList, setShowList] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef(null);

  // xử lý ẩn hiện loại sp
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
  
      if (currentScrollY > lastScrollY) {
        setShowTitle(false); // Cuộn xuống -> ẩn dòng tiêu đề
      } else {
        setShowTitle(true); // Cuộn lên -> hiện lại
      }
  
      setLastScrollY(currentScrollY);
    };
  
    window.addEventListener("scroll", handleScroll);
  
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowList(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  //kết thúc xử lý

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
      {showTitle && (
      <div className={`${styles.button} text-center`}>
        <button>
          DANH MỤC SẢN PHẨM
          <FontAwesomeIcon
            className={styles.icon}
            icon={faCaretDown}
            onClick={() => setShowList(!showList)}
            style={{ cursor: "pointer" }}
          />
        </button>
      </div>
      )}
      <div ref={menuRef} className={`${styles.containerTypeProduct} ${showList ? styles.show : styles.hide}`}>
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
