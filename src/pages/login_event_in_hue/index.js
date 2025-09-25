import { useState } from "react";
import { TextField, Button, Container, Paper, Typography } from "@mui/material";
import styles from "./login.module.css";
import api from "../../api/axios"; 
import { getName, saveName } from "../../services/cartService";
import { useNavigate } from "react-router-dom";

function Login() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const name = getName();
  const navigate = useNavigate();

  // Hàm kiểm tra số điện thoại Việt Nam
  const isValidVietnamPhoneNumber = (phone) => {
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return regex.test(phone);
  };

  const inputPhone = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
    if (error) setError(false);
  };

  // Đăng nhập bằng số điện thoại (API mới)
  const handleLogin = async () => {
    if (!isValidVietnamPhoneNumber(phone)) {
      setError(true);
      return;
    }
    setIsSending(true);
    try {
      const response = await api.post("https://sieuthidt.io.vn/sign-in/event", {
        phone: phone,
      });

      if (!name || name.length === 0) {
        saveName([{ name: "", phone }]);
      } else {
        name[0].phone = phone;
        saveName(name);
      }

      localStorage.setItem("authToken", response.data.token);
      navigate("/event-hue");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} className={`${styles.paper}`}>
          <p className="text-center mb-3">
            Chào Mừng Quý Khách Đến Tham Quan DT Group. Nhập Số Điện thoại tiếp tục xem Video về chúng tôi
          </p>
          <form onSubmit={(e) => e.preventDefault()}>
            <TextField
              fullWidth
              label="Số điện thoại"
              variant="outlined"
              margin="normal"
              value={phone}
              onChange={inputPhone}
              inputProps={{ maxLength: 10 }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && phone.length === 10) {
                  handleLogin();
                }
              }}
            />
            {error && (
              <Typography variant="body2" color="error">
                * Vui lòng nhập số điện thoại hợp lệ
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className="mt-3"
              onClick={handleLogin}
              disabled={phone.length !== 10 || isSending}
            >
              {isSending ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default Login;
