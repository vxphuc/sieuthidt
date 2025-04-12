import { useState } from "react";
import { TextField, Button, Container, Paper, Typography } from "@mui/material";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../../config/firebaseConfig";
import axios from "axios";
import styles from "./login.module.css";

function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(false);
  const [token, setToken] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const isValidVietnamPhoneNumber = (phone) => {
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return regex.test(phone);
  };
  const checkNumber = (number) => {
    const regex = /[^0-9]/;
    return regex.test(number);
  };

  const formatPhoneNumber = (phone) => {
    if (!phone.startsWith("+")) {
      return `+84${phone.slice(1)}`; // Chuyển 0901234567 thành +84901234567
    }
    return phone;
  };

  const inputPhone = (e) => {
    setPhone(e.target.value);
    if (checkNumber(e.target.value)) {
      setPhone("");
    }
  };

  const handleSendOtp = async () => {
    // Kiểm tra số điện thoại
    if (!isValidVietnamPhoneNumber(phone)) {
      setError(true);
      setPhone("");
    } else {
      setError(false);
      setIsOtpSent(true);
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

        // Chuyển số điện thoại sang định dạng +84
        const formattedPhone = formatPhoneNumber(phone);

        // Gửi OTP với số điện thoại đã định dạng
        const appVerifier = window.recaptchaVerifier;
        const confirmation = await signInWithPhoneNumber(
          auth,
          formattedPhone,
          appVerifier
        );
        setConfirmationResult(confirmation);
        alert("OTP đã được gửi!");
      } catch (error) {
        console.error("Lỗi gửi OTP:", error);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
      alert("Không tìm thấy kết quả xác thực.");
      return;
    }
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const idToken = await user.getIdToken(); // Lấy ID Token từ Firebase
      setToken(idToken);
      alert("Xác thực thành công!");
      // Gửi token lên backend
      const response = await axios.post("http://localhost:5000/sign-in", {
        idToken,
        numberPhone: phone,
      },{
          withCredentials: true, 
      });
      console.log("Response từ backend:", response.data);
      window.location.href = '/'
    } catch (error) {
      console.error("Lỗi xác thực OTP:", error);
      alert("Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
    }
  };

  return (
    <div className={styles.wrapper}>
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} className={`${styles.paper}`}>
        <Typography variant="h5" className="text-center mb-3">
          Đăng Nhập
        </Typography>
        <form>
          <TextField
            fullWidth
            label="Số điện thoại"
            variant="outlined"
            margin="normal"
            value={phone}
            onChange={inputPhone}
          />
          {error ? (
            <Typography variant="body2" color="error">
              *vui lòng nhập sô điện thoại hợp lệ
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
            />
          )}
          {!isOtpSent ? (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className="mt-3"
              onClick={handleSendOtp}
            >
              Gửi OTP
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className="mt-3"
              onClick={handleVerifyOtp}
            >
              Xác thực OTP
            </Button>
          )}
        </form>
      </Paper>
      <div id="recaptcha-container"></div>
    </Container>
    </div>
  );
}

export default Login;
