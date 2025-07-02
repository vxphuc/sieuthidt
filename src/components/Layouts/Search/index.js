import { TextField, InputAdornment } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import style from "./Search.module.css";
import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import {CartContext} from "../../../contexts/CartContext";


function Search({ onChange, onCartChange, searchValue }) {
  const [input, setInput] = useState(searchValue || "");
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const popUpRef = useRef(null);
  const {cartCount} = useContext(CartContext); // lấy số lượng sản phẩm trong giỏ hàng từ context
 
  

  useEffect(() => {
    const deylayTimeOut = setTimeout(async () => {
      if (input.trim()) {
        try {
          const res = await axios.get(
            `https://dtweb.onrender.com/product/search?q=${encodeURIComponent(
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

  return (
    <div className={style.searchContainer}>
      <div className={style.search}>
        <div className={style.inputWithIcon}>
          <FontAwesomeIcon icon={faSearch} className={style.searchIcon} />
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              navigate(`/tim-kiem?q=${encodeURIComponent(input)}`);
              setIsOpen(false); // ẩn popup nếu có
            }
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tìm sản phẩm..."
        />
        </div>
        {/* Giỏ hàng chèn vào trong ô tìm kiếm */}
        <NavLink to="/gio-hang">
          <div className={style.cartInside}>
            <FontAwesomeIcon icon={faCartShopping} className={style.cartIcon} />
          </div>
        </NavLink>
      </div>

      <NavLink to={'/gio-hang'} className = {style.NumberPopUp}>{cartCount}</NavLink>


      {isOpen && suggestions.length > 0 && (
        <div className={style.popUpHeader} ref={popUpRef}>
          <p>sản phẩm gợi ý</p>
          {suggestions.map((item, index) => {
            const giatien = Number.parseInt(item.priceDiscount.$numberDecimal);
            const x = giatien.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            });

            return (
              <div key={index} className={style.Product}>
                <div className={`${style.listProduct}`}>
                  <NavLink
                    className={style.imgProduct}
                    to={`/${item.typeProduct[0].slug}/${item.slug}`}
                  >
                    <div className={style.listImg}>
                      <img src={item.image[0]}></img>
                    </div>
                    <div className={style.content}>
                      <h3>
                        {item.name.length > 30
                          ? item.name.slice(0, 30) + `...`
                          : item.name}
                      </h3>
                      <strong>{x}</strong>
                    </div>
                  </NavLink>
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
