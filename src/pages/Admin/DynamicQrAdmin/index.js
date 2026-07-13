import axios from "axios";
import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import styles from "./DynamicQrAdmin.module.css";

const publicApi = axios.create({
  baseURL: process.env.REACT_APP_SIEU_THI_API,
  timeout: 10000,
});

function DynamicQrAdmin() {
  const [link, setLink] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const buildQr = async (value) => {
    if (!value) {
      setQrImage("");
      return;
    }

    const dataUrl = await QRCode.toDataURL(value, {
      width: 640,
      margin: 3,
    });
    setQrImage(dataUrl);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCurrentQr = async () => {
      try {
        const response = await publicApi.get("/qr-dong");
        if (!isMounted) return;

        const currentLink = response.data?.link || "";
        setLink(currentLink);
        if (currentLink) {
          const dataUrl = await QRCode.toDataURL(currentLink, {
            width: 640,
            margin: 3,
          });
          if (isMounted) {
            setQrImage(dataUrl);
          }
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Khong the tai link QR hien tai.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCurrentQr();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = async (event) => {
    const value = event.target.value;
    setLink(value);
    setMessage("");
    setError("");

    try {
      await buildQr(value.trim());
    } catch (err) {
      console.error(err);
      setQrImage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const value = link.trim();
      await publicApi.patch("/admin/qr-dong", { link: value });
      await buildQr(value);
      setMessage("Da cap nhat link QR thanh cong.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Cap nhat link QR that bai.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Quan tri QR dong</p>
        <h1>Thay doi link ma QR</h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="dynamic-qr-link">
          Link hien tai
        </label>
        <div className={styles.inputRow}>
          <input
            id="dynamic-qr-link"
            className={styles.input}
            type="url"
            value={link}
            onChange={handleChange}
            placeholder="https://example.com"
            disabled={loading || saving}
            required
          />
          <button className={styles.button} type="submit" disabled={loading || saving}>
            {saving ? "Dang luu" : "Luu"}
          </button>
        </div>
      </form>

      {message ? <p className={styles.success}>{message}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.preview}>
        <h2>Xem truoc QR</h2>
        {loading ? <p className={styles.status}>Dang tai...</p> : null}
        {!loading && !qrImage ? <p className={styles.status}>Nhap link de tao QR.</p> : null}
        {qrImage ? <img src={qrImage} alt="QR dong" className={styles.qrImage} /> : null}
      </div>
    </div>
  );
}

export default DynamicQrAdmin;

