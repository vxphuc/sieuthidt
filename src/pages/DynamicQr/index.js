import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import axios from "axios";
import styles from "./DynamicQr.module.css";

const publicApi = axios.create({
  baseURL: process.env.REACT_APP_SIEU_THI_API,
  timeout: 10000,
});

function DynamicQr() {
  const [qrData, setQrData] = useState(null);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchQr = async () => {
      try {
        const response = await publicApi.get("/qr-dong");
        if (!isMounted) return;

        setQrData(response.data);
        if (response.data?.link) {
          const dataUrl = await QRCode.toDataURL(response.data.link, {
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
          setError("Khong the tai ma QR. Vui long thu lai sau.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchQr();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>QR dong</p>
          <h1>Ma QR hien tai</h1>
        </div>

        {loading ? <p className={styles.status}>Dang tai...</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        {!loading && !error && !qrData?.link ? (
          <p className={styles.status}>Chua co link QR.</p>
        ) : null}

        {qrImage ? (
          <div className={styles.qrWrap}>
            <img src={qrImage} alt="QR dong" className={styles.qrImage} />
            <a className={styles.link} href={qrData.link} target="_blank" rel="noreferrer">
              {qrData.link}
            </a>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default DynamicQr;
