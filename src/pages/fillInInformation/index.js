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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        axios
          .get("https://web-dt.onrender.com/sign-in/user-profile", {
            withCredentials: true,
          })
          .then((res) => {
            setData(res.data);
          });
      } catch {}
    };
    fetchUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Gửi PUT request để cập nhật thông tin
      const response = await axios.put(
        `https://web-dt.onrender.com/sign-in/${data.uid}/fillInInformation`,
        {
          name,
          gender,
        },
        {
          withCredentials: true,
        }
      )
      console.log("PUT thành công, phản hồi:", response.data);

  
      // Gọi lại API lấy thông tin mới
      const res = await axios.get("https://web-dt.onrender.com/sign-in/user-profile", {
        withCredentials: true,
      });
  
      // Đảm bảo lấy đúng object nếu là mảng
      const updatedUser = Array.isArray(res.data) ? res.data[0] : res.data;
  
      console.log("Thông tin mới:", updatedUser);
  
      if (updatedUser.name) {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
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
