import { useState } from "react";
import { TextField, Button, Container, Paper, Typography } from "@mui/material";
import styles from "./login.module.css";
import api from "../../api/axios"; // Import axios instance
import { useNavigate } from "react-router-dom";
import { getName, saveName } from "../../services/cartService";

function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(false);
  const [token, setToken] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const name = getName();

  // Hàm kiểm tra số điện thoại Việt Nam
  const isValidVietnamPhoneNumber = (phone) => {
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return regex.test(phone);
  };

  const inputPhone = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Chỉ nhận số
    setPhone(value);
    if (error) setError(false);
  };

  const handleSendOtp = async () =>{
    setIsOtpSent(!isOtpSent)
    const response = await api.post('/sign-in/create-otp', {
      numberPhone: phone
    })
    console.log(response)
  }

  // Xác thực OTP
  const handleVerifyOtp = async () => {
    setIsSending(true);
    try {
      // Gửi token lên backend
      const response = await api.post("/sign-in", {
        numberPhone: phone,
        otp
      });
      if (!name || name.length === 0) {
        // Nếu chưa có tên, lưu tên mới
        saveName([{ name: "", phone }]);
      } else {
        name[0].phone = phone;
        saveName(name);
      }
      localStorage.setItem("authToken", response.data.token);
      if (window.history.length > 2) {
        window.history.back();
        setTimeout(() => {
            window.location.reload(); 
        }, 100);
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error("Lỗi xác thực OTP:", error);
      alert("Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Container component="main" maxWidth="xs" >
        <Paper elevation={3} className={`${styles.paper}`}>
          <p className={styles.titleLogin}>
            Để xem <b>"Đơn hàng của bạn"</b> vui lòng nhập Số điện thoại đã đặt hàng
          </p>
          <form onSubmit={(e) => e.preventDefault()}>
            <TextField
              fullWidth
              label="Số điện thoại*"
              variant="outlined"
              margin="normal"
              value={phone}
              onChange={inputPhone}
              inputProps={{ maxLength: 10 }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isOtpSent && phone.length === 10) {
                  handleSendOtp();
                }
              }}
              sx={{
                '& .MuiInputLabel-root': { color: '#206a37' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#206a37' },
                '& .MuiOutlinedInput-root': {
                  color: '#206a37',
                  '& fieldset': { borderColor: '#206a37', borderRadius: 10 },
                  '&:hover fieldset': { borderColor: '#206a37', borderRadius: 10 },
                  '&.Mui-focused fieldset': { borderColor: '#206a37', borderRadius: 10 },
                },
                '& .MuiOutlinedInput-input': { color: '#206a37' }
              }}
            />
            {error ? (
              <Typography variant="body2" color="error">
                *vui lòng nhập số điện thoại hợp lệ
              </Typography>
            ) : (
              ""
            )}
            {isOtpSent && (
              <TextField
                fullWidth
                label="Mã OTP Zalo"
                variant="outlined"
                margin="normal"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputProps={{ maxLength: 6 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && otp.length >= 4) {
                    handleVerifyOtp();
                  }
                }}
                sx={{
                '& .MuiInputLabel-root': { color: '#206a37' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#206a37' },
                '& .MuiOutlinedInput-root': {
                  color: '#206a37',
                  '& fieldset': { borderColor: '#206a37', borderRadius: 10 },
                  '&:hover fieldset': { borderColor: '#206a37', borderRadius: 10 },
                  '&.Mui-focused fieldset': { borderColor: '#206a37', borderRadius: 10 },
                },
                '& .MuiOutlinedInput-input': { color: '#206a37' }
              }}
              />
            )}
            {!isOtpSent ? (
              <Button
                fullWidth
                variant="contained"
                className={styles.btnBackLogin}
                sx={{ backgroundColor: '#206a37', color: '#ffffff', borderRadius: '15px', mt: 1 }}
                onClick={handleSendOtp}
                // onClick={handleVerifyOtp}
                disabled={phone.length !== 10 || isSending}
              >
                {isSending ? "Đang gửi..." : "đăng nhập"}
              </Button>
            ) : (
              <Button
                className={styles.btnBackLogin}
                fullWidth
                variant="contained"
                sx={{ backgroundColor: '#206a37', color: '#ffffff', borderRadius: '15px', mt: 1 }}
                onClick={handleVerifyOtp}
                disabled={otp.length < 4 || isSending}
              >
                {isSending ? "Đợi Xác Thực..." : "Xác Thực OTP"}
              </Button>
            )}
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default Login;
