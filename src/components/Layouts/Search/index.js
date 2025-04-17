import { TextField, InputAdornment } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import style from "./Search.module.css";
import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef  } from "react";
import axios from "axios";

function Search({ onChange, cartCount, searchValue }) {
  const [input, setInput] = useState(searchValue || "");
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const popUpRef = useRef(null);

  useEffect(() => {
    const deylayTimeOut = setTimeout(async () => {
      if (input.trim()) {
        try {
          const res = await axios.get(
            `https://web-dt.onrender.com/product/search?q=${encodeURIComponent(
              input
            )}`
          );
          if (res.data.length > 0) {
            setSuggestions(res.data);
            setIsOpen(true); // mở popup
          } else {
            setSuggestions([]);
            setIsOpen(false); // không có kết quả thì ẩn
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false); // rỗng input thì ẩn popup luôn
      }
    }, 500);

    return () => clearTimeout(deylayTimeOut);
  }, [input]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popUpRef.current && !popUpRef.current.contains(event.target)) {
        setSuggestions([]); // ẩn gợi ý
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  console.log(suggestions);


  return (
    <div className={style.searchContainer}>
      <div className={style.search}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tìm kiếm..."
        />

        {/* Giỏ hàng chèn vào trong ô tìm kiếm */}
        <NavLink to="/gio-hang">
          <div className={style.cartInside}>
            <FontAwesomeIcon icon={faCartShopping} className={style.cartIcon} />
            {cartCount > 0 && (
              <span className={style.cartBadge}>{cartCount}</span>
            )}
          </div>
        </NavLink>
      </div>

      {isOpen && suggestions.length > 0 && (
      <div className={style.popUpHeader} ref={popUpRef}>
        <p>sản phẩm gợi ý</p>
        {suggestions.map((item, index) => {
          const giatien = Number.parseInt(item.price.$numberDecimal);
          const x = giatien.toLocaleString("vi", { style: "currency", currency: "VND" });
          console.log(x);
  
          return (
            <div key={index} className={style.Product}>
              <div className={`${style.listProduct}`}>
                <a className={style.imgProduct} href="#">
                  <div className={style.listImg}>
                    <img src={item.image[0]}></img>
                  </div>
                  <div className={style.content}>
                    <h3>{(item.name.length > 30)? item.name.slice(0, 30) + `...` : item.name}</h3>
                    <strong>{x}</strong>
                  </div>
                </a>
              </div>
            </div>
          );
        })}
      </div>
       )}
    </div>
  );
}

export default Search;
