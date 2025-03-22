import { TextField, InputAdornment } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import style from "./Search.module.css";

function Search() {
  return (
    <div className={style.searchContainer}>
      <div className={style.search}>
        <input placeholder="Tìm kiếm..."></input>
      </div>
    </div>
  );
}

export default Search;
