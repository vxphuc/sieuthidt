import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const TARGET_URL = "https://heyzine.com/flip-book/5a21d6b845.html";

const QRCodePage = () => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    let isMounted = true;

    QRCode.toDataURL(TARGET_URL, { width: 640, margin: 3 })
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

  const handleCopyQrCode = async () => {
    try {
      setCopyStatus("");

      if (navigator.clipboard && window.ClipboardItem && qrCodeDataUrl) {
        const res = await fetch(qrCodeDataUrl);
        const blob = await res.blob();
        await navigator.clipboard.write([
          new window.ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        setCopyStatus("đã copy QR.");
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(TARGET_URL);
        setCopyStatus("Trinh duyet khong ho tro copy anh. Da copy link.");
        return;
      }

      setCopyStatus("Khong the copy tren trinh duyet nay.");
    } catch (err) {
      console.error(err);
      setCopyStatus("Copy that bai. Vui long thu lai.");
    }
  };

  return (
    <div style={{ padding: 100, textAlign: "center" }}>
      <h2>QR Code</h2>
      <p>{TARGET_URL}</p>
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
      {qrCodeDataUrl ? (
        <>
          <img
            src={qrCodeDataUrl}
            alt="QR code"
            style={{ width: "min(90vw, 450px)", height: "auto" }}
          />
          <div style={{ marginTop: 16 }}>
            <button type="button" onClick={handleCopyQrCode}>
              Copy QR
            </button>
          </div>
          {copyStatus ? <p>{copyStatus}</p> : null}
        </>
      ) : (
        <p>Dang tao QR...</p>
      )}
    </div>
  );
};

export default QRCodePage;
