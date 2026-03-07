import React, { useState, useEffect } from "react";
import styles from "./payrewards.module.css";
import { Navigate } from "react-router-dom";

function PayRewards() {
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      Navigate("/dang-nhap-dai-ly", {
        state: { from: "/duyet-phan-thuong" }
      });
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;
      if (Date.now() > exp) {
        sessionStorage.removeItem("token");
        Navigate("/dang-nhap-dai-ly", {
          state: { from: "/duyet-phan-thuong" }
        });
      }
    } catch {
      sessionStorage.removeItem("token");
      Navigate("/dang-nhap-dai-ly", {
        state: { from: "/duyet-phan-thuong" }
      });
    }
  }, [Navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");

    if (!token) {
      window.location.href = "/dang-nhap-dai-ly";
      return;
    }

    try {
      const response = await fetch(
        `https://staging.chatapi.io.vn/duyet-phan-thuong?idnguoitrungthuong=${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Duyệt phần thưởng thành công");
      } else {
        setMessage(data.detail);
      }
    } catch {
      setMessage("Lỗi kết nối server");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>Duyệt phần thưởng</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Nhập ID người trúng thưởng"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className={styles.input}
            required
          />

          <button type="submit" className={styles.button}>
            Duyệt thưởng
          </button>
        </form>

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

export default PayRewards;