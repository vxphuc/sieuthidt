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

  const isValidVietnamPhoneNumber = (phone) => {
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return regex.test(phone);
  };

  const inputPhone = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
    if (error) setError(false);
  };

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
      navigate("/ket-noi-thuong-mai");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.wrapper} style={{
      backgroundImage: "url('/aaa.jpg')",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover",
    }}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={6} className={styles.paper}>
          <Typography variant="h6" gutterBottom align="center" style={{ fontWeight: "bold" }}>
            Chào mừng Quý Khách
            <p>
              Đến tham quan DT Group
            </p>
            
          </Typography>
          {/* <Typography variant="body2" gutterBottom align="center">
            Vui lòng nhập số điện thoại
          </Typography> */}
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
              style={{ color: "#ffff", fontWeight: "600", backgroundColor: "#087515ff" }}
            >
              {isSending ? "Đang xử lý..." : "Tham quan"}
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default Login;
