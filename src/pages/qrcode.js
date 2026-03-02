import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const TARGET_URL = "https://sieuthidt.com/doi-qua-tang";

const QRCodePage = () => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    QRCode.toDataURL(TARGET_URL)
      .then((dataUrl) => {
        if (isMounted) {
          setQrCodeDataUrl(dataUrl);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setError("Khong the tao QR code. Vui long thu lai.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h2>QR Code</h2>
      <p>{TARGET_URL}</p>
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
      {qrCodeDataUrl ? <img src={qrCodeDataUrl} alt="QR code" /> : <p>Dang tao QR...</p>}
    </div>
  );
};

export default QRCodePage;
