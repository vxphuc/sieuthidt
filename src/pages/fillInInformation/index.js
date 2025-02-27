import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Typography,
} from "@mui/material";
import axios from "axios";
import Styles from "./fillInInformation.module.css";

const UserForm = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [data, setData] = useState("");
  const navigate = useNavigate()

  const getCookie = (name) => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split("=");
      if (key === name) return value;
    }
    return null;
  };
  const token = getCookie("authToken");
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        axios
          .get("https://web-dt.onrender.com/sign-in/user-profile", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setData(res.data);
          });
      } catch {}
    };
    fetchUserProfile();
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(
      `https://web-dt.onrender.com/sign-in/${data.uid}/fillInInformation`,
      {
        name,
        gender,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    navigate('/', { replace: true })
    if (data.name) {
      navigate('/', { replace: true })
    }
  };

  return (
    <div className={Styles.container}>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Điền thông tin
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Tên"
            variant="outlined"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Giới tính</InputLabel>
            <Select value={gender} onChange={(e) => setGender(e.target.value)}>
              <MenuItem value="nam">Nam</MenuItem>
              <MenuItem value="nữ">Nữ</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Gửi
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default UserForm;
