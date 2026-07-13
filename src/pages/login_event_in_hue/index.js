import { useState } from "react";
import { TextField, Button, Container, Paper, Typography } from "@mui/material";
import styles from "./login.module.css";
import axios from "axios";
import { getName, saveName } from "../../services/cartService";

const publicApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

function Login() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [dynamicLink, setDynamicLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const name = getName();

  const isValidVietnamPhoneNumber = (phone) => {
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return regex.test(phone);
  };

  const inputPhone = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
    if (error) setError(false);
    if (dynamicLink) setDynamicLink("");
    if (linkError) setLinkError("");
  };

  const handleLogin = async () => {
    if (!isValidVietnamPhoneNumber(phone)) {
      setError(true);
      return;
    }
    setIsSending(true);
    setLinkError("");
    try {
      await publicApi.post("/danh-sach-so-dien-thoai", {
        sodienthoai: phone,
      });

      if (!name || name.length === 0) {
        saveName([{ name: "", phone }]);
      } else {
        name[0].phone = phone;
        saveName(name);
      }

      const linkResponse = await publicApi.get("/qr-dong");
      const nextLink = linkResponse.data?.link;

      if (!nextLink) {
        setLinkError("Chưa có link để tiếp tục. Vui lòng liên hệ nhân viên.");
        return;
      }

      setDynamicLink(nextLink);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  const handleContinueToLink = () => {
    if (dynamicLink) {
      window.location.href = dynamicLink;
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
          <Typography variant="h6" gutterBottom align="center" style={{ fontWeight: "bold", color: "#206a37" }}>
            Nhập "Số điện thoại" để đăng nhập
            {/* <p>
              Đến tham quan DT Group
            </p> */}
            
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
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#206a37",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#206a37",
                },
              }}
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
            {linkError && (
              <Typography variant="body2" color="error">
                * {linkError}
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
              {isSending ? "Đang xử lý..." : "Tiếp tục"}
            </Button>
            {dynamicLink && (
              <div className={styles.dynamicLinkBox}>
                <Typography variant="body2" className={styles.dynamicLinkLabel}>
                  Link sự kiện
                </Typography>
                <a href={dynamicLink} target="_blank" rel="noreferrer" className={styles.dynamicLink}>
                  {dynamicLink}
                </a>
                <Button
                  fullWidth
                  variant="contained"
                  className="mt-3"
                  onClick={handleContinueToLink}
                  style={{ color: "#ffff", fontWeight: "600", backgroundColor: "#087515ff" }}
                >
                  Tiếp tục
                </Button>
              </div>
            )}
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default Login;
