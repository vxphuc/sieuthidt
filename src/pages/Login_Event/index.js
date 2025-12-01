import { useState } from "react";
import { TextField, Button, Container, Paper, Typography } from "@mui/material";
import styles from "./login.module.css";
import api from "../../api/axios";
import { getName, saveName } from "../../services/cartService";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company: "",
    email: "",
  });
  const [error, setError] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const name = getName();
  const navigate = useNavigate();

  const isValidVietnamPhoneNumber = (p) => {
    // Accepts 10-digit VN numbers starting with 03/05/07/08/09 or 01x legacy prefixes.
    const regex = /^0(3|5|7|8|9)\d{8}$/;
    return regex.test(p);
  };

  // Generic input change handler for form fields
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    // keep phone numeric-only
    if (field === "phone") {
      const onlyDigits = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [field]: onlyDigits }));
      if (error) setError(false);
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error && field === "phone") setError(false);
  };

  const handleLogin = async () => {
    const { phone, name: fullName, company, email } = formData;

    if (!isValidVietnamPhoneNumber(phone)) {
      setError(true);
      return;
    }
    setIsSending(true);
    try {
      const response = await api.post("https://sieuthidt.io.vn/sign-in/event", {
        phone,
        name: fullName,
        company,
        email,
      });

      // update stored name/phone locally (cartService manages persistence)
      try {
        const current = getName() || [];
        if (!current || current.length === 0) {
          saveName([{ name: fullName || "", phone }]);
        } else {
          current[0].phone = phone;
          current[0].name = fullName || current[0].name;
          saveName(current);
        }
      } catch (e) {
        // don't block login if persistence fails
        console.warn("Could not update saved name/phone:", e);
      }

      localStorage.setItem("authToken", response.data.token);
      navigate("/event-mua-dong");
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
            Liên Hệ Hợp Tác
          </Typography>
          {/* <Typography variant="body2" gutterBottom align="center">
            Vui lòng nhập số điện thoại
          </Typography> */}
          <form onSubmit={(e) => e.preventDefault()}>
            <TextField
              fullWidth
              label="Họ Tên"
              variant="outlined"
              margin="normal"
              value={formData.name}
              onChange={handleChange("name")}
              inputProps={{ maxLength: 60 }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && formData.phone.length === 10) {
                  handleLogin();
                }
              }}
            />
            {error && (
              <Typography variant="body2" color="error">
                * Vui lòng nhập số điện thoại hợp lệ
              </Typography>
            )}
            <TextField
              fullWidth
              label="Số điện thoại"
              variant="outlined"
              margin="normal"
              value={formData.phone}
              onChange={handleChange("phone")}
              inputProps={{ maxLength: 10 }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && formData.phone.length === 10) {
                  handleLogin();
                }
              }}
            />
            {error && (
              <Typography variant="body2" color="error">
                * Vui lòng nhập số điện thoại hợp lệ
              </Typography>
            )}
            <TextField
              fullWidth
              label="Doanh nghiệp / Tổ chức"
              variant="outlined"
              margin="normal"
              value={formData.company}
              onChange={handleChange("company")}
              inputProps={{ maxLength: 60 }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && formData.phone.length === 10) {
                  handleLogin();
                }
              }}
            />
            {error && (
              <Typography variant="body2" color="error">
                * Vui lòng nhập số điện thoại hợp lệ
              </Typography>
            )}
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={formData.email}
              onChange={handleChange("email")}
              inputProps={{ maxLength: 100 }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && formData.phone.length === 10) {
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
              disabled={formData.phone.length !== 10 || isSending}
              style={{ color: "#ffff", fontWeight: "600", backgroundColor: "#087515ff" }}
            >
              {isSending ? "Đang xử lý..." : "Liên Hệ"}
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default Login;
