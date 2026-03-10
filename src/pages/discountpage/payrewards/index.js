import React, { useState, useEffect } from "react";
import styles from "./payrewards.module.css";
import { useNavigate } from "react-router-dom";

function CheckAndApproveReward() {
  const [phone, setPhone] = useState("");
  const [rewards, setRewards] = useState([]);
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

      console.log("API DATA:", data);

      if (data.detail === "Permission denied" && res.status === 403) {
        setMessage("Đợi duyệt đăng ký đại lý để kiểm tra phần thưởng");
        setRewards([]);
        return;
      }

      if (res.ok && Array.isArray(data) && data.length > 0) {
        setRewards(data);
        setMessage(`Tìm thấy ${data.length} phần thưởng`);
      } else {
        setRewards([]);
        setMessage("Không tìm thấy người trúng thưởng");
      }
    } catch {
      setMessage("Lỗi kết nối server");
    }
  };

  const handleApprove = async (id) => {
    const token = sessionStorage.getItem("token");

    try {
      const res = await fetch(
        `https://staging.chatapi.io.vn/duyet-phan-thuong?idnguoitrungthuong=${id}`,
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
        setRewards((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, "trạng thái nhận thưởng": "đã nhận thưởng" }
              : item
          )
        );
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
            className={styles.input}
          />

          <button type="submit" className={styles.button}>
            Kiểm tra
          </button>
        </form>

        {rewards.length > 0 && (
          <div className={styles.result}>
            {rewards.map((item) => {
              const status =
                item["trạng thái nhận thưởng"] ||
                item["trang_thai_nhan_thuong"] ||
                "không rõ";

              return (
                <div key={item.id} className={styles.rewardItem}>
                  <p>
                    <b>Tên phần thưởng:</b> {item.tenphanthuong}
                  </p>

                  <p>
                    <b>Trạng thái:</b> {status}
                  </p>

                  {status !== "đã nhận thưởng" && (
                    <button
                      onClick={() => handleApprove(item.id)}
                      className={styles.button}
                    >
                      Duyệt phần thưởng
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

export default CheckAndApproveReward;