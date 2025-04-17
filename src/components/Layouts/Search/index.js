import { TextField, InputAdornment } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import style from "./Search.module.css";
import { NavLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Search({ onChange, cartCount, searchValue }) {
  const [input, setInput] = useState(searchValue || "");
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const deylayTimeOut = setTimeout(async () => {
      if (input.trim()) {
        try {
          const res = await axios.get(
            `https://web-dt.onrender.com/product/search?q=${encodeURIComponent(
              input
            )}`
          );
          setSuggestions(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    }, 500);

    return () => clearTimeout(deylayTimeOut);
  }, [input]);

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
      <div className={style.popUpHeader}>
        <p>sản phẩm gợi ý</p>
        {suggestions.map((item, index) => {
          return <div className={style.Product}>aa</div>;
        })}
      </div>
    </div>
  );
}

export default Search;
