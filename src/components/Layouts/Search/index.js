import { TextField, InputAdornment } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import style from "./Search.module.css";

function Search({ cartCount }) {
  return (
    <div className={style.searchContainer}>
      <div className={style.search}>
        <input placeholder="Tìm kiếm..." />

        {/* Giỏ hàng chèn vào trong ô tìm kiếm */}
        <div className={style.cartInside}>
          <FontAwesomeIcon icon={faCartShopping} className={style.cartIcon} />
          {cartCount > 0 && (
            <span className={style.cartBadge}>{cartCount}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
