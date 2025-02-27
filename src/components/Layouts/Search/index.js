import { TextField, InputAdornment } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function Search() {
    return (
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm..."
          sx={{
            width: "30%",
            height: "30px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
              borderColor: "#f5821e",
              transition: "0.3s",
              "&:hover": { borderColor: "#00670d" },
              "&.Mui-focused": { borderColor: "#00670d" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faSearch} style={{ color: "#f5821e" }} />
              </InputAdornment>
            ),
          }}
        />
      );
}

export default Search;