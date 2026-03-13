import React, { useState, useEffect } from "react";
import styles from "./payrewards.module.css";
import { useNavigate } from "react-router-dom";

function CheckAndApproveReward() {
  const [phone, setPhone] = useState("");
  const [rewards, setRewards] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [approvedRewards, setApprovedRewards] = useState([]);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [historyName, setHistoryName] = useState("");
  const [historyPage, setHistoryPage] = useState(1);
  const [historyData, setHistoryData] = useState([]);
  
  const handleSearchHistory = async () => {
    const token = sessionStorage.getItem("token");
    if (!historyName) {
      setMessage("Vui lòng nhập tên phần thưởng");
      return;
    }
    try {
      const res = await fetch(
        `https://staging.chatapi.io.vn/xem-lich-su-duyet-thuong-danh-cho-dai-ly?tenphanthuong=${encodeURIComponent(historyName)}&page=${historyPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setHistoryData(data);
      } else {
        setMessage("Không tìm thấy lịch sử");
      }
    } catch {
      setMessage("Lỗi kết nối server");
    }
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value.replace(/\D/g, ""));
  };
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

  useEffect(() => {
    const fetchApprovedRewards = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          "https://staging.chatapi.io.vn/danh-sach-phan-thuong-danh-cho-dai-ly",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        console.log("Danh sách phần thưởng:", data);

        if (res.ok) {
          setApprovedRewards(data);
        }
      } catch (error) {
        console.log("Lỗi lấy danh sách phần thưởng:", error);
      }
    };

    fetchApprovedRewards();
  }, []);

  const groupedRewards = approvedRewards.reduce((acc, item) => {
    const name = item.tenphanthuong;

    if (!acc[name]) {
      acc[name] = 1;
    } else {
      acc[name] += 1;
    }

    return acc;
  }, {});

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
            onChange={handlePhoneChange}
            inputMode="numeric"
            pattern="[0-9]*"
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
      {approvedRewards.length > 0 && (
        <div className={styles.approvedSection}>
          <h4>Danh sách mã trúng thưởng đã duyệt</h4>
          {Object.entries(groupedRewards).map(([name, count], index) => (
            <div key={index} className={styles.rewardItem}>
              <p>
                <b>Tên phần thưởng:</b> {name}
                {count > 1 && (
                  <span className={styles.count}> ×{count}</span>
                )}
              </p>
            </div>
          ))}
          <button
          className={styles.buttonhtory}
          onClick={() => setShowHistoryPopup(true)}
        >
          Xem lịch sử nhận thưởng
        </button>
        </div>
      )}
      {showHistoryPopup && (
        <div
          className={styles.popupOverlay}
          onClick={() => setShowHistoryPopup(false)}
        >
          <div
            className={styles.popup}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setShowHistoryPopup(false)}
            >
              ×
            </button>

            <h3 className={styles.popupTitle}>
              Tìm lịch sử nhận thưởng
            </h3>

            <div className={styles.popupForm}>
              <input
                type="text"
                placeholder="Nhập tên phần thưởng"
                value={historyName}
                onChange={(e) => setHistoryName(e.target.value)}
                className={styles.popupInput}
              />

              <input
                type="number"
                placeholder="Page"
                value={historyPage}
                onChange={(e) => setHistoryPage(e.target.value)}
                className={styles.popupInput}
              />

              <button
                className={styles.popupButton}
                onClick={handleSearchHistory}
              >
                Tìm lịch sử
              </button>
            </div>

            {historyData.length > 0 && (
              <div className={styles.historyList}>
                {historyData.map((item, index) => (
                  <div key={index} className={styles.historyItem}>
                    <p>
                      <b>Phần thưởng:</b> {item.tenphanthuong}
                    </p>

                    <p>
                      <b>SĐT:</b> {item.numberphone}
                    </p>

                    <p>
                      <b>Họ tên:</b> {item.hovaten || "Chưa cập nhật"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckAndApproveReward;
