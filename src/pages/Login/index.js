import { useEffect, useState } from "react";
import { TextField, Button, Container, Paper, Typography } from "@mui/material";
import styles from "./login.module.css";
import api from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { getName, saveName } from "../../services/cartService";

const OTP_SESSION_KEY = "loginOtpSession";
const OTP_SESSION_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();
  const name = getName();
  const location = useLocation();

  useEffect(() => {
    const raw = localStorage.getItem(OTP_SESSION_KEY);
    if (!raw) return;

    try {
      const session = JSON.parse(raw);
      if (!session?.phone || !session?.expiresAt) {
        localStorage.removeItem(OTP_SESSION_KEY);
        return;
      }

      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(OTP_SESSION_KEY);
        return;
      }

      setPhone(session.phone);
      setIsOtpSent(true);
      if (session.resendAvailableAt) {
        const remaining = Math.ceil((session.resendAvailableAt - Date.now()) / 1000);
        setResendCooldown(remaining > 0 ? remaining : 0);
      }
    } catch {
      localStorage.removeItem(OTP_SESSION_KEY);
    }
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;

    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const saveOtpSession = (numberPhone, resendAvailableAt) => {
    const session = {
      phone: numberPhone,
      expiresAt: Date.now() + OTP_SESSION_TTL_MS,
      resendAvailableAt,
    };
    localStorage.setItem(OTP_SESSION_KEY, JSON.stringify(session));
  };

  const clearOtpSession = () => {
    localStorage.removeItem(OTP_SESSION_KEY);
  };

  const isValidVietnamPhoneNumber = (value) => {
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return regex.test(value);
  };

  const inputPhone = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
    if (error) setError(false);
  };

  const sendOtpRequest = async () => {
    if (!isValidVietnamPhoneNumber(phone)) {
      setError(true);
      return;
    }

    const resendAvailableAt = Date.now() + OTP_RESEND_COOLDOWN_MS;

    setIsSending(true);
    try {
      await api.post("/sign-in/create-otp", {
        numberPhone: phone,
      });
      setIsOtpSent(true);
      setResendCooldown(Math.ceil(OTP_RESEND_COOLDOWN_MS / 1000));
      saveOtpSession(phone, resendAvailableAt);
    } catch (err) {
      console.error("Lỗi gửi OTP:", err);
      alert("Không gửi được OTP. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSendOtp = async () => {
    await sendOtpRequest();
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isSending) return;
    await sendOtpRequest();
  };

  const handleVerifyOtp = async () => {
    setIsSending(true);
    try {
      const response = await api.post("/sign-in", {
        numberPhone: phone,
        otp,
      });

      if (!name || name.length === 0) {
        saveName([{ name: "", phone }]);
      } else {
        name[0].phone = phone;
        saveName(name);
      }

      localStorage.setItem("authToken", response.data.token);
      clearOtpSession();

      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, { replace: true });
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      console.error("Lỗi xác thực OTP:", err);
      alert("Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} className={styles.paper}>
          <p className={styles.titleLogin}>
            Nhập <strong>Số điện thoại</strong> để đăng nhập
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
                "& .MuiInputLabel-root": { color: "#206a37" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#206a37" },
                "& .MuiOutlinedInput-root": {
                  color: "#206a37",
                  "& fieldset": { borderColor: "#206a37", borderRadius: 10 },
                  "&:hover fieldset": { borderColor: "#206a37", borderRadius: 10 },
                  "&.Mui-focused fieldset": { borderColor: "#206a37", borderRadius: 10 },
                },
                "& .MuiOutlinedInput-input": { color: "#206a37" },
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
              <>
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
                    "& .MuiInputLabel-root": { color: "#206a37" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#206a37" },
                    "& .MuiOutlinedInput-root": {
                      color: "#206a37",
                      "& fieldset": { borderColor: "#206a37", borderRadius: 10 },
                      "&:hover fieldset": { borderColor: "#206a37", borderRadius: 10 },
                      "&.Mui-focused fieldset": { borderColor: "#206a37", borderRadius: 10 },
                    },
                    "& .MuiOutlinedInput-input": { color: "#206a37" },
                  }}
                />
                <Button
                  fullWidth
                  variant="text"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || isSending}
                  sx={{ color: "#206a37", mt: 0.5, textTransform: "none" }}
                >
                  {resendCooldown > 0
                    ? `Lấy lại mã sau ${resendCooldown}s`
                    : "Lấy lại mã OTP"}
                </Button>
              </>
            )}
            {!isOtpSent ? (
              <Button
                fullWidth
                variant="contained"
                className={styles.btnBackLogin}
                sx={{ backgroundColor: "#206a37", color: "#ffffff", borderRadius: "15px", mt: 1 }}
                onClick={handleSendOtp}
                disabled={phone.length !== 10 || isSending}
              >
                {isSending ? "Đang gửi..." : "Đăng nhập"}
              </Button>
            ) : (
              <Button
                className={styles.btnBackLogin}
                fullWidth
                variant="contained"
                sx={{ backgroundColor: "#206a37", color: "#ffffff", borderRadius: "15px", mt: 1 }}
                onClick={handleVerifyOtp}
                disabled={otp.length < 4 || isSending}
              >
                {isSending ? "Đợi xác thực..." : "Xác thực OTP"}
              </Button>
            )}
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default Login;
