import React, { useState } from "react";
import styles from "./registerAccount.module.css";

function RegisterAccount() {
  const [sodienthoai, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const extractErrorMessage = (detail) => {
    if (!detail) return "Đăng ký thất bại. Vui lòng thử lại!";
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((item) => (item && typeof item === "object" ? item.msg : String(item)))
        .filter(Boolean)
        .join(" | ");
    }
    if (typeof detail === "object") {
      if (typeof detail.msg === "string") return detail.msg;
      return JSON.stringify(detail);
    }
    return String(detail);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sodienthoai || !password || !repeatPassword) {
      setMessage("Vui lòng điền đầy đủ thông tin!");
      setMessageType("error");
      return;
    }

    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(sodienthoai)) {
      setMessage("Số điện thoại không hợp lệ!");
      setMessageType("error");
      return;
    }

    if (password !== repeatPassword) {
      setMessage("Mật khẩu không khớp!");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch('https://kocapi.io.vn/dang-ky-voi-mat-khau', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        sodienthoai: sodienthoai,
        passWords: password,
        RepeatpassWords: repeatPassword,
        })
      });

      const data = await response.json();
      if (response.ok) {
        if (data){
          sessionStorage.setItem("token", data);
        }
        setMessage("Đăng ký thành công!");
        setMessageType("success");
        setTimeout(() => {
          window.location.href = "/dang-ky-dai-ly";
        }, 1000);
      } else {
        setMessage(extractErrorMessage(data?.detail));
        setMessageType("error");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setMessage("Có lỗi xảy ra. Vui lòng thử lại!");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2 className={styles.title}>Đăng ký tài khoản</h2>
        <p className={styles.subtitle}>Tạo tài khoản bằng số điện thoại và mật khẩu</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Số điện thoại:</label>
            <input
              id="phone"
              type="tel"
              value={sodienthoai}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              placeholder="Nhập số điện thoại"
              className={styles.input}
              onFocus={(e) => {
                e.target.placeholder = "";
              }}
              onBlur={(e) => {
                e.target.placeholder = "Nhập số điện thoại";
              }}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Mật khẩu:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className={styles.input}
              onFocus={(e) => {
                e.target.placeholder = "";
              }}
              onBlur={(e) => {
                e.target.placeholder = "Nhập mật khẩu";
              }}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="repeatPassword">Nhập lại mật khẩu:</label>
            <input
              id="repeatPassword"
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className={styles.input}
              onFocus={(e) => {
                e.target.placeholder = "";
              }}
              onBlur={(e) => {
                e.target.placeholder = "Nhập lại mật khẩu";
              }}
            />
          </div>

          {message && (
            <p className={messageType === "success" ? styles.successMessage : styles.errorMessage}>
              {message}
            </p>
          )}

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterAccount;
