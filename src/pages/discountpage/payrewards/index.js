import React, { useState, useEffect } from "react";
import styles from "./payrewards.module.css";
import { useNavigate } from "react-router-dom";

function CheckAndApproveReward() {
  const [phone, setPhone] = useState("");
  const [winnerId, setWinnerId] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/dang-nhap-dai-ly", {
        state: { from: "/duyet-phan-thuong" },
      });
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;

      if (Date.now() > exp) {
        sessionStorage.removeItem("token");
        navigate("/dang-nhap-dai-ly", {
          state: { from: "/duyet-phan-thuong" },
        });
      }
    } catch {
      sessionStorage.removeItem("token");
      navigate("/dang-nhap-dai-ly");
    }
  }, [navigate]);

  const handleCheckPhone = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");

    try {
      const res = await fetch(
        `https://staging.chatapi.io.vn/kiem-tra-nguoi-trung-thuong?sdt=${phone}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if(data.detail === "Permission denied" && res.status === 403){
        setWinnerId("");
        setStatus("");
        setMessage("Đợi duyệt đăng ký đại lý để kiểm tra phần thưởng");
        return;
      }
      if (res.ok) {
        setWinnerId(data.id);
        setStatus(data["trạng thái nhận thưởng"]);
        setMessage(`SĐT: ${data.numberphone} - ${data["trạng thái nhận thưởng"]}`);
      } else {
        setMessage("Không tìm thấy người trúng thưởng");
      }
    } catch {
      setMessage("Lỗi kết nối server");
    }
  };

  const handleApprove = async () => {
    const token = sessionStorage.getItem("token");

    try {
      const res = await fetch(
        `https://staging.chatapi.io.vn/duyet-phan-thuong?idnguoitrungthuong=${winnerId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Duyệt phần thưởng thành công");
        setStatus("Đã nhận thưởng");
      } else {
        setMessage(data.detail || "Duyệt thất bại");
      }
    } catch {
      setMessage("Lỗi kết nối server");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <p className={styles.title}>Kiểm tra & Duyệt phần thưởng</p>

        <form onSubmit={handleCheckPhone} className={styles.form}>
          <input
            type="text"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onFocus={(e) => e.target.placeholder = ""}
            onBlur={(e) => e.target.placeholder = "Nhập số điện thoại"}
            className={styles.input}
          />

          <button type="submit" className={styles.button}>
            Kiểm tra
          </button>
        </form>

        {winnerId && (
          <div className={styles.result}>
            <p>ID người trúng thưởng: {winnerId}</p>
            <p>Trạng thái: {status}</p>

            {status !== "Đã nhận thưởng" && (
              <button
                onClick={handleApprove}
                className={styles.button}
              >
                Duyệt phần thưởng
              </button>
            )}
          </div>
        )}

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

export default CheckAndApproveReward;