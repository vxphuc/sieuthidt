import { useState } from "react";
import { TextField, Button, Container, Paper, Typography } from "@mui/material";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../../config/firebaseConfig";
import axios from "axios";
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
  const name = getName()

  // Hàm kiểm tra số điện thoại Việt Nam
  const isValidVietnamPhoneNumber = (phone) => {
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return regex.test(phone);
  };

  const formatPhoneNumber = (phone) => {
    if (!phone.startsWith("+")) {
      return `+84${phone.slice(1)}`; // 0901234567 -> +84901234567
    }
    return phone;
  };

  const inputPhone = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Chỉ nhận số
    setPhone(value);
    if (error) setError(false);
  };

  // Gửi OTP
  const handleSendOtp = async () => {
    if (!isValidVietnamPhoneNumber(phone)) {
      setError(true);
      setPhone("");
      return;
    }

    if (isSending) return; // chặn nếu đang gửi

    setIsSending(true); // khóa nút
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              console.log("reCAPTCHA solved:", response);
            },
          }
        );
      }

      const formattedPhone = formatPhoneNumber(phone);

      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );
      setConfirmationResult(confirmation);
      setIsOtpSent(true);
      alert("OTP đã được gửi!");
    } catch (error) {
      console.error("Lỗi gửi OTP:", error);
      alert("Không thể gửi OTP. Vui lòng thử lại sau.");
    } finally {
      setIsSending(false); // mở lại nút sau khi xử lý xong
    }
  };

  // Xác thực OTP
  const handleVerifyOtp = async () => {
    setIsSending(true);
    if (!confirmationResult) {
      alert("Không tìm thấy kết quả xác thực.");
      return;
    }
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const idToken = await user.getIdToken();

      setToken(idToken);
      alert("Xác thực thành công!");

      // Gửi token lên backend
      const response = await api.post("/sign-in", {
        idToken,
        numberPhone: phone,
      });
      name[0].phone = phone
      saveName(name)

      // console.log("Đăng nhập thành công:", response.data);
      // Lưu dữ liệu người dùng và token vào localStorage theo đúng format backend trả về
      localStorage.setItem("authToken", idToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // Chuyển hướng về trang chủ
      window.location.href = "/";
    } catch (error) {
      console.error("Lỗi xác thực OTP:", error);
      alert("Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
    } finally {
      setIsSending(false); // mở lại nút sau khi xử lý xong
    }
  };

  return (
    <div className={styles.wrapper}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} className={`${styles.paper}`}>
          <p  className="text-center mb-3">
            Để xem "Đơn hàng của bạn" vui lòng nhập Số điện thoại đã đặt hàng
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
                if (e.key === "Enter" && !isOtpSent && phone.length === 10) {
                  handleSendOtp();
                }
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
                label="Mã OTP"
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
              />
            )}
            {!isOtpSent ? (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className="mt-3"
                onClick={handleSendOtp}
                disabled={phone.length !== 10 || isSending}
              >
                {isSending ? "Đang gửi..." : "Gửi OTP"}
              </Button>
            ) : (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className="mt-3"
                onClick={handleVerifyOtp}
                disabled={otp.length < 4 || isSending}
              >
                {isSending ? "Đợi Xác Thực..." : "Xác Thực OTP"}
              </Button>
            )}
          </form>
        </Paper>
        {/* Đảm bảo luôn có div này trên DOM! */}
        <div id="recaptcha-container"></div>
      </Container>
    </div>
  );
}

export default Login;
