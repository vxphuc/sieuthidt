import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./logingift.module.css";

const Logingift = () => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    setPhone(e.target.value.replace(/\D/g, ""));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!phone || !name) {
      alert("Vui lòng nhập đủ thông tin");
      return;
    }
    sessionStorage.setItem("phone", phone);
    sessionStorage.setItem("name", name);
    navigate("/doimathuong");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Thông Tin Nhận Thưởng</h2>
        <p className={styles.subtitle}>Vui lòng nhập tên và số điện thoại</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Nhập tên nhận thưởng"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            onFocus={(e) => e.target.placeholder = ''}
            onBlur={(e) => e.target.placeholder = 'Nhập tên nhận thưởng'}
            className={styles.input}
          />

          <input
            type="text"
            placeholder="Nhập số điện thoại"
            value={phone}
            required
            onChange={handlePhoneChange}
            inputMode="numeric"
            pattern="[0-9]*"
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
