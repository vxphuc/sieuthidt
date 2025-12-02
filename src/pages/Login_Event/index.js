import { useState } from "react";
import { TextField, Button, Container, Paper, Typography, Snackbar, Alert } from "@mui/material";
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
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    phone: "",
    company: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
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
    // clear inline field error for this field
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    // if a snackbar message is visible, hide it when the user starts typing
    if (snackbarOpen) setSnackbarOpen(false);
    if (error && field === "phone") setError(false);
  };

  const handleLogin = async () => {
    const { phone, name: fullName, company, email } = formData;

    // Validate required fields
    const errors = {};
    if (!fullName || fullName.trim() === "") {
      errors.name = "Họ & Tên là bắt buộc";
    }
    if (!company || company.trim() === "") {
      errors.company = "Tên doanh nghiệp / tổ chức là bắt buộc";
    }
    if (!phone || phone.length !== 10) {
      errors.phone = "Số điện thoại phải gồm 10 chữ số";
    } else if (!isValidVietnamPhoneNumber(phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      setError(true);

      // Show a concise snackbar message combining missing-field messages
      const messages = [];
      if (errors.name) messages.push(errors.name);
      if (errors.company) messages.push(errors.company);
      if (errors.phone) messages.push(errors.phone);
      setSnackbarMessage(messages.join(" — "));
      setSnackbarOpen(true);

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
            <p>ĐĂNG KÝ TƯ VẤN</p>
            <p>Liên Hệ Hợp Tác</p>
          </Typography>
          {/* <Typography variant="body2" gutterBottom align="center">
            Vui lòng nhập số điện thoại
          </Typography> */}
          <form onSubmit={(e) => e.preventDefault()}>
            <TextField
              fullWidth
              label="Họ & Tên"
              variant="outlined"
              margin="normal"
              value={formData.name}
              onChange={handleChange("name")}
              inputProps={{ maxLength: 60 }}
              required
              error={Boolean(fieldErrors.name)}
              helperText={fieldErrors.name || ""}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && formData.phone.length === 10) {
                  handleLogin();
                }
              }}
            />
            {/* name errors shown inline via TextField helperText */}
            <TextField
              fullWidth
              label="Số Điện Thoại"
              variant="outlined"
              margin="normal"
              value={formData.phone}
              onChange={handleChange("phone")}
              inputProps={{ maxLength: 10 }}
              required
              error={Boolean(fieldErrors.phone)}
              helperText={fieldErrors.phone || ""}
              onKeyDown={(e) => {
                if (e.key === "Enter" && formData.phone.length === 10) {
                  handleLogin();
                }
              }}
            />
            {/* phone errors shown inline via TextField helperText */}
            <TextField
              fullWidth
              label="Tên Doanh nghiệp / Tổ chức"
              variant="outlined"
              margin="normal"
              value={formData.company}
              onChange={handleChange("company")}
              inputProps={{ maxLength: 60 }}
              required
              error={Boolean(fieldErrors.company)}
              helperText={fieldErrors.company || ""}
              onKeyDown={(e) => {
                if (e.key === "Enter" && formData.phone.length === 10) {
                  handleLogin();
                }
              }}
            />
            {/* company errors shown inline via TextField helperText */}
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
            {/* general error message removed — field errors are shown inline */}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={`mt-3 ${styles.sparkleBtn}`}
              onClick={handleLogin}
              disabled={isSending}
              style={{ color: "#ffff", fontWeight: "600", backgroundColor: "#087515ff" }}
            >
              {isSending ? "Đang xử lý..." : "Liên Hệ"}
            </Button>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: "100%" }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default Login;
