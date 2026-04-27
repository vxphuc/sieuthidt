import React, { useState, useEffect } from "react";
import styles from "./payrewards.module.css";
import { useNavigate } from "react-router-dom";

function CheckAndApproveReward() {

  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [rewards, setRewards] = useState([]);
  const [message, setMessage] = useState("");

  const [approvedRewards, setApprovedRewards] = useState([]);

  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [rewardList, setRewardList] = useState([]);
  const [selectedReward, setSelectedReward] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [historyData, setHistoryData] = useState([]);

  // kiểm tra token
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/dang-nhap-dai-ly", {
        state: { from: "/duyet-phan-thuong" }
      });
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;
      if (Date.now() > exp) {
        sessionStorage.removeItem("token");
        navigate("/dang-nhap-dai-ly", {
          state: { from: "/duyet-phan-thuong" }
        });
      }
    } catch {
      sessionStorage.removeItem("token");
      navigate("/dang-nhap-dai-ly");
    }
  }, [navigate]);

  // lấy danh sách sự kiện
  useEffect(() => {
    const fetchEvents = async () => {
      const token = sessionStorage.getItem("token");
      try {

        const res = await fetch(
          "https://kocapi.io.vn/xem-su-kien-doi-qua-daily",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const data = await res.json();
        if (res.ok) {
          setEvents(data);
        }
      } catch (error) {
        console.log("Lỗi lấy sự kiện", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchRewards = async () => {
      const token = sessionStorage.getItem("token");

      try {
        const res = await fetch(
          "https://kocapi.io.vn/danh-sach-phan-thuong-danh-cho-dai-ly",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (res.ok) {
          setRewardList(data);
        }

      } catch (error) {
        console.log("Lỗi lấy danh sách phần thưởng", error);
      }
    };

    fetchRewards();
  }, []);

  // kiểm tra số điện thoại
  const handleCheckPhone = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    try {
      const res = await fetch(
        `https://kocapi.io.vn/kiem-tra-nguoi-trung-thuong?data=${phone}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        const filteredRewards = data.filter(
          (item) =>
            !item.tenphanthuong?.toLowerCase().includes("may mắn lần sau")
        );
        setRewards(filteredRewards);
        if (filteredRewards.length > 0) {
          setMessage(`Tìm thấy ${filteredRewards.length} phần thưởng`);
        } else {
          setMessage("Không có phần thưởng");
        }
      } else {
        setRewards([]);
        setMessage("Không tìm thấy người trúng thưởng");
      }
    } catch {
      setMessage("Lỗi kết nối server");
    }
  };

  // duyệt thưởng
  const handleApprove = async (id) => {
    const token = sessionStorage.getItem("token");
    try {
      const res = await fetch(
        `https://kocapi.io.vn/duyet-phan-thuong?idnguoitrungthuong=${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
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

  const formatDateTimeLocal = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };
  useEffect(() => {
    const now = new Date();
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(now.getDate() - 7);

    setStartDate(formatDateTimeLocal(sevenDaysAgo));
    setEndDate(formatDateTimeLocal(now));
  }, []);

  // xem lịch sử
  const handleViewHistory = async () => {
    const token = sessionStorage.getItem("token");
    if (!startDate || !endDate) {
      setMessage("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
      return;
    }
    try {
      let url =
        `https://kocapi.io.vn/xem-lich-su-duyet-thuong-danh-cho-dai-ly?ngaybatdau=${startDate}&ngayketthuc=${endDate}`;

      if (selectedEvent) {
        url += `&tensukien=${encodeURIComponent(selectedEvent)}`;
      }
      if (selectedReward) {
        url += `&phanthuong=${encodeURIComponent(selectedReward)}`;
      }
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (res.ok) {
        setHistoryData(data);
      }
    } catch {
      setMessage("Lỗi lấy lịch sử");
    }
  };

  const groupedHistory = Object.values(
    historyData.reduce((acc, item) => {
      const phone = item.numberphone.replace(/^84/, "0");
      if (!acc[phone]) {
        acc[phone] = {
          numberphone: phone,
          hovaten: item.hovaten,
          rewards: []
        };
      }
      acc[phone].rewards.push({
        tenphanthuong: item.tenphanthuong,
        soluong: item.soluong,
        tensukien: item.tensukien
      });
      return acc;
    }, {})
    
  );

  const totalPhones = groupedHistory.length;
  const totalQuantity = historyData.reduce(
    (sum, item) => sum + (item.soluong || 0),
    0
  );
  const totalNames = new Set(
    groupedHistory
      .map(u => (u.hovaten || "").trim())
      .filter(name => name && name !== "chưa cập nhật")
  ).size;

  const totalRewards = new Set(
    historyData.map(item => item.tenphanthuong)
  ).size;

  const totalEvents = new Set(
    historyData.map(item => item.tensukien)
  ).size;

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const maskPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    const normalizedPhone = String(phoneNumber);
    if (normalizedPhone.length <= 5) return normalizedPhone;
    return `${"*".repeat(Math.min(5, normalizedPhone.length - 5))}${normalizedPhone.slice(-5)}`;
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
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Kiểm tra
          </button>
        </form>
        {rewards.length > 0 && (
          <div className={styles.result}>
            {rewards
            .filter(
              (item) =>
                !item.tenphanthuong?.toLowerCase().includes("may mắn lần sau")
            )
            .map((item) => {
              const status =
                item["trạng thái nhận thưởng"] ||
                item["trang_thai_nhan_thuong"] ||
                "không rõ";

              return (
                <div key={item.id} className={styles.rewardItem}>
                  <p><b>Tên phần thưởng:</b> {item.tenphanthuong}</p>
                  <p><b>Trạng thái:</b> {status}</p>

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
      <button
          className={styles.buttonhtory}
          onClick={() => {
            setShowHistoryPopup(true);
            setTimeout(() => {
              handleViewHistory();
            }, 100);
          }}
        >
          Xem danh sách duyệt thưởng
      </button>

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

            <div className={styles.popupTitle}>
              Xem lịch sử duyệt thưởng
            </div>
            <div className={styles.popupForm}>
              <select
                className={styles.popupInput}
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
              >
                <option value="">Tất cả sự kiện</option>

                {events.map((event) => (
                  <option key={event.id} value={event.tensukien}>
                    {event.tensukien}
                  </option>
                ))}
              </select>
              <select
                className={styles.popupInput}
                value={selectedReward}
                onChange={(e) => setSelectedReward(e.target.value)}
              >
                <option value="">Tất cả phần thưởng</option>

                {rewardList.map((reward) => (
                  <option key={reward.id} value={reward.tenphanthuong}>
                    {reward.tenphanthuong}
                  </option>
                ))}
              </select>

              <div className={styles.dateItem}>
                  <span className={styles.dateLabel}>Từ</span>
                  <input
                    type="datetime-local"
                    step="60"
                    className={styles.popupInput}
                    value={startDate || ""}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
              </div>

              <div className={styles.dateItem}>
                  <span className={styles.dateLabel}>Đến</span>
                  <input
                    type="datetime-local"
                    step={60}
                    className={styles.popupInput}
                    value={endDate || ""}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
              </div>

              <button
                className={styles.popupButton}
                onClick={handleViewHistory}
              >
                Xem lịch sử
              </button>
            </div>
              {groupedHistory.length > 0 && (
                <>
                  {/* destop */}
                  <div className={styles.desktopTable}>
                    <table className={styles.historyTable}>
                      <thead>
                        <tr>
                          <th>Số điện thoại</th>
                          <th>Họ và tên</th>
                          <th>Phần thưởng</th>
                          <th>Số lượng</th>
                          <th>Sự kiện</th>
                        </tr>
                      </thead>

                      <tbody>
                        {groupedHistory.map((user, index) =>
                          user.rewards.map((r, i) => (
                            <tr key={index + "-" + i}>
                              {i === 0 && (
                                <>
                                  <td rowSpan={user.rewards.length}>{maskPhoneNumber(user.numberphone)}</td>
                                  <td rowSpan={user.rewards.length}>{user.hovaten || "chưa cập nhật"}</td>
                                </>
                              )}
                              <td>{r.tenphanthuong}</td>
                              <td>{r.soluong}</td>
                              <td>{r.tensukien}</td>
                            </tr>
                          ))
                        )}
                        <tr className={styles.totalRow}>
                          <td><b>{totalPhones} SĐT</b></td>
                          <td><b>{totalNames} tên</b></td>
                          <td><b>{totalRewards} phần thưởng</b></td>
                          <td><b>{totalQuantity}</b></td>
                          <td><b>{totalEvents} sự kiện</b></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* mobile */}
                  <div className={styles.mobileHistory}>
                    <div className={styles.totalMobile}>
                      <div><b>Tổng số Khách Hàng:</b> {totalPhones}</div>
                      <div><b>Tổng số lượng phần thưởng:</b> {totalQuantity}</div>
                    </div>
                    {groupedHistory.map((user, index) => (
                      <div key={index} className={styles.historyCard}>

                        <div className={styles.historyPhone}>
                          {maskPhoneNumber(user.numberphone)}
                        </div>

                        <div className={styles.historyName}>
                          {user.hovaten || "chưa cập nhật"}
                        </div>

                        {user.rewards.map((r, i) => (
                          <div key={i} className={styles.historyReward}>
                            <div>
                              <b>Phần thưởng:</b> {r.tenphanthuong}
                            </div>
                            <div>
                              <b>Số lượng:</b> {r.soluong}
                            </div>
                            <div>
                              <b>Sự kiện:</b> {r.tensukien}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                    ))}
                  
                  </div>
                </>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
export default CheckAndApproveReward;
