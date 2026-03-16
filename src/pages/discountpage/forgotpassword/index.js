import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./forgotpassword.module.css";

const ForgotPassword = () => {

  const [step, setStep] = useState(1);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const sendOTP = async () => {

    if (!phone) {
      alert("Vui lòng nhập số điện thoại");
      return;
    }
    try {
      const res = await fetch(
        "https://chatapi.io.vn/kiem-tra-nguoi-va-tai-khoan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            sodienthoai: phone
          })
        }
      );
      const data = await res.json();
      if (res.ok) {
        setOtpValue(data);
        setShowPopup(true);
        setStep(2);
      } else {
        alert("Số điện thoại không tồn tại");
      }

    } catch (error) {
      alert("Gửi OTP thất bại");
    }
  };
  const copyOTP = () => {
    navigator.clipboard.writeText(otpValue);
    alert("Đã copy OTP");
  };
  const verifyOTP = async () => {

    if (!otp) {
      alert("Vui lòng nhập OTP");
      return;
    }

    try {
      const res = await fetch(
        "https://chatapi.io.vn/check-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            sodienthoai: phone,
            otp: otp
          })
        }
      );
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("resetToken", data);
        alert("Xác nhận OTP thành công");
        setStep(3);
      } else {
        alert("OTP không đúng");
      }

    } catch (error) {
      alert("Lỗi xác nhận OTP");
    }
  };

  const changePassword = async () => {

    const token = sessionStorage.getItem("resetToken");

    if (password !== repeatPassword) {
      alert("Mật khẩu không trùng khớp");
      return;
    }

    try {

      const res = await fetch(
        "https://chatapi.io.vn/doi-mat-khau",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            passWord: password,
            RepeatpassWord: repeatPassword
          })
        }
      );

      if (res.ok) {

        alert("Đổi mật khẩu thành công");

        sessionStorage.removeItem("resetToken");

        window.location.href = "/dang-nhap-dai-ly";
      }
      else{
        alert("Đổi mật khẩu thất bại");
      }

    } catch (error) {
      alert("Lỗi đổi mật khẩu");
    }
  };

  return (
    <div className={styles.container}>
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupBox}>
            <h3>OTP của bạn</h3>
            <div className={styles.otpBox}>
              {otpValue}
            </div>
            <button
              onClick={copyOTP}
              className={styles.copyBtn}
            >
              Copy OTP
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className={styles.closeBtn}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      <div className={styles.card}>
        <h2 className={styles.title}>Quên mật khẩu</h2>
        <div className={styles.inputGroup}>
          <input
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {step === 1 && (
            <button
                className={styles.button}
                onClick={sendOTP}
            >
                Gửi OTP
            </button>
        )}
        {step === 2 && (
          <>
            <div className={styles.inputGroup}>
              <input
                placeholder="Nhập OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              className={styles.button}
              onClick={verifyOTP}
            >
              Xác nhận OTP
            </button>
          </>
        )}
        {step === 3 && (
          <>
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>

            <button
              className={styles.button}
              onClick={changePassword}
            >
              Đổi mật khẩu
            </button>
          </>
        )}

        <div className={styles.backLogin}>
          <Link to="/dang-nhap-dai-ly">
            Quay lại đăng nhập
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;