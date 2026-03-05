import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./logingift.module.css";

const Logingift = () => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!phone) {
      alert("Vui lòng nhập số điện thoại");
      return;
    }

    sessionStorage.setItem("phone", phone);

    navigate("/doimathuong");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Đăng nhập nhận quà</h2>
        <p className={styles.subtitle}>Nhập số điện thoại để tiếp tục</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onFocus={(e) => e.target.placeholder = ''}
            onBlur={(e) => e.target.placeholder = 'Nhập số điện thoại'}
            className={styles.input}
          />

          <button type="submit" className={styles.button}>
            Tiếp tục
          </button>
        </form>
      </div>
    </div>
  );
};

export default Logingift;